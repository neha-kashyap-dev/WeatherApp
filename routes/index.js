var express = require('express');
var router = express.Router();
var request = require("request");
let weather = require('../controller/weather/weather');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', weather: '', location: '', place: '' });
});

/* Login user */
router.post('/weather', async function (req, res, next) {
  const place = req.body.place;
  //let weatherData = await weather(place);
  let resp = {
    weather: '',
    location: ''
  };
  var options = { method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    qs: { 
        input: place,
        inputtype: 'textquery',
        fields: 'photos,formatted_address,name,rating,opening_hours,geometry',
        key: 'AIzaSyCsGi6-txJae6IxlE5U63jwjq9iB7nU3EA' 
    }};

    let rs = await request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        let mapData = JSON.parse(body);
        
        resp.location = mapData.candidates[0].formatted_address;
        var options = { method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            qs: { id: '2172797', mode: 'json', q: resp.location },
            headers: 
            { 
                'X-RapidAPI-Key': '36deb1f83fmsh5da58b0ce4da4a4p147370jsnd3c43436690c',
                'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
            body = JSON.parse(body);
            resp.weather = body.weather[0].description+" ("+body.wind.deg+" deg)";
            res.render('index', {weather: resp.weather, location: resp.location, place: place});
        });
    });
});

module.exports = router;
