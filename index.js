const puppeteer = require('puppeteer');

/**
 * Sends a query to the YouChat API and returns the response.
 * @param {string} query - The query to send to the API.
 * @returns {string} - The response from the API.
 */
async function youChat(query) {
  // Launch a new browser instance and create a new page.
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Encode the query for use in the API URL.
  let input = encodeURI(query.toLowerCase());

  // Create a new Promise that will resolve with the API response.
  const output = new Promise((resolve, reject) => {
    // Listen for responses from the API.
    page.on('response', async (response) => {
      // If the response is from the correct API endpoint, process the response.
      if (response.url() == `https://you.com/api/youchatStreaming?question=${input}&chat=%5B%5D`) {
        var text = await response.text();
        var array = text.split('event: token').slice(1).slice(0, -2);
        var jsonArray = array.map(a => JSON.parse(a.replace(`\ndata: `, '').replace(`\n\n`, '')).token);
        // Resolve the Promise with the processed response.
        resolve(jsonArray.join("").trim());
      }
    });
  });

  // Send the query to the API.
  await page.goto(`https://you.com/api/youchatStreaming?question=${input}&chat=%5B%5D`, { waitUntil: 'networkidle0' });

  // Close the browser instance.
  await browser.close();

  // Return the Promise with the API response.
  return await output;
}

module.exports = { youChat };