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
        res.status(error.response.status).send(error.response.data);
    });
}

export function purchase(req, res) {
    console.log("Purchase request body: " + JSON.stringify(req.params));

    axios.get('http://localhost:8090/values/newestValue', {
        params:{
            date: req.param("date")
        }
    })
    .then((response) => {
        console.log("Purchase transaction response: " + JSON.stringify(response.data));
        res.status(response.status).send(response.data);
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);
    });
}

export function walletContent(req, res) {
    console.log("Get wallet request body: " + JSON.stringify(req.body));

    axios.post('http://localhost:8080/wallet/content', req.body)
    .then((response) => {
        console.log("Wallet content exchange response: " + JSON.stringify(response.data));
        res.status(response.status).send(response.data);
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);   
    });
}
