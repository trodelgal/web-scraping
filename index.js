const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://company.ironsrc.com/careers-tel-aviv");
  let button = await page.$(".load-more > .sc_btn");
  while (button) {
    console.log("clicked");
    await button.click();
    button = await page.$(".load-more > .sc_btn");
  }
  const jobs = await page.$$(
    'div[class="container career-item"] > div[class="careers-loop-item"] > div[class="row"] > div[class = "col-md-4"] > h5 > a'
  );
  const title = await Promise.all(
    jobs.map((job) => job.evaluate((node) => node.innerHTML))
  );
  const linksHref = await Promise.all(
    jobs.map((link) => link.getProperty("href"))
  );
  const linksHrefValues = await Promise.all(
    linksHref.map((link) => link.jsonValue())
  );
  const jobsLabels = await page.$$(
    'div[class="container career-item"] > div[class="careers-loop-item"] > div[class="row"] > div[class = "col-md-4"] > div[class = "tags"]'
  );

  const labelsArr = await Promise.all(
    jobsLabels.map((div) =>
      div.$$eval(" span", (node) => node.map((n) => n.innerHTML))
    )
  );
  let data = [];
  for (let i = 0; i < title.length; i++) {
    data.push({
      title: title[i],
      link: linksHrefValues[i],
      labels: labelsArr[i],
    });
  }
  let dataJson = await fs.readFile("./jobs.json");
  const existData = JSON.parse(dataJson);
  let newJobs = [];
  data.forEach((job) => {
    if (!existData.some((exist) => exist.link === job.link)) newJobs.push(job);
  });
  await fs.writeFile("./newJobs.json", JSON.stringify(newJobs, null, 2));
  await fs.writeFile("./jobs.json", JSON.stringify(data, null, 2));
  browser.close()
})();
