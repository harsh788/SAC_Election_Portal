const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    roll_number: {type: String, required: true, minLength: 9, maxLength: 10},
    batch: {
        type: String, 
        required: true, 
        enum: ["IMT2020", "IMT2019", "MT2022"],
        default: "IMT2020",
    },
});

// Virtual for student url
studentSchema.virtual("url").get(function() {
    return `/dashboard/student/${this._id}`;
});

module.exports = mongoose.model("Student", studentSchema);