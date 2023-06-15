require('dotenv').config();
const fs = require('fs');
const request = require('request');
const cron = require('node-cron');

const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;
const JR_X_ResyAuth = fs.readFileSync('./auth.json', 'utf-8');

async function getSlots(day, partySize, venueId, resyAuthToken, authorization, resyUniversalAuth) {
  var options = {
      'method': 'GET',
      'url': `https://api.resy.com/4/find?lat=0&long=0&day=${day}&party_size=${partySize}&venue_id=${venueId}`,
      'headers': {
          'sec-ch-ua': '"Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"',
          'X-Origin': 'https://resy.com',
          'sec-ch-ua-mobile': '?0',
          'X-Resy-Auth-Token': resyAuthToken,
          'Authorization': authorization,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64',
          'X-Resy-Universal-Auth': resyUniversalAuth,
          'Accept': 'application/json, text/plain, */*',
          'Cache-Control': 'no-cache',
          'sec-ch-ua-platform': '"Windows"'
      }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var response = JSON.parse(response.body);
    var venues = response.results.venues;

    // Extract tokens from venues
    var tokens = venues.flatMap(function (venue) {
      return venue.slots.map(function (slot) {
        return slot.config.token;
      });
    });

    // Log the tokens array
    console.log(tokens);
  });
}

async function main() {
  var day='2023-06-19'
  var partySize='2'
  var venueId='5769'
  var resyAuthToken=JR_X_ResyAuth
  var authorization=JR_ResyAPI
  var resyUniversalAuth=JR_X_ResyAuth
  
  await getSlots(day, partySize, venueId, resyAuthToken, authorization, resyUniversalAuth);
  }
  
  let executionCount = 0;
  const maxIterations = 1;
  
  function scheduleMain() {
    function runMain() {
      executionCount++;
      if (executionCount <= maxIterations) {
        main()
          .then(() => {
            if (executionCount < maxIterations) {
              setTimeout(runMain, 2000); // Introduce a 5-second delay after each execution
            }
          })
          .catch((error) => {
            console.error('An error occurred:', error);
          });
      }
    }
  
    runMain();
  }
  
  // Schedule the cron job to run tomorrow at 9 AM
  //cron.schedule('0 9 * * *', scheduleMain);
  scheduleMain();