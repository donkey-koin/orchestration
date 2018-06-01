'use strict';
import axios from "axios";
import moment from "moment";


export function login(request, response) {
    console.log("Login request body: " + JSON.stringify(request.body))
    axios.post('http://localhost:8080/login', request.body)
    .then((exchangeResponse) => {
        console.log("Login exchange response: " + JSON.stringify(exchangeResponse.data))
        response.json({ username: exchangeResponse.data.username, token: exchangeResponse.data.token})
    }).catch((error) => {
        // TODO: handle case when service is down
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
    console.log("Purchase request body: " + JSON.stringify(req.body));

    axios.get('http://localhost:8090/values/newestValue')
    .then((response) => {
        console.log("Purchase transaction response: " + JSON.stringify(response.data));
        let newestVal = JSON.parse(JSON.stringify(response.data));
        let headers = {
            'Content-Type': 'application/json'
        };
        axios
            .post('http://localhost:8080/transaction/purchase',
                {
                    "username": username,
                    "moneyAmount": moneyAmount,
                    "lastKoinValue": newestVal.cents,
                    "transactionTime": newestVal.date
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

export function sell(req, res) {
    let moneyAmount = req.body.moneyAmount;
    let username = req.body.username;
    console.log("Sale request body: " + JSON.stringify(req.body));

    axios.get('http://localhost:8090/values/newestValue')
        .then((response) => {
            console.log("Sale transaction response: " + JSON.stringify(response.data));
            let newestVal = JSON.parse(JSON.stringify(response.data));
            let headers = {
                'Content-Type': 'application/json'
            };
            axios
                .post('http://localhost:8080/transaction/sell',
                    {
                        "username": username,
                        "moneyAmount": moneyAmount,
                        "lastKoinValue": newestVal.cents,
                        "transactionTime": newestVal.date
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


//TODO handle real responses after response will be sent from withdrawn/deposit in ex. serv.
export function depositToWallet(req, res) {
    console.log("Deposit to wallet request body: " + JSON.stringify(req.body));

    axios.post('http://localhost:8080/wallet/deposit', req.body)
    .then((response) => {
        console.log("Deposit to wallet exchange response: " + JSON.stringify(response.data));
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
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
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);   
    });
} 

export function getLastValues(req, res) {
    // console.log("Get last values request body: " + JSON.stringify(req.body));
    let url = 'http://localhost:8090/values';

    var today = moment();
    let amount = req.query.amount != undefined ? req.query.amount : 5;
    // console.log(req.query.amount);
    axios
        .get(url + "/search" , {
            params: {
                date: today.utc().format(),
                last: amount
            }
        })
        .then(response => {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(error => {
            res.json({error:"Error occured"});
        });

}
