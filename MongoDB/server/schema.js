const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {type: String, required: true},
    contact: {type: Number, required: true},
    favcolor: {type: String, required: true},
});

const SlamEntry = mongoose.model("slambook", Schema);

module.exports = {SlamEntry};