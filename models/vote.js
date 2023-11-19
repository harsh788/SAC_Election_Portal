const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voteSchema = new Schema({
    voter: {type: Schema.Types.ObjectId, ref: "Student", required: true},
    timestamp: {type: Date, required: true},
    selection: {type: Schema.Types.ObjectId, ref: "Candidate", required: true},
});

voteSchema.virtual("url").get(function() {
    return `/dashboard/vote/${this._id}`;
});

module.exports = mongoose.model("Vote", voteSchema);