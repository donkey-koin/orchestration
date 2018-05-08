import express from "express";
import axios from "axios";
import moment from "moment";

const app = express();
const port = process.env.PORT || 5000;
const url =
    "http://localhost:8080/values";

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var routes = require('./api/routes/routes'); //importing route
routes(app);

// app.get('/api/values', (req, res) => {
//     if (Number(req.query.last)) {

//         var today = moment().set({ second: 0 });
//         console.log(today.utc().format());

//         axios
//             .get(url + "/search?date=" + today.utc().format())
//             .then(response => {
//                 res.send(response.data);
//             })
//     } else {
//         axios
//             .get(url)
//             .then(response => {
//                 res.send(response.data);
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.send({ express: 'Hallo' });
//             });
//     }
// });

app.listen(port, () => console.log(`Listening on port ${port}`));
