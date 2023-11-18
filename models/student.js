const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    roll_number: {type: String, required: true, minLength: 9, maxLength: 10},
    batch: {
        type: String, 
        required: true, 
        enum: ["iMtech", "Mtech", "Msc"],
        default: "iMtech",
    },
});

module.exports = mongoose.model("Student", studentSchema);