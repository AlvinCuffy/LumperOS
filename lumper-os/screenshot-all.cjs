const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { file: 'dashboard-home.html',   out: 'ss-dashboard.png'  },
  { file: 'mileage-tracker.html',  out: 'ss-mileage.png'    },
  { file: 'tax-summary.html',      out: 'ss-tax.png'        },
  { file: 'log-job.html',          out: 'ss-log-job.png'    },
  { file: 'company-pipeline.html', out: 'ss-pipeline.png'   },
];

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const { file, out } of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    const filePath = 'file://' + path.resolve('prototypes/' + file);
    await page.goto(filePath, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'prototypes/' + out, fullPage: true });
    await page.close();
    console.log('Saved: ' + out);
  }

  await browser.close();
  console.log('All screenshots done.');
})();
