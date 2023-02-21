require('dotenv').config();
//INSTRUCTIONS: You need a .env file that has your details for the JR_... variables below

const request = require('request');
const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;
const fs = require('fs');
const JR_X_ResyAuth = fs.readFileSync('./auth.json', 'utf-8');
const cron = require('node-cron');

async function makeVenueFindRequest(baseUrl, lat, long, day, partySize, venueId) {
    return new Promise((resolve, reject) => {
      const venueFindOptions = {
        method: 'GET',
        url: `${baseUrl}?lat=${lat}&long=${long}&day=${day}&party_size=${partySize}&venue_id=${venueId}`,
        headers: {
          Authorization: JR_ResyAPI,
        },
        rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
      };
  
      request(venueFindOptions, function (error, response, body) {
          if (error) {
            reject(error);
            return;
          }
        
          if (response.statusCode === 200) {
            console.log('Find API call successful');
            } else {
              console.log('Find API call unsuccessful, status code:', response.statusCode);
            }
          
            const data = JSON.parse(body);
            const slotsArray = data.results.venues[0].slots;
            const slotsAvailable = [];
  
      for (let i = 0; i < slotsArray.length; i++) {
        const element = slotsArray[i];
        const token = element.config.token;
        slotsAvailable.push(token);
      }
  
      resolve (slotsAvailable);

    })
})
}
  
      

async function getBookToken(baseUrl, day, partySize, config_id) {
  return new Promise((resolve, reject) => {
    const venueBookOptions = {
      method: 'GET',
      url: `${baseUrl}?party_size=${partySize}&day=${day}&config_id=${config_id}`,
      headers: {
        Authorization: JR_ResyAPI,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
    };

    request(venueBookOptions, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode === 200) {
        console.log('get Token API call successful');
      } else {
        console.log('get Token call unsuccessful, status code:', response.statusCode);
      }

      const data = JSON.parse(body);
      const bookToken = data.book_token.value;
      resolve(bookToken);
    });
  });
};


async function makeBooking(baseUrl,API_bookToken) {
    console.log (baseUrl+API_bookToken);
    return new Promise((resolve, reject) => {
      const makeBookOptions = {
        method: 'POST',
        url: `${baseUrl}?`,
        headers: {
          'X-Resy-Auth-Token':JR_X_ResyAuth,
          Authorization: JR_ResyAPI
        },
        formData: {
          'book_token': API_bookToken
        },
        rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
      };
  
      request(makeBookOptions, function (error, response, body) {
        if (error) {
          reject(error);
          return;
        }
  
        if (response.statusCode === 200 || response.statusCode===201) {
          console.log('Make Booking API call successful');
        } else {
          console.log('Make Booking API call unsuccessful, status code:', response.statusCode);
        console.log (makeBookOptions)
        }
  
        const data = JSON.parse(body);
        const makeBookID = data.reservation_id;
        resolve(makeBookID);
      });
    });
  };

async function findindexAfterMinTime(arr) {
    const cutoff = new Date(`1970-01-01T17:44:00Z`);
    let time;
    let timeStr;
    for (let i = 0; i < arr.length; i++) {
        timeStr = arr[i].split('/')[8]; // get the time string from the array element
        time = new Date(`1970-01-01T${timeStr}Z`); // parse the time string into a Date object
        if (isNaN(time)) { // check if the parsed time is invalid
          throw new Error(`Invalid time string: ${timeStr}`); // throw an error if the time string is invalid
        }
        if (time > cutoff) { // compare the time to the cutoff time
            return i; // return the index if the time is after the cutoff time
        }
      }        
      console.log("timestr failed -1")
      console.log('-----')
      console.log(time)
      console.log(cutoff)
      console.log('--------')
      return -1; // return -1 if no element is after the cutoff time 
  };
  

//----------------MAIN---------------

async function scheduledTask() {

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        const slotsAvailable = await makeVenueFindRequest(FindBaseUrl, lat, long, day, partySize, venueId);
        console.log (slotsAvailable);
        let indexAfterMinTime = await findindexAfterMinTime(slotsAvailable);
    //   start loop to iterate through array
    let bookConfigId='undefined';
    let reservationId='undefined';
    if (indexAfterMinTime !== -1) {
        while (bookConfigId === 'undefined' && reservationId=== 'undefined' && indexAfterMinTime < slotsAvailable.length - 1) {
          bookConfigId = slotsAvailable[indexAfterMinTime];
          bookToken = await getBookToken(TokenBaseUrl, day, partySize, bookConfigId);
          console.log('Trying  -->' + slotsAvailable[indexAfterMinTime]);
          //reservationId = await makeBooking(MakeBaseUrl, bookToken);
          console.log('SUCCESS --> ReservationID='+reservationId);
          indexAfterMinTime++;
        }
    //  Reservation is either made or missed by now
    // if (reservationId !=='undefined'){
    //     console.log(`Reservation successful with ID: ${reservationId}`);
    //   } else {
    //     console.log('No slots available');
    //   }} else
    //         console.log('no times came back after checking against earliest time -- indexAfterMinTime Function');
    }} catch (error) {
      console.error('Error:', error);
    }
  };
  
//SET PARAMETERS  
var FindBaseUrl = 'https://api.resy.com/4/find';
var TokenBaseUrl = 'https://api.resy.com/3/details';
var MakeBaseUrl ='https://api.resy.com/3/book';
var lat = '40.722653';
var long = '-73.998739';
var day = '2023-03-01';
var EarliestTime ="17:45:00"
var partySize = '5';
var venueId='60058';//monkeybar
//var venueId='66435';//random restaurant haven't checked yet
//var venueId = '66436';//empellon
var bookToken;

//--------------------------------------------
//---------RUN THE JOB-----------------------
//Cron Job Schedules the task
//ScheduledTask() without the Cron job can be used to check if everything's working before scheduling a job
//--------------------------------------------
//cron.schedule('0 09 * * 0', scheduledTask);
scheduledTask();

module.exports={getBookToken};
