'use strict';

exports.login = function(request, response) {
    // axios.post('http://localhost:8080/login', {
    //     username: request.username,
    //     password: request.password
    // }).then((response) => {
        
    // })
    console.log(request.body)
    if(request.body.username === 'xd' && request.body.password === 'gmd') {
        response.json({username: request.body.username, token: 'token jwt xd'})
    } else {
        response.json({error:"INVALID CREDENTIALS"})
    }
  
};