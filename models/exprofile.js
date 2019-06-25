const mongoose = require('mongoose');

const exprofileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    exp: Array,
    lastMsg: Number
});

module.exports = mongoose.model("Exprofile", exprofileSchema);
