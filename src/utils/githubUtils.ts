import { Octokit } from 'octokit';

export interface IssueContext {
  title: string;
  body: string;
  comments: string[];
}

export async function getIssueContext(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<IssueContext> {
  // Get issue details
  const { data: issue } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  // Get issue comments
  const { data: commentsData } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });

  // Extract comment bodies
  const comments = commentsData.map(comment => comment.body || '');

  return {
    title: issue.title,
    body: issue.body || '',
    comments,
  };
} 