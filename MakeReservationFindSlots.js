require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const request = require('request');
const cron = require('node-cron');

const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;
const JR_X_ResyAuth = fs.readFileSync('./auth.json', 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getSlots(day, partySize, venueId, resyAuthToken, authorization, resyUniversalAuth) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://api.resy.com/4/find?lat=0&long=0&day=${day}&party_size=${partySize}&venue_id=${venueId}`,
      headers: {
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
      if (error) {
        reject(error);
      } else {
        var response = JSON.parse(response.body);
        var venues = response.results.venues;

        // Extract tokens from venues
        var tokens = venues.flatMap(function (venue) {
          return venue.slots.map(function (slot) {
            return slot.config.token;
          });
        });

        // Log the tokens array
        resolve(tokens);
      }
    });
  });
}

async function getBookToken(day, partySize, rgscodes) {
  return new Promise((resolve, reject) => {
    var venueBookOptions = {
      'method': 'POST',
      'url': 'https://api.resy.com/3/details',
      'headers': {
        'sec-ch-ua': '"Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"',
        'X-Origin': 'https://widgets.resy.com',
        'sec-ch-ua-mobile': '?0',
        'X-Resy-Auth-Token': JR_X_ResyAuth,
        'Authorization': JR_ResyAPI,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64',
        'X-Resy-Universal-Auth': JR_X_ResyAuth,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Cache-Control': 'no-cache',
        'sec-ch-ua-platform': '"Windows"'
      },
      body: JSON.stringify({
        "commit": 1,
        "config_id": rgscodes,
        "day": day,
        "party_size": parseInt(partySize)
      }),
      //rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
    };

    request(venueBookOptions, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode === 200 || response.statusCode===201) {
        console.log('get Token API call successful');
      } else {
        console.log('get Token call unsuccessful, status code:', response.statusCode);
        console.log (venueBookOptions);
      }

      const data = JSON.parse(body);
      const bookToken = data.book_token.value;
      resolve(bookToken);
    });
  });
};


async function getBookingTokenArray(rgsCodesArray,day,partySize) {
  const bookingArray = await Promise.all(rgsCodesArray.map(async (rgscodes) => {
    const bookingToken = await getBookToken(day, partySize, rgscodes);
    return {
      'TokenBaseUrl': 'https://api.resy.com/3/details',
      'day': day,
      'partySize': partySize,
      'rgscodes': rgscodes,
      'bookingToken': bookingToken
    };
  }));
  const jsonData = JSON.stringify(bookingArray);
  fs.writeFileSync('BookingArray1.json', jsonData);
  return bookingArray;
}


async function makeBooking(API_bookToken, resRGS) {
  let baseUrl = 'https://api.resy.com/3/book';
  console.log("Testing: " + baseUrl + " --> " + "..." + API_bookToken.slice(-10));
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
        'struct_payment_method': '{"id":16674935}' //THIS NEEDS TO BE MADE INTO ENV VARIABLE???
      }
    };

    //console.log(makeBookOptions);

    request(makeBookOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        const responseBody = JSON.parse(response.body);
        console.log(resRGS," -- Booking Result:", responseBody);

        if (responseBody.hasOwnProperty("reservation_id")) {
          resolve({ success: true, body: responseBody }); // Resolve the promise for a successful booking
        } else {
          resolve({ success: false, body: responseBody }); // Resolve the promise for an unsuccessful booking
        }
      }
    });
  });
};

// Make multiple bookings with booking codes and rgs codes
async function makeMultipleBookings(bookingCodesArray) {
  let bookingSuccessful = false; // Flag to track if a booking was successful
  let attempts = 0; // Counter for the number of attempts made

    for (const { bookingToken, rgscodes } of bookingCodesArray) {
      console.log("Booking Token:"+ bookingToken.slice(-10) + "::" + rgscodes + ";");

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

  if (!bookingSuccessful) {
    console.log("All bookings unsuccessful");
  }
}


function promptUser() {
  return new Promise((resolve) => {
    rl.question('Enter the day (YYYY-MM-DD): ', function (day) {
      rl.question('Enter the party size: ', function (partySize) {
        rl.question('Enter the venue ID: ', function (venueId) {
          rl.close();
          resolve({ day, partySize, venueId });
        });
      });
    });
  });
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

async function main2() {
  const bookingTokensAndRgsCodesArray = await extractBookingTokensAndRgsCodes("BookingArray1.json");
  console.log (bookingTokensAndRgsCodesArray)
  await makeMultipleBookings(bookingTokensAndRgsCodesArray);
}

async function main(day, partySize, venueId) {
  const resyAuthToken = JR_X_ResyAuth;
  const authorization = JR_ResyAPI;
  const resyUniversalAuth = JR_X_ResyAuth;

  getSlots(day, partySize, venueId, resyAuthToken, authorization, resyUniversalAuth)
    .then((tokens) => {
      // Code to execute after getSlots completes
      getBookingTokenArray(tokens, day, partySize)
        .then(main2); // Corrected code: pass main2 as a function reference
    })
    .catch((error) => {
      // Handle any errors from getSlots
      console.error(error);
    });
}


let executionCount = 0;
const maxIterations = 10;

async function mainWrapper() {
  const { day, partySize, venueId } = await promptUser();
  await main(day, partySize, venueId)
    .then(() => {
      executionCount++;
      if (executionCount < maxIterations) {
        console.log('Waiting for the next scheduled execution...');
        cron.schedule('* * * * *', () => {
          console.log('Scheduled execution started.');
          let interval = setInterval(() => {
            main(day, partySize, venueId)
              .then(() => {
                executionCount++;
                if (executionCount >= maxIterations) {
                  clearInterval(interval);
                  console.log('Max iterations reached. Stopping scheduled executions.');
                }
              })
              .catch((error) => {
                console.error('Error in main:', error);
              });
          }, 2000);
        });
      }
    })
    .catch((error) => {
      console.error('Error in main:', error);
    });
}

// Initial execution
mainWrapper();

