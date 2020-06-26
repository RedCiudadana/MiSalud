/* eslint-disable */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_KEY);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  doc.sheetsByIndex.forEach(async (sheet) => {
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

    let jsonText = JSON.stringify(data);

    let userToken = `${process.env.GITHUB_SECURITY_USER}:${process.env.GITHUB_SECURITY_TOKEN}`;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/public/static-files/${title}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${btoa(userToken)}`,
          },
          body: {
            message: `[netlify functions] Upload data ${title}`,
            committer: {
              name: 'DevRedCiudadana',
              email: 'dev@redciudadana.org.gt',
            },
            content: btoa(jsonText),
          }
        }
      );

      if (!response.ok) {
        console.log(`${title} parsed!`);
        return { statusCode: response.status, body: response.statusText };
      }
      const data = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({ msg: data.joke }),
      };
    } catch (err) {
      console.log(`Error parsing ${title}, ${err}`); // output to netlify function log

      return {
        statusCode: 500,
        body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
      };
    }
  });
};
