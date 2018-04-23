import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 5000;
const url =
  "http://localhost:8080/values";

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app);

app.get('/api', (req, res) => {
  axios
  .get(url)
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send({express:'Hallo'});
  });
});

app.listen(port);

console.log('Orchestration server started on: ' + port);