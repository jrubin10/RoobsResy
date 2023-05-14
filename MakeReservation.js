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
//const { connectToMongoDB } = require('./createMongo');
//const RestaurantDetails = require('./model/RestaurantDetailsSchema')

//Simple Version of POST request to make the reservation

async function makeBooking(API_bookToken,resRGS) {
  let baseUrl='https://api.resy.com/3/book';
  console.log ("Testing:"+baseUrl+"-->"+API_bookToken);
    return new Promise((resolve, reject) => {
      const makeBookOptions = 
      {
  'method': 'POST',
  'url': baseUrl,
  'headers': {
    'X-Origin': 'https://widgets.resy.com',
    'X-Resy-Auth-Token': JR_X_ResyAuth,
    'Authorization': JR_ResyAPI,
    'X-Resy-Universal-Auth': JR_X_ResyAuth,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
    'sec-ch-ua-platform': '"Windows"'
  },
  form: {
    'book_token': API_bookToken,
    'source_id': 'resy.com-venue-details',
    'struct_payment_method': '{"id":16674935}'
  }
        //rejectUnauthorized: false}\ // NOT RECOMMENDED - TEMPORARY FOR TESTING
  };
      console.log(makeBookOptions);

      request(makeBookOptions, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });

      // request(makeBookOptions, function (error, response, body) {
      //   if (error) {
      //     console.log(response.body);
      //     reject(error);
      //     return;
      //   }
  
  //       if (response.statusCode === 200 || response.statusCode===201) {
  //         console.log(resRGS+': Make Booking API call successful');
  //         const data = JSON.parse(body);
  //         const makeBookID = data.reservation_id;
  //         resolve(makeBookID);
  //       } else {
  //       console.log(resRGS+':Make Booking API call unsuccessful, status code:', response.statusCode);
  //       console.log("     "+makeBookOptions)
  //       }

  //     });
   });
};
  
//SET PARAMETERS  
var FindBaseUrl = 'https://api.resy.com/4/find';
var TokenBaseUrl = 'https://api.resy.com/3/details';
var MakeBaseUrl ='https://api.resy.com/3/book';
var lat = '40.722653';
var long = '-73.998739';

//These lines don't work since the date isn't a string format-------------
//const today = new Date();
//const nextMonth = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
//-------------------------------------

var day = "2023-05-30";
var EarliestTime ="18:00:00"
var LatestTime ="20:00:00"
//This will need to be updated per restaurant
let timeArray=["18:00:00","18:15:00","18:30:00","18:45:00","19:00:00","19:15:00","19:30:00","19:45:00","20:00:00"];
var partySize = '4';
//var venueIdTemplateNum='60058/2122015/2';//monkeybar
//var venueIdTemplateNum='66436/1925173/2';//empellon
var venueIdTemplateNum='64593/1993073/2' //TOrrissi
var tableType='Dining Room'//for Torrissi

const rgsCodesArray = timeArray.map(time => `rgs://resy/${venueIdTemplateNum}/${day}/${day}/${time}/${partySize}/${tableType}`);
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

async function saveRestaurantDetails()
{
await connectToMongoDB();

}

//--------------------------------------------
//---------RUN THE JOB-----------------------
//Cron Job Schedules the tasks
//cron.schedule('3 0 10 * * *', main);
//--------------------------------------------

main();
//saveRestaurantDetails();