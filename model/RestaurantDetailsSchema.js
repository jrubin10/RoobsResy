const mongoose = require("mongoose");

const RestaurantDetailsSchema = new mongoose.Schema({
    results: {
      venues: { 
        0:{
          venue:{
            id:{resy:[Integer]}
          }
          //STOPPED IN THE MIDDLE OF THIS SCHEMA
              type: [Array] },
      meta: { offset: [Object], limit: [Object] }
    });

const RestaurantDetails=mongoose.model("RestaurantDetails",RestaurantDetailsSchema);

module.exports=RestaurantDetails;