const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://barshanian:118877mh@cluster0.lz68cx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectToMongo = ()=>{
    mongoose.connect(mongoUrl, ()=>{
        console.log("Database Connected!")
    });
}

module.exports = connectToMongo;

