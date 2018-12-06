import express from "express";
import axios from "axios";
import moment from "moment";

const app = express();
const port = process.env.PORT || 5000;
const url = "http://exchange-service-svc.donkey-koin.svc:8080/values";

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app);

app.listen(port, () => console.log(`Listening on port ${port}`));
