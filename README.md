# Instructions:

MakeReservation.js is the driver file.

Before running it, you need to set up your .env file in order to add your personal credentials. The variables they need to align to are at the top.
JR_ResyAPI/
JR_resy_password/
JR_resy_email/
JR_X_ResyAuth/

Before running it, you need to authenticate to Resy once using Index.js which will add your authentication token to your own auth.json

Neither .env nor auth.json will be uploaded here since they are part of .gitignore.

# Notes:

You need to give the variables for the venue and date:

*VenueID -- get this by going to resy and looking in the chrome dev console to get the VenueID\
*Day -- choose your date in the format that's in the code\
*Earliest Time -- optional if you want to put a limit on the earliest time of day it will try to book\
\
*The structure of the rgs link is:\
rgs://resy/{{VenueID}}/{{TemplateID}}/{Template#}/{{Date}}/{{Date}}/{{Time}}/{{PartySize}}/{{TableConfig}}
rgs://resy/66436/1943671/2/2023-03-05/2023-03-05/17:00:00/4/Indoors


# Ideas:

*Separate each function into it's own files for easier updates\

*Speed up code by using the known structure of variable bookConfigId in order to continuously try making the booking instead of getting the slotsAvailable array first and then parsing through it. We don't need to know what's available. We can start trying and if it fails keep running through the known times a particular restaurant publishes\

*Add input UI for users to enter their restaurant, times, and dates in order to collect info rather than updating variables in the code\

*Figure out how to collect other users authentication information if others want to use the code\

*Create an API using Express Framework\

*Tap into the notify workflow for the situation where you set up a notification --> Reservation dropped and Resy sends notification (maybe use the email they send? Or maybe there's a more direct notification possible?) --> kick off code to immediately get the reservation

# Where did i leave off?
* Inside MakeReservation.js at the bottom where the make multiple bookings function is commented out.
* BookingArray.json gets the new Json file and needs to be sent to make the booking
