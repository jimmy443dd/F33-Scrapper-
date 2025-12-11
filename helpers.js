const fs = require('fs');

/**
 * Validate and extract emails from text content.
 * @param {string} text - HTML or plain text content from a webpage.
 * @returns {string[]} - Array of unique email addresses.
 */
function validateAndExtractEmails(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex) || [];
  return [...new Set(emails)]; // Return deduplicated emails
}

/**
 * Export emails to a CSV file.
 * @param {string[]} emails - Array of email addresses.
 * @param {string} filePath - Path to save the CSV file.
 */
function exportToCSV(emails, filePath) {
  const csvContent = 'Email\n' + emails.join('\n');
  fs.writeFileSync(filePath, csvContent, 'utf8'); // Write to CSV
  console.log(`CSV file created at: ${filePath}`);
}

module.exports = { validateAndExtractEmails, exportToCSV };
