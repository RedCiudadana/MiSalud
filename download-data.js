/* eslint-env node */

const SHEET_ID = '14lIT9A9SNYV27HkA-KrxyZjLt3YHhWRI11XKWy_Z8KA';
const GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCOhFkT9LHVScoH\n9pMvbIhwF83vjckcfdzdbTXBhA3PyrCZrnEcejwtrexSyh5JS5YyTsJR3KOwi5D6\nHXznzioLIhTPgKa7yS+i6i6v3trTK7qHh7bmm1Uh/1OPNVvY4GeqeWOmJXl+p4cp\n61l4z0UOvSEeRNqX7aKYBQo+9PWJiiyf7TyUGxWFbSLT/zJXcLBrjrzgSZFX6FvB\nl0SnN0QY8eXyDi3BCV1HsFbnQ5nv3Ip1gaYLwJvS1ubRWahnJy8AY9dE/Z+/xm00\nvH9WU1+CXi1g69kbJfq2ku0oxD3C9WvW+HCjKF4Iwn1XPADbHbtWHbY3zkuwd/er\nIO/Cu+ZHAgMBAAECggEAKN3Bj0vczIzOrm7hsLkd/IqO5lDRaOacdTASOI3tyfZU\nopTXYXOZmv2i5PCJM7pFdOKJrSCoHYE/zsCy5uOCwdOBhSjeZr2fd8dQIOU1+VSy\nNZfQdhr3k/qbktaZojxi7YrGbMeVKaDPTNFsRAynQD0yaHQU/HjLZW0YjYn/eHMl\ni7GsiutcRpdOVWbWgReKN0GE/fS2SAjq19xSrFPyib+zI3DE3uPWWyF4P05ZvV7d\nnjHwowMLCi7KRQLD2/PFNbpZrt0MhD/WkS8+C2jygQEr5A+C3hlXA5D43puesD1s\n9ilZooAAexwTenAWl2m19fX+hqtLv3sHrI+ZZfqD1QKBgQDG3Fm7tybnMByyoA4D\nsiK/hKBm/6UoVr6OWs4lePk8GINZoLLQQ94KnxETCpOtNe2rySx52F5He+gbFFxP\n7uAKOSQxq5DjMDe1lnKaASAKJdxKU1aXFzf717xdH2LiRDApYJ1N257FLXcEJCSo\nvhvvbo1EmhEDIt6oJhNRFDcs+wKBgQC3d4Fh3SqSotTpMBrlPDofeuNaNbRyh7Po\nkVVGpk8aHevUHPBexGzrIOIv40W3c+KOJmcaI1PcmFmjLhpsq0IYJnt91Ru+8owK\n/obvV97h1/VfaoYJJ1ofTorezrHlaS1qBw5o/5lN1hOew2gVhteysaBxjXoCkh/i\nf3wVu+5SJQKBgQCk1wEXBnIcD5iqRNx5Gc+N++1Ok7ke4BDjRcg97bKDqzouMHQp\nCSjkmwh3RTw2x041KPRSKBW2obI7yDvhEnzqXIVxGutmN5DmWEi0+hvJ7apWfhB3\n/AovG5yLgLniH23gzrJ2WIeaoN5YM3Gj4rqbVYOKiz9w3xW8QpueiOhXwwKBgAgc\n3rnHH+TQEn4lRGsymJdfxcHtcgdGfOwh0RWIsSLEg/MjPHXUVcSn9ZiMgj60fyYu\nCI0dVs4AZqZSmZSIlimfOgK8c7ej3hF2Y90dk5uFAzKu8TJibRfJT1a+6Rrt5bY0\njayS8OKCPufcWDPrfIpIVIHw8Z4/e+12GbSUVNuJAoGAYMTv1GIdopc3paSpwOB1\nfZLObHBvIlldKDyryLUnMs1cvl5t8NuCKOdA0o6b2OcAabOeOAXfHhYMi/mb/C2o\nkKPN5M6WnajZhNAyBD7SNvbNxqo616QmMkPlQbC6Ko8qNCAjWzAcRbI49Nc6oAhb\nj3h4NaT2skO4Ov/QF+4TXIU=\n-----END PRIVATE KEY-----\n';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = 'nuestrasalud-development@spreadsheetcms-261319.iam.gserviceaccount.com';

const gsjson = require('google-spreadsheet-to-json');
// const fs = require('fs');
// const path = require('path');
// const jsonfile = require('jsonfile');

gsjson({
  spreadsheetId: SHEET_ID,
  private_key: GOOGLE_PRIVATE_KEY,
  client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
})
  .then(function (result) {
    console.log(result);
    // console.log(result.length);
    // console.log('succes');
    // console.log(result);
    // var file = 'result.json';
    // jsonfile.spaces = 2;
    // jsonfile.writeFileSync(file, result);
  })
  .catch(function (err) {
    console.log('error');
    console.log(err.message);
    console.log(err.stack);
  });

// const { GoogleSpreadsheet } = require('google-spreadsheet');

// const doc = new GoogleSpreadsheet(SHEET_ID);

// async function download() {
//   await doc.useServiceAccountAuth({
//     client_email: /* process.env. */GOOGLE_SERVICE_ACCOUNT_EMAIL,
//     private_key: /* process.env. */GOOGLE_PRIVATE_KEY,
//   });

//   await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc.title);

//   const sheet = doc.sheetsByIndex[0];
//   const rows = await sheet.getRows();

//   console.log(rows);
// }


// download()
