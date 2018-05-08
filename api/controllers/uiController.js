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
    let moneyAmount = req.body.moneyAmount;
    let username = req.body.username;
    let transactionTime = req.body.date;
    console.log("Purchase request body: " + JSON.stringify(req.body));

    axios.get('http://localhost:8090/values/newestValue', {
        params:{
            date: req.body.date
        }
    })
    .then((response) => {
        console.log("Purchase transaction response: " + JSON.stringify(response.data));
        let newestVal = JSON.parse(JSON.stringify(response.data));
        console.log("siemano" + newestVal.cents);
        let headers = {
            'Content-Type': 'application/json'
        };
        axios
            .post('http://localhost:8080/transaction/purchase',
                {
                    "username": username,
                    "moneyAmount": moneyAmount,
                    "lastKoinValue": newestVal.cents,
                    "transactionTime": transactionTime
                }, headers)
            .then((response) => {
                res.status(response.status).send(response.data);
            })
            .catch((error) => {
                res.status(error.response.status).send(error.response.data);
            });
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

export function depositToWallet(req, res) {
    console.log("Deposit to wallet request body: " + JSON.stringify(req.body));

    axios.post('http://localhost:8080/wallet/deposit', req.body)
    .then((response) => {
        console.log("Deposit to wallet exchange response: " + JSON.stringify(response.data));
        res.status(response.status).send(response.data);
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);   
    });
}

export function withdrawnFromWallet(req, res) {
    console.log("Withdrawn from request body: " + JSON.stringify(req.body));

    axios.post('http://localhost:8080/wallet/withdrawn', req.body)
    .then((response) => {
        console.log("Withdrawn from wallet exchange response: " + JSON.stringify(response.data));
        res.status(response.status).send(response.data);
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);   
    });
} 

export function getLastValues(req, res) {
    console.log("Withdrawn from request body: " + JSON.stringify(req.body));
    let url = 'http://localhost:8090/values';

    var today = moment();
    console.log(today.utc().format());

    axios
        .get(url + "/search" , {
            params: {
                date: today.utc().format(),
                last: 5
            }
        })
        .then(response => {
            console.log(response.data);
            res.send(response.data);
        })

}
