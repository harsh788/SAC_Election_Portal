const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const electionSchema = new Schema({
    title: {type: String, required: true},
    voter_list: [{type: Schema.Types.ObjectId, ref: "Student"}],
    votes: [{type: Schema.Types.ObjectId, ref: "Vote"}],
    candidates: [{type: Schema.Types.ObjectId, ref: "Candidate"}],
});

electionSchema.virtual("url").get(function() {
    return `/dashboard/election/${this._id}`;
});

// Export module
module.exports = mongoose.model("Election", electionSchema);