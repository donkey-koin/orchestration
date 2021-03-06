'use strict';
import axios from "axios";
import moment from "moment";

const TRANSACTION_HOST = 'http://transaction-service-svc.donkey-koin.svc:8080';
const EXCHANGE_HOST = 'http://exchange-service-svc.donkey-koin.svc:8080';

// ================================================== USER ROUTES ==========================
export function login(request, response) {
    console.log("Login request body: " + JSON.stringify(request.body))
    axios.post(EXCHANGE_HOST + '/login', request.body)
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

    axios.post(EXCHANGE_HOST + '/users', req.body)
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
    console.log(EXCHANGE_HOST + '/users?username=' + req.query.username)
    axios.get(EXCHANGE_HOST + '/users?username=' + req.query.username, createJsonHeaders())
        .then((response) => {
            console.log("gotten userdata");
            res.json(response)
        }).catch(error => {
            console.log(error.status)
            res.json(error.data)
        })
}

// ===================================== TRANSACTION ROUTES =================================
export function purchase(req, res) {
    let moneyAmount = req.body.moneyAmount;
    let username = req.body.username;
    console.log("Purchase request body: " + JSON.stringify(req.body));

    axios.get(TRANSACTION_HOST + '/values/newestValue')
    .then((response) => {
        console.log("Purchase transaction response: " + JSON.stringify(response.data));
        let newestVal = JSON.parse(JSON.stringify(response.data));
        newestVal.cents = Number(newestVal.cents)/100
        axios.post(EXCHANGE_HOST + '/transaction/purchase',
                {
                    "username": username,
                    "moneyAmount": moneyAmount,
                    "lastKoinValue": newestVal.cents,
                    "transactionTime": newestVal.date
                }, createJsonHeaders())
            .then((response) => {
                axios
                    .post(TRANSACTION_HOST + '/transaction',response.data, createJsonHeaders())
                    .then((response) => {
                        axios.post(EXCHANGE_HOST + '/wallet/update', response.data, createJsonHeaders())
                    })
                    .catch((error) => {
                        console.log(error.response.status)
                        res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
                    });
                res.status(response.status).send(response.data);
            })
            .catch((error) => {
                console.log(error.response.status)
                res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
            });
    })
    .catch((error) => {
        console.log(error.response.status)
        res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
    });
}

export function sell(req, res) {
    let moneyAmount = req.body.moneyAmount;
    let username = req.body.username;
    console.log("Sale request body: " + JSON.stringify(req.body));

    axios.get(TRANSACTION_HOST + '/values/newestValue')
        .then((response) => {
            console.log("Sale transaction response: " + JSON.stringify(response.data));
            let newestVal = JSON.parse(JSON.stringify(response.data));
            axios
                .post(EXCHANGE_HOST + '/transaction/sell',
                    {
                        "username": username,
                        "moneyAmount": moneyAmount,
                        "lastKoinValue": newestVal.cents,
                        "transactionTime": newestVal.date
                    }, createJsonHeaders())
                .then((response) => {
                    axios
                        .post(TRANSACTION_HOST + '/transaction/sell',response.data, createJsonHeaders())
                        .then((response) => {
                            axios.post(EXCHANGE_HOST + '/wallet/update', response.data, createJsonHeaders())
                        })
                        .catch((error) => {
                            console.log(error.response.status)
                            res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
                        });
                    res.status(response.status).send(response.data);
                })
                .catch((error) => {
                    res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
                });
        })
        .catch((error) => {
            res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
        });
}

export function init(req, res) {
    axios.post(EXCHANGE_HOST + '/transaction/init',
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

    axios.post(EXCHANGE_HOST + '/wallet/content', req.body, createJsonHeaders())
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
    axios.post(EXCHANGE_HOST + '/wallet/deposit', req.body, createJsonHeaders())
    .then((response) => {
        console.log("Deposit to wallet exchange response: " + JSON.stringify(response.data));
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
    })
    .catch((error) => {
        res.status(500).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
    });
}

export function withdrawnFromWallet(req, res) {
    console.log("Withdrawn from request body: " + JSON.stringify(req.body));

    axios.post(EXCHANGE_HOST + '/wallet/withdrawn', req.body, createJsonHeaders())
    .then((response) => {
        console.log("Withdrawn from wallet exchange response: " + JSON.stringify(response.data) + " status " + response.status);
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
    })
    .catch((error) => {
        res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
    });
}

export function getLastValues(req, res) {
    // console.log("Get last values request body: " + JSON.stringify(req.body));

    let url = TRANSACTION_HOST + '/values';

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

    axios.post(TRANSACTION_HOST + '/triggers', req.body, createJsonHeaders())
    .then((response) => {
        console.log("Create trigger response: " + JSON.stringify(response.data));
        res.status(response.status).send(JSON.stringify({"status" : "ok"}));
    })
    .catch((error) => {
        res.status(error.response.status).send(JSON.stringify({"error" : error.response.data, "status": error.response.status}));
    });
}


export function getMyTriggers(req, res) {
    console.log(req.query.username);
    let url = TRANSACTION_HOST + '/triggers/' + req.query.username;
    console.log(url);
     axios.get(url, {headers: {Authorization: req.headers.authorization}})    
     .then((response) => {
         console.log("Get trigger response: " + JSON.stringify(response.data));
         res.status(response.status).send(response.data);
     })
     .catch((error) => {
         console.log(error);
         res.send(error.response);
     }); 
 }

// ======================================= BITCOIN TRANSACTION ROUTES ==================================

export function getTransactions(req, res) {
    if (req.query.username) {
        let publicKey;
        axios.get(EXCHANGE_HOST + '/users/user-public-key', {headers: {Authorization: req.headers.authorization}})
            .then((response) => {
                publicKey =  response.data.publicKey;
                fireTransaction(res, publicKey, response.data);
            })
            .catch((error) => {
                console.log(error);
                res.send(error);
            });


    } else {
        getAll(res);
    }
}

function fireTransaction(res, publicKey, dejta){
    let url = TRANSACTION_HOST + '/transaction/find'
    axios.post(url, dejta)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
        res.send(error.data);
        });
}

function getAll(res){
    let url = TRANSACTION_HOST + '/transaction'
    axios.get(url)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
        res.send(error.data);
        });
}


function createJsonHeaders() {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authentication' : 'Bearer token'
        }
    };
}
