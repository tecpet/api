![tecpet-api](https://img.shields.io/badge/npm%20package-1.0.17-brightgreen.svg)

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
The complete list for params and types can be found at http://tecpet-api-dev.sa-east-1.elasticbeanstalk.com/graphql/
Params:  
- token: Authentication Token from Login
- segmentType: ENUM 'PET_SHOP', 'CLINIC', 'DAY_CARE', 'HOTEL'.
- zipCode: String representing the zip code of the desired address. Ex : '88103650'
- clientInput: Object represeting the client data to be created. A more specific description can be found on the link above.
- petInput: Object represeting the pet data to be created. A more specific description can be found on the link above.
- clientID: Scalar representing the unique ID of the client.
- petID: Scalar representing the unique ID of the pet.
- facebookID: String representing the unique token of the user given by Facebook
- specie: ENUM 'CAT','DOG'.
- bookingClientInput: Object representing client data,pet, services, combos and date for querying availbale times.
- bookingQuickClientInput Object representing pet info, services, combos and date for querying availbale times.
- bookingInput: Object representing data for booking on a availbale time.
- checklist: Object representing checklit that for the specific booking.
- employeeID: Scalar representing the unique ID of the employee responsible for booking.

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
        
7. Get Address from CEP

        api.searchCep(zipCode).then(result => {console.log(result)});   
        
8. Create Client
        
        Example:
        const clientInput = {
            name: 'Hannah',
            phoneNumber: '48995433445',
            facebookId: '1235tfdsg5213' 
        };
        api.createClient(token,clientInput).then(result => {console.log(result)});
     
9. Create Pet
        
        Example:
        const clientID = 10;
        const petInput = {
            name: 'Rex',
            specie: 'DOG',
            hair: 'LONG',
            size: 'BIG',
            breed: 46,
            genre: 'MALE'
        };
        api.createPet(token,clientID,petInput).then(result => {console.log(result)});
       
10. Get Not Accepted Breeds by Specie

        api.loadNotAcceptedBreeds(token,specie).then(result => {console.log(result)});     

11. Get All Clients

        api.loadClients(token).then(result => {console.log(result)});
        
12. Get client by ID

        api.loadClientById(token,clientID).then(result => {console.log(result)});
        
13. Get client by Facebook ID

        api.loadClientByFacebookId(token,facebookID).then(result => {console.log(result)}); 
        
14. Get combos of services for segment

        api.loadGetCombos(token,segmentType).then(result => {console.log(result)}); 
        
15. Get available times for booking services

        Exemple :
        const today = new Date();
        const bookingClientInput = {
            date: today,
            segmentType: 'PET_SHOP',
            client: 1,
            pets: [1],
            services: [1,2],
            premise: 'ENTRY_TIME',
            combos: [13]
        };
        api.loadAvailableTimes(token,bookingClientInput).then(result => {console.log(result)});
        
16. Get quick available times for booking services (without client and pet)

        Exemple :
        const today = new Date();
        const bookingQuickClientInput = {
            date: today,
            segmentType: 'PET_SHOP',
            services: [1,2],
            specie: 'DOG',
            hair: 'LONG',
            size: 'BIG'
        };

        api.loadQuickAvailableTimes(token,bookingQuickClientInput).then(result => {console.log(result)}); 
        
17. Get employees 

        Exemple :

        api.getEmployees(token).then(result => {console.log(result)}); 

18. Create booking from timeID returned by loadAvailableTimes()

        Exemple :
        const timeID = 'eyJkdG8iOnsiZGF0ZSI6IjIwMTktMDQtMDhU......';
        const bookingInput = {
            observation: '',
            discount: 0,
            status: 'SCHEDULED',
            takeAndBring: 0,
            cage: ''
        };
        const checklist = [{
            checklistItem: 3,
            name: 'Observações',
            value: []
        }];
        const employeeID = 1;

        api.createBooking(token,timeID,bookingInput,checklist,employeeID).then(result => {console.log(result)});      
        
19. Get Bookings by User 
        
        const filters = {
            client: '60',
            segment: 'PET_SHOP',
            status: ['SCHEDULED', 'DONE'],
            filter: 'ALL'
        };
        
        api.getBookinsByUser(token,filters).then(result => {console.log(result)});
