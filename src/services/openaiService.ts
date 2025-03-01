import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { IssueContext } from '../utils/githubUtils';

export async function explainIssue(issueContext: IssueContext): Promise<string> {
  try {
    const prompt = `
    Please provide a detailed explanation of the following GitHub issue:
    
    Title: ${issueContext.title}
    
    Description:
    ${issueContext.body}
    
    ${issueContext.comments.length > 0 ? `Recent comments:
    ${issueContext.comments.slice(-5).join('\n\n')}` : ''}
    
    Please explain this issue in more detail, clarifying any technical concepts and providing context that might help someone understand the issue better.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that explains GitHub issues in detail." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    return `## Detailed Explanation\n\n${response.choices[0].message.content}`;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Sorry, I encountered an error while trying to explain this issue. Please try again later.';
  }
}

export async function summarizeIssue(issueContext: IssueContext): Promise<string> {
  try {
    const prompt = `
    Please summarize the following GitHub issue in bullet points:
    
    Title: ${issueContext.title}
    
    Description:
    ${issueContext.body}
    
    ${issueContext.comments.length > 0 ? `Recent comments:
    ${issueContext.comments.slice(-5).join('\n\n')}` : ''}
    
    Please provide a concise summary in bullet points that captures the key points of this issue.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes GitHub issues in bullet points." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    return `## Issue Summary\n\n${response.choices[0].message.content}`;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Sorry, I encountered an error while trying to summarize this issue. Please try again later.';
  }
} 