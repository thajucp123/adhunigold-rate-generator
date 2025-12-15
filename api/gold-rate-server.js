const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 5000;
const GOLD_SITE_URL = 'https://adhunigold.webbyz.com'; // <-- REPLACE THIS

// Enable CORS for all routes (important for your React app)
app.use(cors());

app.get('/api/gold-rate', async (req, res) => {
    try {
        // Step 1: Fetch the HTML content of the target website
        const response = await axios.get(GOLD_SITE_URL);
        const html = response.data;
        
        // Step 2: Load the HTML into Cheerio
        const $ = cheerio.load(html);
        
        // Step 3: Find and extract the 1-gram gold rate
        // *** You must inspect the target website's HTML to find the correct selector ***
       
// 1. Find the <p> tag that specifically contains the text "1 Gram"
    const oneGramTextElement = $('p').filter(function() {
        // .text() gets the text content of the element
        // .trim() removes leading/trailing whitespace
        return $(this).text().trim() === '1 Gram';
    });
    
    // Check if we found the "1 Gram" element
    if (oneGramTextElement.length === 0) {
        return res.status(404).json({ 
            success: false, 
            message: 'Label "1 Gram" not found on page.' 
        });
    }

    // 2. Navigate to the sibling element containing the price.
    // The price (the <span> tag) is a sibling of the <p> tag we just found.
    // .siblings('span') finds all siblings that are <span> elements.
    const rateElement = oneGramTextElement.siblings('span'); 
    
    if (rateElement.length > 0) {
        let rawRate = rateElement.first().text().trim(); // Use .first() in case of multiple siblings
        
        // Clean up: remove all non-digit and non-dot characters (including currency symbols, etc.)
        // This is robust against symbols like '₹' or commas.
        let oneGramRate = parseFloat(rawRate.replace(/[^\d.]/g, '')); 
        
        if (isNaN(oneGramRate)) {
            return res.status(500).json({ success: false, message: 'Extracted value is not a valid number.' });
        }

        return res.status(200).json({
            success: true,
            rate: oneGramRate,
            timestamp: new Date().toISOString()
        });
    } else {
        return res.status(404).json({ 
            success: false, 
            message: 'Price <span> element not found next to "1 Gram" label.' 
        });

        }

    } catch (error) {
        console.error('Scraping Error:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch data from the gold website.' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js Proxy running on http://localhost:${PORT}`);
});
