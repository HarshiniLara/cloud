const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const {SlamRouter} = require("./route.js");

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/slam", SlamRouter);
const mongo = process.env.MONGO_URI;


mongoose.connect(
    mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Error connecting to db", err);
});

db.once("open", () => {
    console.log("Connected to db");
});

app.listen(3001, () => {
    console.log("Server running on port: 3001");
})