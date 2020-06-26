/* eslint-env node */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

async function init() {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_KEY);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  // console.log(process.env.GOOGLE_PRIVATE_KEY);
  // console.log(creds.private_key);

  // await doc.useServiceAccountAuth(creds);

  // // OR load directly from json file if not in secure environment
  // await doc.useServiceAccountAuth(require('./creds-from-google.json'));
  // // OR use API key -- only for read-only access to public sheets
  // doc.useApiKey('YOUR-API-KEY');

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  // await doc.updateProperties({ title: 'renamed doc' });

  // const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  doc.sheetsByIndex.forEach(async (sheet) => {
    console.log(`Parsing sheet ${sheet.title}`);

    let rows = await sheet.getRows();

    let title = sheet.title;
    let headers = rows[0]._sheet.headerValues;

    let data = [];

    rows.forEach((row) => {
      let rowObj = {};
      headers.forEach((header) => {
        rowObj[header] = row[header];
      });

      data.push(rowObj);
    });

    fs.writeFile(`public/static-files/${title}.json`, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.error(err);
      }
    });

    console.log(`${title} parsed!`);
  });
}

init();
