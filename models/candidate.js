const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    roll_number: {type: String, required: true, minLength: 9, maxLength: 10},
    batch: {
        type: String, 
        required: true, 
        enum: ["IMT2020", "IMT2019", "MT2022"],
        default: "IMT2020",
    },
    message: {type: String, required: true},
});

// Virtual for full name of the candidate
candidateSchema.virtual("full_name").get(function () {
    let full_name = "";
    if(this.first_name && this.last_name) {
        full_name = `${this.first_name}, ${this.last_name}`;
    }

    return full_name;
});

module.exports = mongoose.model("Candidate", candidateSchema);