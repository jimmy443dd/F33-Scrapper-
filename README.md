# Email Scraper Tool for Serverless Environments

This is a serverless tool that uses Puppeteer to scrape emails from any given URL. It extracts valid email addresses (`@gmail`, `@yahoo`, etc.) from webpage content and exports them as a CSV file.

## Features:
- Scrapes emails from any URL.
- Optimized for serverless environments (e.g., Vercel).
- Deduplicates and validates extracted email addresses.
- Generates a downloadable CSV file with extraction results.
- Logs the scraping process for debugging.

## Prerequisites:
- **Node.js** (18.x recommended)
- A [Vercel](https://vercel.com/) account

## Instructions to Run Locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/email-scraper.git
   ```
2. Navigate to the project directory:
   ```bash
   cd email-scraper
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the application:
   ```bash
   npm start
   ```
5. Enter the URL to scrape when prompted.

## Deployment on Vercel:
1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Deploy the project.
4. Use your deployed endpoint (e.g., `https://your-deployment.vercel.app/?url=https://example.com`) to scrape emails.

## Notes:
- Ensure the provided URL starts with `http://` or `https://`.
- Do not violate website terms of service when scraping!
- For extensive scraping needs, consider using Render for longer execution times.

## Example Endpoint:
```bash
https://your-vercel-deployment.vercel.app/?url=https://example.com
```
