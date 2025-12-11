const fs = require('fs');

/**
 * Validate and extract emails from text content.
 * @param {string} text - The text content of a webpage.
 * @returns {string[]} - An array of unique emails.
 */
function validateAndExtractEmails(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex) || [];
  return [...new Set(emails)]; // Deduplicate emails
}

/**
 * Export emails to a CSV file.
 * @param {string[]} emails - The list of emails.
 * @param {string} filePath - File path for the CSV file.
 */
function exportToCSV(emails, filePath) {
  const csvContent = 'Email\n' + emails.join('\n');
  fs.writeFileSync(filePath, csvContent, 'utf8');
  console.log(`CSV exported successfully to: ${filePath}`);
}

module.exports = { validateAndExtractEmails, exportToCSV };
