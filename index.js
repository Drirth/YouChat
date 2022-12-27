const puppeteer = require('puppeteer')

async function youChat(query) {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
    
        let input = encodeURI(query.toLowerCase())
    
        const output = new Promise((resolve, reject) => {
                page.on('response', async (response) => {
                    if (response.url() == `https://you.com/api/youchatStreaming?question=${input}&chat=%5B%5D`) {
                        var text = await response.text()
                        var array = text.split('event: token').slice(1).slice(0, -2)
                        var jsonArray = array.map(a => JSON.parse(a.replace(`\ndata: `, '').replace(`\n\n`, '')).token)
                        resolve(jsonArray.join("").trim());
                    } 
                });
            })
    
        await page.goto(`https://you.com/api/youchatStreaming?question=${input}&chat=%5B%5D`, { waitUntil: 'networkidle0' });
    
        await browser.close();
    
        return await output
}

module.exports = { youChat };