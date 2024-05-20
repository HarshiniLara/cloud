const express = require("express");
const { SlamEntry } = require("./schema.js");

const router = express.Router();


router.get("/get", async (req, res) => {
    try {
        const slam = await(SlamEntry.find({}));
        res.json(slam);
    }
    catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.post("/post", async (req, res) => {
    const {name, favcolor, contact} = req.body;
    try {
        const slam = new SlamEntry({name, favcolor, contact});
        await slam.save();
        res.json({message: "Entry successful!"});
    }
    catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});


router.put("/put", async (req, res) => {
   const {newName, newFavcolor, newContact} = req.body;
   const id = req.body.id;
   const filter = {_id: id};
   const slam = {name: newName, favcolor: newFavcolor, contact: newContact};
   try {
    const updateSlam = await SlamEntry.findOneAndUpdate(filter, slam, {new: true});
    if(!updateSlam) {
        return res.status(400).json({ message: "Slam entry not found!" });
    }
    res.json({message: "Update Successful!"});
   }
   catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
   } 
});


router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await SlamEntry.deleteOne({_id: id})
    .then(() => res.json({message: "Delete successful!"}))
    .catch((err) => res.json({message: errr}));
});

module.exports = {SlamRouter: router};