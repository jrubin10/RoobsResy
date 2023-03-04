require('dotenv').config();
//INSTRUCTIONS: You need a .env file that has your details for the JR_... variables below

let request = require('request');
const cookieJar = request.jar();
request = request.defaults({jar:cookieJar})

const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;
const fs = require('fs');
const JR_X_ResyAuth = fs.readFileSync('./auth.json', 'utf-8');
const cron = require('node-cron');
const { getBookToken } = require('./app');

//Simple Version of POST request to make the reservation
async function makeBooking(API_bookToken,resRGS) {
  let baseUrl='https://api.resy.com/3/book?';
  let paymentMethodId=5753141;
  console.log ("Testing:"+baseUrl+"-->"+API_bookToken);
    return new Promise((resolve, reject) => {
      const makeBookOptions = 
      {
        'method': 'POST',
        'url': 'https://api.resy.com/3/book',
        'headers': {
          authority: 'api.resy.com',
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'authorization': JR_ResyAPI,
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
          'origin': 'https://widgets.resy.com',
          'referer': 'https://widgets.resy.com/',
          'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          'x-origin': 'https://widgets.resy.com',
          'x-resy-auth-token': JR_X_ResyAuth,
          'x-resy-universal-auth': JR_X_ResyAuth
        },
        form: {
          'book_token': API_bookToken,
          'struct_payment_method': '{"id":5753141}',
          'source_id': 'resy.com-venue-details'
        },
        //Commented out when the booking worked with payment with the rest of the form data above
      // {
      //   method: 'POST',
      //   url: `${baseUrl}?`,
      //   headers: {
      //     'X-Resy-Auth-Token':JR_X_ResyAuth,
      //     Authorization: JR_ResyAPI
      //   },
      //   formData: {
      //     'book_token': API_bookToken,
      //     'struct_payment_method': '{"id":5753141}',
      //     'source_id': 'resy.com-venue-details'
      //   },
        rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
      };
  
      console.log('Request options:', makeBookOptions);

      request(makeBookOptions, function (error, response, body) {
        if (error) {
          reject(error);
          return;
        }
  
        if (response.statusCode === 200 || response.statusCode===201) {
          console.log(resRGS+': Make Booking API call successful');
          const data = JSON.parse(body);
          const makeBookID = data.reservation_id;
          resolve(makeBookID);
        } else {
        console.log(resRGS+':Make Booking API call unsuccessful, status code:', response.statusCode);
        console.log("     "+makeBookOptions)
        }

      });
    });
  };
  
//SET PARAMETERS  
var FindBaseUrl = 'https://api.resy.com/4/find';
var TokenBaseUrl = 'https://api.resy.com/3/details';
var MakeBaseUrl ='https://api.resy.com/3/book';
var lat = '40.722653';
var long = '-73.998739';
var day = '2023-03-13';
var EarliestTime ="17:45:00"
var LatestTime ="20:00:00"
let timeArray=["17:45:00","18:00:00","18:15:00","18:30:00","18:45:00","19:00:00","19:15:00","19:30:00","19:45:00","20:00:00"];
var partySize = '4';
var venueId='60058';//monkeybar
var templateId='2057534';
var templateNum='3';
//var venueId = '66436';//empellon
var rgsCodePart1 = `rgs://resy/${venueId}/${templateId}/${templateNum}/${day}/${day}/`
var rgsCodePart2 = `/5/Dining Room`;
const rgsCodesArray = timeArray.map(time => `rgs://resy/${venueId}/${templateId}/${templateNum}/${day}/${day}/${time}/5/Dining Room`);
var bookToken;


async function getBookingTokenArray() {
  const bookingArray = await Promise.all(rgsCodesArray.map(async (rgscodes) => {
    const bookingToken = await getBookToken(TokenBaseUrl, day, partySize, rgscodes);
    return {
      'TokenBaseUrl': TokenBaseUrl,
      'day': day,
      'partySize': partySize,
      'rgscodes': rgscodes,
      'bookingToken': bookingToken
    };
  }));
  const jsonData = JSON.stringify(bookingArray);
  fs.writeFileSync('BookingArray.json', jsonData);
  return bookingArray;
}

// Extract booking tokens and rgs codes from JSON file
async function extractBookingTokensAndRgsCodes(jsonFile) {
  const jsonData = await new Promise((resolve, reject) => {
    fs.readFile(jsonFile, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
  return jsonData.map((bookingObj) => ({
    bookingToken: bookingObj.bookingToken,
    rgscodes: bookingObj.rgscodes
  }));
}

// Make multiple bookings with booking codes and rgs codes
async function makeMultipleBookings(bookingCodesArray) {
  const promises = bookingCodesArray.map(({ bookingToken, rgscodes }) => {
    console.log(bookingToken+"::"+rgscodes+";");
    return makeBooking(bookingToken, rgscodes);
  });
  return Promise.all(promises);
}


async function main()
{
await getBookingTokenArray();
const bookingTokensAndRgsCodesArray = await extractBookingTokensAndRgsCodes("BookingArray.json");
await makeMultipleBookings(bookingTokensAndRgsCodesArray);
}

//--------------------------------------------
//---------RUN THE JOB-----------------------
//Cron Job Schedules the tasks

//--------------------------------------------
cron.schedule('0 9 * * *', main);