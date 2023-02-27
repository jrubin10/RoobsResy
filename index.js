// index.js
//INSTRUCTIONS: You need a .env file that has your details for the JR_... variables below

require('dotenv').config();

let request = require('request');
const cookieJar = request.jar();
request = request.defaults({jar:cookieJar})

const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;

const fs = require('fs');
const { authenticate } = require('./Authenticate');
//const { makeVenueFindRequest } = require('./app');

const cron = require('node-cron');

// Schedule job to run every Saturday at 9PM
//cron.schedule('01 21 * * 6',
(async () => {
  try {
    //console.log(JR_resy_email + " " + JR_resy_password);
    const auth = await authenticate('https://api.resy.com/3/auth/password',JR_resy_email,JR_resy_password);
    //console.log(auth);
    fs.writeFileSync('./auth.json', auth);
    console.log('Auth token saved to auth.json');
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
})();



//);


