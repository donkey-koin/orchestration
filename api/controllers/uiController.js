'use strict';
import axios from "axios";
import moment from "moment";

// ================================================== USER ROUTES ==========================
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

export function getUserData(req, res) {
    console.log("getting user data");

    axios.get('http://localhost:8080/users?username=' + req.query.username, createJsonHeaders(req.headers.authorization))
        .then((response) => {
            console.log("gotten userdata");
            res.json(response)
        })
}

// ===================================== TRANSACTION ROUTES =================================
export function purchase(req, res) {
    let moneyAmount = req.body.moneyAmount;
    let username = req.body.username;
    console.log("Purchase request body: " + JSON.stringify(req.body));

    axios.get('http://localhost:8090/values/newestValue')
    .then((response) => {
        console.log("Purchase transaction response: " + JSON.stringify(response.data));
        let newestVal = JSON.parse(JSON.stringify(response.data));
        newestVal.cents = Number(newestVal.cents)/100
        axios.post('http://localhost:8080/transaction/purchase',
                {
                    "username": username,
                    "moneyAmount": moneyAmount,
                    "lastKoinValue": newestVal.cents,
                    "transactionTime": newestVal.date
                }, createJsonHeaders(req.headers.authorization))
            .then((response) => {
                console.log("data "  + JSON.stringify(response.data))
                axios.post('http://localhost:8090/transaction',response.data, createJsonHeaders(req.headers.authorization))
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
            axios
                .post('http://localhost:8080/transaction/sell',
                    {
                        "username": username,
                        "moneyAmount": moneyAmount,
                        "lastKoinValue": newestVal.cents,
                        "transactionTime": newestVal.date
                    }, createJsonHeaders(req.headers.authorization))
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

export function init(req, res) { 
    axios.post('http://localhost:8080/transaction/init',
        {
            "publicKey": req.body.publicKey,
            "moneyAmount": req.body.moneyAmount
        }    
    ).then((response) => {
        res.status(response.status).send(response.data);
    })
    .catch((error) => {
        res.status(error.response.status).send(error.response.data);
    });
}

// ======================================= WALLET ROUTES ==================================
export function walletContent(req, res) {
    console.log("Get wallet request body: " + JSON.stringify(req.body));

    axios.post('http://localhost:8080/wallet/content', req.body, createJsonHeaders(req.headers.authorization))
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
    axios.post('http://localhost:8080/wallet/deposit', req.body, createJsonHeaders(req.headers.authorization))
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

    axios.post('http://localhost:8080/wallet/withdrawn', req.body, createJsonHeaders(req.headers.authorization))
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


// ======================================= PURCHASE TRIGGERS ROUTES ==================================

export function purchaseTrigger(req, res) {
    console.log(req.body);

    axios.post('http://localhost:8090/triggers', req.body, createJsonHeaders(req.headers.authorization))
    .then((response) => {
        console.log("Create trigger response: " + JSON.stringify(response.data));
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
    })
    .catch((error) => {
        res.send(error.response);
    });
}

// ======================================= BITCOIN TRANSACTION ROUTES ==================================

export function getTransactions(req, res) {
    if (req.query.username) {
        let publicKey;
        axios.get('http://localhost:8080/users', {headers: {Authorization: req.headers.authorization}})
            .then((response) => {
                publicKey =  response.data.publicKey;
                fireTransaction(res, publicKey);
            })
            .catch((error) => {
                console.log(error);
                res.send(error);
            });


    } else {
        fireTransaction(res, null);
    }
}

function fireTransaction(res, publicKey){
    let url = 'http://localhost:8090/transaction'
    if(publicKey){
        url += '/publicKey=' + publicKey;
    }
    axios.get(url)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
        res.send(error.data);
        });
}


function createJsonHeaders(token) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
}