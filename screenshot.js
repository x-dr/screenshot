import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";


const handler = async (targetUrl) => {

    if (!targetUrl) {
        throw new Error('URL is missing from queryStringParameters');
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'http://' + targetUrl;
    }

    try {
        new URL(targetUrl);
    } catch (error) {
        throw new Error('URL provided is invalid');
    }

    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox'], // Add --no-sandbox flag
            defaultViewport: { width: 800, height: 600 },
            executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
            headless: true,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        let page = await browser.newPage();

        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
        page.setDefaultNavigationTimeout(8000);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

        await page.evaluate(() => {
            const selector = 'body';
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (!element) {
                    reject(new Error(`Error: No element found with selector: ${selector}`));
                }
                resolve();
            });
        });

        const screenshotBuffer = await page.screenshot();
        const base64Screenshot = screenshotBuffer.toString('base64');
        return { image: base64Screenshot };

    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};




const getImg = async (ctx) => {
    try {
      const url = ctx.method === 'POST' ? ctx.request.body.url : ctx.request.query.url;
      const data = await handler(url);
      ctx.status = 200;
      ctx.response.set('Content-Type', 'image/png'); // 设置内容类型为图片类型
      ctx.body = Buffer.from(data.image, 'base64'); // 将 base64 编码的图片数据转换为 buffer
    } catch (e) {
      ctx.status = 500;
      ctx.body = { message: e.message };
    }
  }


export default getImg;