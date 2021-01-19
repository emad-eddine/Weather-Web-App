const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { resourceUsage } = require("process");
const port = 3000;
const htmlFileName = "/index.html";

/* declaration of var */

let cityName ="";

let temp = 0;
let pressure = 0;
let humdity = 0;
let windSpeed = 0;
let weatherDesc = "";






app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
 
    res.render("index.ejs");
});

app.get("/result",(req,res)=>{

    res.render("weather.ejs",{
        cityName : cityName ,
        weatherDesc : weatherDesc,
        cityTemp : temp ,
        cityPre : pressure ,
        cityHum : humdity ,
        cityWind : windSpeed ,
    });
});

app.get("/failed",(req,res)=>{

    res.render("failed.ejs");

});



app.post("/",(req,res)=>{

     cityName = req.body.placeInput;
    const endPoint = "https://api.openweathermap.org/data/2.5/weather?";
    const apiKey = "955fae8172efd3223cd35431a94808ad";
    const unit = "metric";
    const url = endPoint + "q=" + cityName + "&units=" + unit + "&appid=" + apiKey ; 

    https.get(url,(response)=>{

        if(response.statusCode >= 400)
        {
            res.redirect("/failed");

        }
        else{
            response.on("data",(data)=>{
                weatherData = JSON.parse(data);
                temp = weatherData.main.temp;
                pressure = weatherData.main.pressure;
                humdity = weatherData.main.humidity;
                windSpeed = weatherData.wind.speed;
                weatherDesc = weatherData.weather[0].description;
               res.redirect("/result");
            });
        }
});
});

app.post("/result",(req,res)=>{

    res.redirect();

});


app.listen(port,()=>{
console.log("Succeful connected to port " + port);
});






