'use strict';
import axios from "axios";


export function login(request, response) {
    console.log("Login request body: " + JSON.stringify(request.body))
    axios.post('http://localhost:8080/login', request.body)
    .then((exchangeResponse) => {
        console.log("Login exchange response: " + JSON.stringify(exchangeResponse.data))
        response.json({ username: exchangeResponse.data.username, token: exchangeResponse.data.token})
    }).catch((error) => {
        if (error.response.status === 403) response.json({error: "Unable to login with provided credentials"})
        else response.json({error: "Server error"})
    })
};

export function register(req, res) {
    console.log("Registration request body: " + req);

    axios.post('http://localhost:8080/users', req.body)
    .then((response) => {
            // console.log(response);
            console.log(response.status);
            console.log("Registration exchange response: ");
            if (response.status == 201) res.json({ data: "Success" });
    })
    .catch((error) => {
            if (error.response.status === 409) res.status(409).send({ error: error.response.data })
            else res.json({ error: "Server error" });
    });
}
