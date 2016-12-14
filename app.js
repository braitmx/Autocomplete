var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var cities = require('./cities.json');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('js'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('indexNew.ejs');
});

function GetCities(req, res, country) {

    var i = 0, result = [];

    country.forEach(function(item) {

        var searchLet = req.body.value.toLowerCase();
        var search = item.city.toLowerCase().match(searchLet);

        if (search != null && search.index === 0 && searchLet != '') {
            result[i] = item;
            i++;
        }
    });

    res.send(result);
}

app.post('/api/Russia/', urlencodedParser, function (req, res) {
   GetCities(req, res, cities.Russia);
});

app.post('/api/Belarus/', urlencodedParser, function (req, res) {
   GetCities(req, res, cities.Belarus);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

