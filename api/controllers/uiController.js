'use strict';
import axios from "axios";


exports.login = function (request, response) {
    // axios.post('http://localhost:8080/login', {
    //     username: request.username,
    //     password: request.password
    // }).then((response) => {

    // })
    console.log(request.body)
    if (request.body.username === 'xd' && request.body.password === 'gmd') {
        response.json({ username: request.body.username, token: 'token jwt xd' })
    } else {
        response.json({ error: "INVALID CREDENTIALS" })
    }

};

export function register(req, res) {
    console.log(req.body);

    // axios.defaults.withCredentials = true;
    // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    //console.log("request" + request.body.username);
    axios.post('http://localhost:8080/users', req.body)
    .then((response) => {
        res.send(response.data);
    })
    .catch((error) => res.send(error.response.data));
}
