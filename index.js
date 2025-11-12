console.log('tests works')

const puppeteer = require('puppeteer');

const cron = require('node-cron');

async function bookSeatVizmo() {
  // Launch Chrome in visible mode, with a slight slowdown for debugging
  // const browser = await puppeteer.launch({ 
  //   executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Path to Chrome
  //   headless: false,
  //   slowMo: 50
  // });
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  // const page = await browser.newPage();
  const page = await browser.newPage();

  try {
    // 1. Go to Vizmo login
    await page.goto('https://portal.vizmo.in/login', { waitUntil: 'networkidle2' });

    // 2. Type email (dynamic id, so use type)
    await page.type('input[type="email"]', 'vishal.kumar05@motherson.com');

    // 3. Click the button with inner text "Next"
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim().toLowerCase() === 'next'
      ).click();
    });
    await page.waitForSelector('input[type="password"]', { visible: true });

    // 4. Type password (dynamic id, use type)
    await page.type('input[type="password"]', 'Motherson@009');

    // 5. Click the button with inner text "Login"
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim().toLowerCase() === 'login'
      ).click();
    });

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // 6. Keep the browser open for 1 minute so you can view the page
    console.log('Login successful! The page will remain open for inspection.');
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
// ... your login logic ...
// After navigation to your page
await page.goto('https://portal.vizmo.in/employee/locations/DYz4X32VMbdNEBv0Pj7m/desks/bookings', { waitUntil: 'networkidle2' });



// Get viewport dimensions
const viewport = page.viewport();
const centerX = Math.floor(viewport.width / 2);
const centerY = Math.floor(viewport.height / 2);


// Click at center coordinates
await page.mouse.click(centerX, centerY);
console.log(`Clicked at the center of the page (${centerX}, ${centerY})`);

    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim().toLowerCase() === 'new booking'
      ).click();
    });

await page.waitForSelector('div.dp__main.dp__theme_light[label="Start Time"]', { visible: true });
await page.click('div.dp__main.dp__theme_light[label="Start Time"]');
console.log('Clicked the "Start Time" div!');

await page.waitForSelector('div.dp__inc_dec_button[aria-label="Increment hours"]', { visible: true });
await page.waitForSelector('div.dp__time_display[data-test="hours-toggle-overlay-btn"]', { visible: true });

// Loop: keep clicking until the hour becomes "08"
let hourValue = '';

// <------------------------please uncomment this code after testing for 8:00 am booking----------------------------->

// while (hourValue !== '08') {

while (hourValue !== '05') {
  await page.click('div.dp__inc_dec_button[aria-label="Increment hours"]');
//   await page.waitForTimeout(200); // Small delay for UI to update
  hourValue = await page.$eval('div.dp__time_display[data-test="hours-toggle-overlay-btn"]', el => el.textContent.trim());
  console.log('Current hour display:', hourValue);
}
// console.log('Reached hour "08"!');
await page.evaluate(() => {
  Array.from(document.querySelectorAll('button')).find(btn =>

    // <------------------------please uncomment this code after testing for  AM booking----------------------------->

    // btn.textContent.trim().toLowerCase() === 'am'

    btn.textContent.trim().toLowerCase() === 'pm'
  )?.click();
});
console.log('Clicked the AM button using .evaluate!');

await page.evaluate(() => {
  Array.from(document.querySelectorAll('button')).find(btn =>
    btn.textContent.trim().toLowerCase() === 'ok'
  )?.click();
});
console.log('Clicked the AM button using .evaluate!');


await page.waitForSelector('i.q-icon.vizmo-icons.v-text-dark', { visible: true });
await page.click('i.q-icon.vizmo-icons.v-text-dark');
console.log('Clicked the "floors" icon!');

await page.evaluate(() => {
  Array.from(document.querySelectorAll('div.q-item__label'))
    .find(el => el.textContent.includes('Old Building Second Floor'))?.click();
});
console.log('Clicked the "Old Building Second Floor" label by text!');

await page.waitForSelector('i.q-icon.vizmo-icons.cursor-pointer.v-text-dark', { visible: true });
await page.click('i.q-icon.vizmo-icons.cursor-pointer.v-text-dark');
console.log('Clicked the "floors" icon!');

await page.waitForSelector('div.q-item__label', { visible: true });
await page.evaluate(() => {
  Array.from(document.querySelectorAll('div.q-item__label'))
    .find(el => el.textContent.includes('02F-007'))?.click();
});
console.log('Clicked the div with 02F-089!');

 await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(btn =>
        btn.textContent.trim().toLowerCase() === 'book'
      ).click();
    });

// Optional: Wait so you can review the page
await new Promise(r => setTimeout(r, 60000));


  } catch (error) {
    console.error('Automation failed:', error);
  } finally {
    // Closing the browser is optional if you want to keep it open manually
    // await browser.close();
  }
}
  bookSeatVizmo();
// cron.schedule('0 53 21 * * *', () => {
//   // Your function to run daily at 21:04:00 (9:04 PM)
//   bookSeatVizmo();
// });
