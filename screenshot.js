import puppeteer from "puppeteer-core";
import { KnownDevices } from 'puppeteer-core';
import chromium from "@sparticuz/chromium";
import path from 'path';
const __dirname = path.resolve();


const handler = async (targetUrl, isMobile, xy) => {

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
        // Optional: If you'd like to use the new headless mode. "shell" is the default.
        // NOTE: Because we build the shell binary, this option does not work.
        //       However, this option will stay so when we migrate to full chromium it will work.
        chromium.setHeadlessMode = true;

        // Optional: If you'd like to disable webgl, true is the default.
        chromium.setGraphicsMode = false;

        // Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
        await chromium.font(
            "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
        );
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox'], // Add --no-sandbox flag
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        let page = await browser.newPage();
        if (xy) {
            const viewport = xy.split('x')
            viewport = {
                width: Math.abs(viewport[0]),
                height: Math.abs(viewport[1])
            }
            await page.setViewport(viewport) // 设置页面大小
        }
        if (isMobile) {
            const iPhone = KnownDevices['iPhone 13'];
            await page.emulate(iPhone)
        }

        // await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

        page.setDefaultNavigationTimeout(80000);
        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
        });

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

        // await new Promise(resolve => setTimeout(resolve, 5000)); // 等待 5000 毫秒（即 5 秒）




        const screenshotBuffer = await page.screenshot({ fullPage: true });
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
        const { url, isMobile, xy } = ctx.method === 'POST' ? ctx.request.body : ctx.request.query;
        const data = await handler(url, isMobile, xy);
        ctx.status = 200;
        ctx.response.set('Content-Type', 'image/png'); // 设置内容类型为图片类型
        ctx.body = Buffer.from(data.image, 'base64'); // 将 base64 编码的图片数据转换为 buffer
    } catch (e) {
        ctx.status = 500;
        ctx.body = { message: e.message };
    }
}


export default getImg;