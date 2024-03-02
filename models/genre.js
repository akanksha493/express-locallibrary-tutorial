const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create model
const GrenreSchema = new Schema({
    name: {type: String, required:true, minLength:3, maxLength:100},
});

//virtual for genre's url
GrenreSchema.virtual("url").get(function(){
    return `/catalog/genre/${this._id}`;
});

//export model
module.exports = mongoose.model("Genre", GrenreSchema);