const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    roll_number: {type: String, required: true, minLength: 9, maxLength: 10},
    password: {type: String, required: true, minLength: 5},
    batch: {
        type: String, 
        required: true, 
        enum: ["IMT2020", "IMT2019", "MT2022"],
        default: "IMT2020",
    },
});

// Hashing the password before saving
studentSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(error) {
        next(error);
    }
});

// Compare password before login
studentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for student url
studentSchema.virtual("url").get(function() {
    return `/dashboard/student/${this._id}`;
});

module.exports = mongoose.model("Student", studentSchema);