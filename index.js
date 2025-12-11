const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const { validateAndExtractEmails, exportToCSV } = require('./helpers');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send({
      error: 'Please provide a valid URL. Ensure it starts with http or https.',
    });
  }

  console.log(`Scraping emails from: ${url}...`);

  try {
    // Launch Puppeteer with Lambda-compatible Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath, // Lambda-compatible Chromium
      headless: true,
    });

    const page = await browser.newPage();

    // Skip unnecessary requests (e.g., images, styles)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract text content and emails
    const pageContent = await page.content();
    const emails = validateAndExtractEmails(pageContent);

    await browser.close();

    if (emails.length > 0) {
      // Export emails to a downloadable CSV
      const filePath = `/tmp/emails.csv`; // Temporary path for serverless environments
      exportToCSV(emails, filePath);

      console.log(`Found ${emails.length} emails:`, emails);

      // Send downloadable CSV as a response
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=emails.csv');
      return res.status(200).sendFile(filePath);
    } else {
      console.log('No emails found!');
      return res.status(200).json({ message: 'No emails found on the page.' });
    }
  } catch (error) {
    console.error('Error during scraping:', error.message);
    return res.status(500).send({
      error: 'An error occurred during scraping. Please try again.',
    });
  }
};
