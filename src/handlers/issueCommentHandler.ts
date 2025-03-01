import { Octokit } from 'octokit';
import { getIssueContext } from '../utils/githubUtils';
import { explainIssue, summarizeIssue } from '../services/openaiService';

export async function handleIssueComment(payload: any, octokit: Octokit) {
  const commentBody = payload.comment.body.trim();
  
  // Check if the comment contains our commands
  if (!commentBody.startsWith('/explain') && !commentBody.startsWith('/summarize')) {
    return;
  }
  
  const repo = payload.repository.name;
  const owner = payload.repository.owner.login;
  const issueNumber = payload.issue.number;
  
  try {
    // Get the issue context (title, body, and comments)
    const issueContext = await getIssueContext(octokit, owner, repo, issueNumber);
    
    let responseText = '';
    
    // Process the command
    if (commentBody.startsWith('/explain')) {
      console.log(`Processing /explain command for issue #${issueNumber}`);
      responseText = await explainIssue(issueContext);
    } else if (commentBody.startsWith('/summarize')) {
      console.log(`Processing /summarize command for issue #${issueNumber}`);
      responseText = await summarizeIssue(issueContext);
    }
    
    // Post the response as a comment
    if (responseText) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: responseText,
      });
    }
  } catch (error) {
    console.error('Error handling issue comment:', error);
    
    // Post error message as a comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `Sorry, I encountered an error while processing your request. Please try again later.`,
    });
  }
} 