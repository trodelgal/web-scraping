const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()
    await page.goto('https://company.ironsrc.com/careers-tel-aviv')

    // let button = await page.$('button[class="sc_btn"]');
    let button = await page.$('.load-more > .sc_btn');
    while(button){
        console.log("clicked");
        await button.click()
        button = await page.$('.load-more > .sc_btn');
    }
    const jobsContainer = await page.$$('div[class="container career-item"] > div[class="careers-loop-item"] > div[class="row"] > div[class = "col-md-4"]');
    const jobsTitle = await Promise.all(jobsContainer.map(div=>div.$('h5 > a')))
    // console.log("1",jobsTitle[0]);
    const jobs = await page.$$('div[class="container career-item"] > div[class="careers-loop-item"] > div[class="row"] > div[class = "col-md-4"] > h5 > a')
    // console.log("2",jobs[0]);
    const title = await Promise.all(jobsTitle.map(job => job && job.evaluate(node => node.innerHTML)).filter(job => job));
    console.log(title);
    const linksHref = await Promise.all(jobsTitle.map(link => link.getProperty("href")))
    const linksHrefValues = await Promise.all(linksHref.map(link =>link.jsonValue()))
    console.log(linksHrefValues);  
    // const jobsLables = await page.$$('div[class="container career-item"] > div[class="careers-loop-item"] > div[class="row"] > div[class = "col-md-4"] > div[class = "tags"]')
    // console.log(jobsLables);
    
})()