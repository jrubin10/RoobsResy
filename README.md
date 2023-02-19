# Instructions:

Apps.js is the driver file with the main code at the bottom. It kicks off the scheduled reservation.

Before running it, you need to set up your .env file in order to add your personal credentials. The variables they need to align to are at the top of App.js and Authenticate.js

Before running it, you need to authenticate to Resy once using Authenticate.js which will add your authentication token to your own auth.json

Neither .env nor auth.json will be uploaded here since they are part of .gitignore.

# Notes:

You need to give the apps.js variables the VenueID by going to resy and looking in the chrome dev console to get the VenueID

# Ideas:

Separate each function into it's own files for easier updates
Speed up code by using the known structure of variable bookConfigId in order to continuously try making the booking instead of getting the slotsAvailable array first and then parsing through it. We don't need to know what's available. We can start trying and if it fails keep running through the known times a particular restaurant publishes
Add input UI for users to enter their restaurant, times, and dates in order to collect info rather than updating variables in the code
Figure out how to collect other users authentication information if others want to use the code

