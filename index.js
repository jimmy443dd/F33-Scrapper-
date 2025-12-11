const express = require('express');
const puppeteer = require('puppeteer');
const { validateAndExtractEmails, exportToCSV } = require('./helpers');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Render runs on a specified PORT environment

app.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url || !url.startsWith('http')) {
    // Return HTTP 400 if URL is invalid
    return res.status(400).send({
      error: 'Invalid URL. Please provide a valid URL that starts with http or https.',
    });
  }

  console.log(`Processing URL: ${url}`);

  try {
    const browser = await puppeteer.launch({ headless: true }); // Full Puppeteer instance
    const page = await browser.newPage();

    // Skip unnecessary requests like images or CSS files
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract emails from page content
    const pageContent = await page.content();
    const emails = validateAndExtractEmails(pageContent);

    await browser.close();

    if (emails.length > 0) {
      // Save emails to a CSV file
      const filePath = path.join(__dirname, 'emails.csv');
      exportToCSV(emails, filePath);

      console.log(`Emails extracted:`, emails);

      // Send CSV file for download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="emails.csv"`);
      return res.download(filePath);
    } else {
      console.log('No emails found.');
      return res.status(200).send({ message: 'No emails were found on the given page.' });
    }
  } catch (error) {
    console.error('Error scraping the page:', error);
    return res.status(500).send({
      error: 'An error occurred while processing your request.',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email scraper running on port ${PORT}`);
});
