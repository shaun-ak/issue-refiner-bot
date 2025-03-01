# GitHub Issue Refiner Bot

A GitHub bot that helps explain and summarize issues using OpenAI.

## Features

- `/explain` - Provides a detailed explanation of the issue
- `/summarize` - Summarizes the issue in bullet points

## Installation

1. Clone this repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Build the project with `npm run build`
5. Start the server with `npm start`

## Setup on GitHub

1. Create a GitHub App at https://github.com/settings/apps/new
   - Set the Webhook URL to your server's URL (e.g., `https://your-server.com/webhook`)
   - Generate a webhook secret and add it to your `.env` file
   - Grant the app permissions to read and write issues and issue comments
   - Subscribe to the "Issue comments" event

2. Install the GitHub App on your repositories

## Usage

In any issue where the bot is installed, you can use the following commands:

- `/explain` - The bot will provide a detailed explanation of the issue
- `/summarize` - The bot will summarize the issue in bullet points

## Development

- Run in development mode: `npm run dev`
- Run tests: `npm test`

## License

MIT 
