import express from 'express';
import dotenv from 'dotenv';
import { Webhooks } from '@octokit/webhooks';
import { Octokit } from 'octokit';
import { handleIssueComment } from './handlers/issueCommentHandler';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize GitHub webhook handler
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || '',
});

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Handle issue comment events
webhooks.on('issue_comment.created', async (event) => {
  try {
    await handleIssueComment(event.payload, octokit);
  } catch (error) {
    console.error('Error handling issue comment:', error);
  }
});

// Set up webhook endpoint
app.post('/webhook', express.json(), (req, res) => {
  // Get the event name from headers
  const eventName = req.headers['x-github-event'] as string;
  
  // Verify the webhook signature
  const signature = req.headers['x-hub-signature-256'] as string;
  const id = req.headers['x-github-delivery'] as string;
  const payload = req.body;
  
  // Use the verify method first to check the signature
  if (!webhooks.verify(payload, signature)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid webhook signature');
  }
  
  // Then manually receive the event
  webhooks.receive({
    id: id,
    name: eventName as any, // Type assertion to bypass the type checking
    payload: payload
  }).then(() => {
    res.status(200).send('Webhook received');
  }).catch((error) => {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 