const express = require('express');
const engine = require('ejs-locals');
const SaveStatic = require('save-static')

let app = express();
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.static(__dirname + '/public'));

var saveStatic = new SaveStatic(__dirname + '/html');


app.get('/', function (req, res) {
  res.render('home', {
    page: {
      title: 'Home',
    }
  }, saveStatic(res));
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express server listening on port 3000');
});