const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    medals: Number,
    cards: Array,
    inv: Array
});

module.exports = mongoose.model("Profile", profileSchema);
