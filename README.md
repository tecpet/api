![tecpet-api](https://img.shields.io/badge/npm%20package-1.0.29-brightgreen.svg)

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
The complete list for params and types can be found at https://dev.tec.pet/graphql/ docs

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
        
14. Get combos of services for segment and pet info

        const filter = {
            specie: 'DOG',
            hair: 'SHORT',
            size: 'SMALL'
        };
        
        api.loadGetCombos(token,'PET_SHOP',filter).then(result => {console.log(result)}).catch(e => console.log(e));
        
15. Get available times for booking services

        Example :
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

        Example :
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

        Example :

        api.getEmployees(token).then(result => {console.log(result)}); 

18. Create booking from timeID returned by loadAvailableTimes()

        Example :
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
        
20. Change booking date 
        
        const bookingId = 481;

        const timeId = 'timeid####';

        const status = 'SCHEDULED';
        
        const checklist = [
            {
                checklistItem: 25,
                name: "Adicionais",
                value: ["Laços"]
            },
            {
                checklistItem: 23,
                name: "Perfume",
                value: ["Não"]
            },
            {
                checklistItem: 4,
                name: "Leva e Traz",
                value: ["Não"]
            }
        ];

        const employee = "15";

        const services = [];
        
        api.changeBookingDate(token,bookingId,timeId,status,checklist,employee).then(result => {console.log(result)}).catch(e => console.log(e));
        
21. Change booking status
       
        const bookingId = 481;

        const timeId = 'timeid_from_api.loadAvailableTimes()';

        const status = 'CONFIRMED';
        
        const checklist = [
            {
                checklistItem: 25,
                name: "Adicionais",
                value: ["Laços"]
            },
            {
                checklistItem: 23,
                name: "Perfume",
                value: ["Não"]
            },
            {
                checklistItem: 4,
                name: "Leva e Traz",
                value: ["Não"]
            }
        ];

        const employee = "15";

        const services = [];
        
        api.changeBookingStatus(token,bookingId,status,checklist,employee,services).then(result => {console.log(result)}).catch(e => console.log(e));
        
22. Remove Booking 

        Example :
        const bookingId = "642";
        
        const employee = "15";
        
        api.removeBooking(token,bookingId,employee).then(result => {console.log(result)}); 
        
23. Change chatbot notification 

        Example :     
        #const id: got when chatbot creates a booking
        const today = new Date();
        const ChatbotNotificationInput =  {
            message:'',
            status: 'CREATED',
            type: 'BOOKING_CREATION',
            platform: 'FACEBOOK',
            createdDate: today,
            sentDate: today,
            readDate: today,
            deliveredDate: today,
            answeredDate: today
        };
        api.changeChatbotNotification(token,id,ChatbotNotificationInput).then(result => {console.log(result)}).catch(e => console.log(e));
        
24. Find Client with filters 

        Example :     
        const value = '11911111111';  
        const type = 'PHONE'; {NAME, PET, PHONE, CPF, FACEBOOK_ID}
        const page = 0; # starts with 0
        const qty = 10;
    
        api.findClients(token,value,type,page,qty).then(result => {console.log(result)}).catch(e => console.log(e));
        
        
25. Edit Client

        const clientID = 2719;
        const clientInput = {
            name: 'PetBot',
            phoneNumber: '13911111111'
        };
        api.editClient(token,clientID,clientInput).then(result => {console.log(result)}).catch(e => console.log(e));


25. Edit Pet

        const petID = 5792;
        const clientID = 2719;
        const petInput = {
            name: 'Pet do PetBot',
            specie: 'DOG',
            hair: 'MEDIUM',
            size: 'MEDIUM',
            genre: 'MALE'
        };
        
        api.editPet(token,petID,clientID,petInput).then(result => {console.log(result)}).catch(e => console.log(e));


  

25. Get PetPlans 

        const filter = {
            // client: 183,
            pet: 229,
            // status: 'ACTIVE'
        };
        
        const page = 1; //(Optional)
        const qty = 10; //(Optional)
        api.getPetPlans(token,filter, page, qty).then(result => {console.log(result)}).catch(e => console.log(e));
