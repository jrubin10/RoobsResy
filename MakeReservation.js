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

async function makeBooking(API_bookToken, resRGS) {
  let baseUrl = 'https://api.resy.com/3/book';
  console.log("Testing:" + baseUrl + "-->" + API_bookToken);
  return new Promise((resolve, reject) => {
    const makeBookOptions = {
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
    };

    console.log(makeBookOptions);

    request(makeBookOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        const responseBody = JSON.parse(response.body);
        console.log("Booking Result:", responseBody);

        if (responseBody.hasOwnProperty("reservation_id")) {
          resolve({ success: true, body: responseBody }); // Resolve the promise for a successful booking
        } else {
          resolve({ success: false, body: responseBody }); // Resolve the promise for an unsuccessful booking
        }
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

var day = "2023-07-02";
var EarliestTime ="18:30:00"
var LatestTime ="20:00:00"
//This will need to be updated per restaurant
let timeArray=["18:30:00","18:45:00","19:00:00","19:15:00","19:30:00","19:45:00","20:00:00"];
var partySize = '4';
//var venueIdTemplateNum='60058/2122015/2';//monkeybar
//var venueIdTemplateNum='66436/1943671/2';//empellon //NEED TO TURN THIS INTO ARRAY OF ALL POSSIBLE COMBOS
//var tableType='Outside';//empellon
//var venueIdTemplateNum='64593/1993073/2' //TOrrissi
//var tableType='Dining Room'//for Torrissi
var venueIdTemplateNum='834/2078816/2';//4charles
var tableType='Dining Room';//4charles

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
  let bookingSuccessful = false; // Flag to track if a booking was successful
  let attempts = 0; // Counter for the number of attempts made

  while (attempts < 5) {
    for (const { bookingToken, rgscodes } of bookingCodesArray) {
      console.log(bookingToken + "::" + rgscodes + ";");

      try {
        const result = await makeBooking(bookingToken, rgscodes);

        if (result.success) {
          console.log("Booking successful!");
          console.log("Booking Result:", result.body);
          bookingSuccessful = true;
          break; // Stop making further bookings
        } else {
          console.log("Booking unsuccessful!");
          console.log("Booking Result:", result.body);
        }
      } catch (error) {
        console.error("Error making booking:", error);
      }
    }

    if (bookingSuccessful) {
      break; // Exit the loop if a successful booking is made
    }

    attempts++;

    if (attempts < 5) {
      console.log(`Waiting for 3 seconds before the next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 3 seconds
    }
  }

  if (!bookingSuccessful) {
    console.log("All bookings unsuccessful");
  }
}


async function extractJSON (data) {
// Extract all templates
const templates = [];

data.results.venues.forEach((venue) => {
  const venueTemplates = venue.templates.map((template) => {
    return {
      venueName: venue.name,
      templateName: template.name
    };
  });
  templates.push(...venueTemplates);
});

console.log(templates);
}


async function main() {
  await getBookingTokenArray();
  const bookingTokensAndRgsCodesArray = await extractBookingTokensAndRgsCodes("BookingArray.json");
  await makeMultipleBookings(bookingTokensAndRgsCodesArray);
}

//--------------------------------------------
//---------RUN THE JOB-----------------------
//Cron Job Schedules the tasks
//cron.schedule('3 0 10 * * *', main);
//--------------------------------------------

main();