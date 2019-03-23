![tecpet-api](https://img.shields.io/badge/npm%20package-1.0.8-brightgreen.svg)

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

    api.login("Marcus","MarcusPassword").then(result => {   
        console.log(result) 
    });
    
Pass the token on future API calls as a parameter:

    api.getShopGeneralInfo(token).then(result => {console.log(result)});
    
# API functions calls
Params:  
- token: Authentication Token from Login
- segmentType: ENUM 'PET_SHOP', 'CLINIC', 'DAY_CARE', 'HOTEL'.

1. Load Shop General Info

        api.loadShopGeneralInfo(token).then(result => {console.log(result)});
       
2. Get Shop Segments

        api.getSegments(token).then(result => {console.log(result)});
        
3. Load Timetable (Days and Hours open).

        api.loadTimeTables(token,segmentType).then(result => {console.log(result)});
        
4. Load Categories with associeted services

        api.loadCategoriesWithServices(token,segmentType).then(result => {console.log(result)});
        
5. Load Checklists

        api.loadChecklists(token,segmentType).then(result => {console.log(result)});
        
6. Load Billing Methods

        api.loadBillingMethods(token,segmentType).then(result => {console.log(result)});

