// required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create the espress server
const app = express();

// server port number
// Hroku > process.env.PORT || localhost/3000
const PORT = process.env.PORT || 3000;

// set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// needed to parse html data for post request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

//routes
app.get("/", (req,res) => {
    // res.send("Hello World")
    res.render("index.ejs")
})

app.post("/convert-mp3", async (req,res) => {
   const videoId = req.body.videoID;
//    console.log(videoId);
   if(
       videoId === undefined ||
       videoId === "" ||
       videoId === null
   ) {
       return res.render("index", {success : false, message : "Please enter a Video ID"});
   } else {
       const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
           "method" : "GET",
           "headers" : {
               "x-rapidapi-key" : process.env.API_KEY,
               "x-rapidapi-host" : process.env.API_HOST
           }
       });

       const fetchResponse = await fetchAPI.json();
//video less than 10 min
       if(fetchResponse.status === "ok")
        return res.render("index", {success : true, song_title : fetchResponse.title, song_link : fetchResponse.link});
       else  
        return res.render("index", {success : false, message : fetchResponse.msg});

   }
})

// start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})