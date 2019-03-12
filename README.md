![tecpet-api](https://img.shields.io/badge/npm%20package-1.0.4-brightgreen.svg)

# tecpet-api
API calls and usage description for the tecpet platform

# Installation

    # installing the tecpet api package
    npm i @tecpet/api --save

# Usage
    # We currently do not support ES6 Import call.
    var api = require("@tecpet/api")
    
First it is necessary to login passing the user and passord values as strings. Ex : "Marcus", "MarcusPassword".

Next, api.login()response has the authentication token necessary for the next API Calls saved on the key "accessToken".

Pass the user authentication parameters and save the token for the future API calls:

    const token;
    api.login("Marcus","MarcusPassword").then(result => {   
        console.log(result) 
        this.token = result.accessToken
    });
    
Pass the token on future API calls as a parameter:

    api.getShopGeneralInfo(token).then(result => {console.log(result)});
