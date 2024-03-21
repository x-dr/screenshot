import puppeteer from "puppeteer";
(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'], // Add --no-sandbox flag
        // defaultViewport: { width: 800, height: 600 },
        executablePath: "/usr/bin/chromium-browser",
        // ignoreHTTPSErrors: true,
        // ignoreDefaultArgs: ['--disable-extensions'],
    });
    
    const page = await browser.newPage();

    await page.goto('https://www.tryxd.cn/');
    await page.waitForSelector('body'); // 等待页面加载完成
    await page.screenshot({ path: 'example.png' });
    browser.close();
})();


