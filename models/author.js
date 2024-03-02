const mongoose = require("mongoose");
const {DateTime} = require("luxon");
const Schema = mongoose.Schema;

//create model
const AuthorSchema = new Schema({
    first_name: {type: String, required:true, maxLengthL:100},
    family_name: {type:String, required: true, maxLength:100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

//virtual for author's fullname
AuthorSchema.virtual("name").get(function(){
    let fullname = "";
    if(this.first_name && this.family_name){
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

//virtual for author's url
AuthorSchema.virtual("url").get(function(){
    return `/catalog/author/${this._id}`;
});

//virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function(){
    let lifespan = this.date_of_birth?
    DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED):"";
    lifespan+= this.date_of_death?
    " - "+DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED):"";
    return lifespan;
});
AuthorSchema.virtual("dob_yyyy_mm_dd").get(function(){
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
});
AuthorSchema.virtual("dod_yyyy_mm_dd").get(function(){
    return DateTime.fromJSDate(this.date_of_death).toISODate();
});

//export model
module.exports = mongoose.model("Author", AuthorSchema);