var express = require('express');
var engine = require('ejs-locals');
var logger = require('express-logger');
// var methodOverride = require('method-override');
var fs = require('fs');

const SERVER_CONFIG = JSON.parse(fs.readFileSync('./config/server.json', 'utf8'));



var app = express();
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.static(__dirname + '/public'));



app.use(logger({path: "./tmp/logs/log.txt"}));
// app.use(methodOverride());


app.get('/', function (req, res) {
  res.render('index', {
    page: {
      title: '',
    }
  });
});

app.listen(process.env.PORT || SERVER_CONFIG.port, function () {
  console.log('Express server listening on port 3000');
});