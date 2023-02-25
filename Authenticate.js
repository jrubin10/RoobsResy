require('dotenv').config();
const request = require('request');
const JR_ResyAPI = process.env.JR_ResyAPI;
const JR_resy_password = process.env.JR_resy_password;
const JR_resy_email = process.env.JR_resy_email;


async function authenticate(baseUrl,email,password) {
  console.log("trying authenticate function");
  return new Promise((resolve, reject) => {
    const authenticateOptions = {
      method: 'POST',
      url: `${baseUrl}?`,
      headers: {
        Authorization: JR_ResyAPI
      },
      formData: {
        'email': email,
        'password': password
      },
      rejectUnauthorized: false, // NOT RECOMMENDED - TEMPORARY FOR TESTING
    };

    request(authenticateOptions, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode === 200) {
        console.log('Auth API call successful');
      } else {
        console.log('Auth API call unsuccessful, status code:', response.statusCode);
      }

      const data = JSON.parse(body);
      const JR_X_ResyAuth = data.token;
      resolve(JR_X_ResyAuth);
    });
  });
}

module.exports={authenticate};

// (async () => {
// const JR_X_ResyAuth=await authenticate('https://api.resy.com/3/auth/password',JR_resy_email,JR_resy_password);
// })();
