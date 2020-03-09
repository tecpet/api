const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch');
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const setContext = require('apollo-link-context').setContext;
const cep = require('cep-promise');
const BASE_URL = process.env.API_URL || 'https://dev.tec.pet';


const createPetPlan = gql`
    mutation createPetPlan($petPlanInput: PetPlanInput!) {
        createPetPlan(petPlanInput:$petPlanInput){
            id
        }
    }
`;

const getPlans = gql`
    query getPlans($filter: FilterPlansInput) {
        getPlans(filter: $filter){
            order
            id
            name
            planType
            monthQuantity
            species{
                CAT
                DOG
            }
            description
            discount
            services{
                service{
                    id
                    name
                    priceTable{
                        price
                        duration
                        hairItemType
                        sizeItemType
                    }
                    species{
                        CAT
                        DOG
                    }
                    segmentType
                    serviceCategoryType
                }
                quantity
            }
            priceTable{
                price
                duration
                hairItemType
                sizeItemType
                priceHardInserted
            }
        }
    }
`;

const getPetPlans = gql`
    query getPetPlans($filter:PetPlanFilter, $page:Int, $qty:Int) {
        getPetPlans(filter:$filter, page:$page, qty:$qty){
            count
            list{
                id
                status
                createdDate
                price
                chargeType
                startDate
                endDate
                observation
                invoices{
                    control{
                        quantity
                        service{
                            id
                            name
                        }
                        used
                    }
                    dueDate
                    id
                    paidDate
                    paid
                    paymentMethod
                    price
                }
                logs {
                    invoice{
                        dueDate
                        paymentMethod
                        id
                    }
                    date
                    employee{
                        id
                        name
                    }
                    type
                }
                pet{
                    id
                    name
                    genre
                    observation
                    size
                    hair
                    specie
                    breed {
                        hair
                        icon
                        id
                        name
                        notAccepted
                        specie
                        size
                    }
                }
                client {
                    name
                    cpf
                    facebookId
                    id
                }
                plan {
                    description
                    discount
                    id
                    name
                    planType
                    services {
                        quantity
                        service {
                            id
                            name
                        }
                    }
                    priceTable {
                        duration
                        hairItemType
                        price
                        priceHardInserted
                        sizeItemType
                    }
                    species {
                        CAT
                        DOG
                    }
                }
                bookings {
                    date
                    id
                    totalDuration
                    observation
                    discount
                    totalPrice
                    entryTime
                    leaveTime
                    pets {
                        id
                        name
                        specie
                        hair
                        size
                        observation
                        breed{
                            id
                            name
                            specie
                            hair
                            size
                            notAccepted
                            icon
                        }
                        genre
                    }
                    services {
                        id
                        name
                        price
                    }
                    status
                    premise
                    entryHour
                    takeAndBring
                    bookingsTrackings{
                        checklists{
                            checkListItemId
                            value
                            name
                        }
                        status
                    }
                    invoice{
                        takeAndBringValue
                        discount
                        discounts{
                            discountPercent
                            discountValue
                            name
                        }
                        totalDiscount
                        totalPrice
                        services {
                            serviceName
                            petName
                            price
                        }
                    }
                    cage
                    segmentType
                }
            }
        }
    }
`;


const findClient = gql`
    query findClient($value: String!, $type: FilterClientType!, $page: Int, $qty:Int){
        findClient( value:$value, type:$type, page:$page , qty:$qty){
            list{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address{
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed{
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            count
        }
    }
`;

const changeChatbotNotification = gql`
    mutation changeChatbotNotification($id: ID!, $chatbotNotificationInput: ChatbotNotificationInput){
        changeChatbotNotification(id: $id, chatbotNotificationInput: $chatbotNotificationInput){
            id
            message
            status
            type
            platform
            createdDate
            sentDate
            readDate
            deliveredDate
            answeredDate
            client{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address {
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed {
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            booking{
                date
                id
                totalDuration
                observation
                discount
                totalPrice
                entryTime
                leaveTime
                client{
                    id
                    name
                    email
                    phoneNumber
                    cpf
                    birth
                    address {
                        street
                        number
                        zipCode
                        complement
                        neighborhood
                        city
                        uf
                    }
                    pets{
                        id
                        name
                        specie
                        hair
                        size
                        observation
                        breed {
                            id
                            name
                            specie
                            hair
                            size
                            notAccepted
                            icon
                        }
                        genre
                    }
                    facebookId
                }
                pets {
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed{
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                services {
                    id
                    name
                    price
                }
                status
                premise
                entryHour
                takeAndBring
                bookingsTrackings{
                    checklists{
                        checkListItemId
                        value
                        name
                    }
                    status
                }
                invoice{
                    takeAndBringValue
                    discount
                    discounts{
                        discountPercent
                        discountValue
                        name
                    }
                    totalDiscount
                    totalPrice
                    services {
                        serviceName
                        petName
                        price
                    }
                }
                cage
                segmentType
                scheduledByBot
            }
        }
    }
`;

const removeBooking = gql`
    mutation removeBooking ($bookingId: ID!, $employee: ID!){
        removeBooking(bookingId: $bookingId, employee: $employee){
            success
        }
    }
`;
const changeBookingDate = gql`
    mutation changeBookingDate($bookingId: ID!,$timeId: ID!,$status: Status!,$checklist: [ChecklistValueInput],$employee: ID!) {
        changeBookingDate(bookingId: $bookingId, timeId: $timeId, status: $status, checklist: $checklist, employee: $employee){
            date
            id
            totalDuration
            observation
            discount
            totalPrice
            entryTime
            leaveTime
            client{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address {
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed {
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            pets {
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            services {
                id
                name
                price
            }
            status
            premise
            entryHour
            takeAndBring
            bookingsTrackings{
                checklists{
                    checkListItemId
                    value
                    name
                }
                status
            }
            invoice{
                takeAndBringValue
                discount
                discounts{
                    discountPercent
                    discountValue
                    name
                }
                totalDiscount
                totalPrice
                services {
                    serviceName
                    petName
                    price
                }
            }
            cage
            segmentType
            scheduledByBot
        }
    }
`;

const changeBookingStatus = gql`
    mutation changeBookingStatus($bookingId: ID!,$status: Status!,$checklist: [ChecklistValueInput],$employee: ID!, $services: [ID]) {
        changeBookingStatus(bookingId: $bookingId, status: $status, checklist: $checklist, employee: $employee, services: $services){
            date
            id
            totalDuration
            observation
            discount
            totalPrice
            entryTime
            leaveTime
            client{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address {
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed {
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            pets {
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            services {
                id
                name
                price
            }
            status
            premise
            entryHour
            takeAndBring
            bookingsTrackings{
                checklists{
                    checkListItemId
                    value
                    name
                }
                status
            }
            invoice{
                takeAndBringValue
                discount
                discounts{
                    discountPercent
                    discountValue
                    name
                }
                totalDiscount
                totalPrice
                services {
                    serviceName
                    petName
                    price
                }
            }
            cage
            segmentType
            scheduledByBot
        }
    }
`;

const getBookinsByUser = gql`
    query getBookinsByUser($filters: BookingsByUserFilters){
        getBookinsByUser(filters: $filters){
            date
            id
            totalDuration
            observation
            discount
            totalPrice
            entryTime
            leaveTime
            client{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address {
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed {
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            pets {
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            services {
                id
                name
                price
            }
            status
            premise
            entryHour
            takeAndBring
            bookingsTrackings{
                checklists{
                    checkListItemId
                    value
                    name
                }
                status
            }
            invoice{
                takeAndBringValue
                discount
                discounts{
                    discountPercent
                    discountValue
                    name
                }
                totalDiscount
                totalPrice
                services {
                    serviceName
                    petName
                    price
                }
            }
            cage
            segmentType
            scheduledByBot
        }
    }
`;

const getEmployees = gql`
    query getEmployees {
        getEmployees{
            id
            name
            email
            phoneNumber
        }
    }
`;

const createBooking  = gql`
    mutation createBooking($timeId: ID!, $bookingInput: BookingInput!, $checklist: [ChecklistValueInput]!, $employee: ID!){
        createBooking(timeId:$timeId,bookingInput:$bookingInput, checklist:$checklist, employee:$employee){
            date
            id
            totalDuration
            observation
            discount
            totalPrice
            entryTime
            leaveTime
            client{
                id
                name
                email
                phoneNumber
                cpf
                birth
                address{
                    street
                    number
                    zipCode
                    complement
                    neighborhood
                    city
                    uf
                }
                pets{
                    id
                    name
                    specie
                    hair
                    size
                    observation
                    breed {
                        id
                        name
                        specie
                        hair
                        size
                        notAccepted
                        icon
                    }
                    genre
                }
                facebookId
            }
            pets{
                name
                breed {
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
            }
            services{
                id
                name
                price
            }
            status
            premise
            entryHour
            takeAndBring
            bookingsTrackings{
                checklists{
                    checkListItemId
                    value
                    name
                }
                status
            }
            invoice{
                takeAndBringValue
                discount
                discounts{
                    discountPercent
                    discountValue
                    name
                }
                totalDiscount
                totalPrice
                services{
                    serviceName
                    petName
                    price
                }
            }
            cage
            segmentType
            scheduledByBot
        }
    }
`;
const getQuickAvailableTimes = gql`
    query getQuickAvailableTimes($bookingQuickClientInput: BookingQuickClientInput!){
        getQuickAvailableTimes(bookingQuickClientInput:$bookingQuickClientInput){
            options{
                start
                stop
            }
            discounts{
                id
                name
                discount
                services
                totalDiscount
            }
            prices{
                totalPrice
                totalDiscount
            }
        }
    }
`;

const getCombos = gql`
    query getCombos($segmentType: ShopSegment!, $filter: FilterCombosInput) {
        getCombos(segmentType: $segmentType, filter:$filter){
            id
            name
            order
            showOnChatbot
            priceTable{
                duration
                hairItemType
                sizeItemType
                price
                priceHardInserted
            }
            services {
                id
                name
                priceTable{
                    price
                    duration
                    hairItemType
                    sizeItemType
                    priceHardInserted
                }
                species{
                    CAT
                    DOG
                }
                segmentType
                serviceCategoryType
            }
            discount
            species{
                CAT
                DOG
            }
        }
    }
`;

const getAvailableTimes = gql`
    query getAvailableTimes($bookingClientInput: BookingClientInput!){
        getAvailableTimes(bookingClientInput:$bookingClientInput){
            options{
                id
                start
                stop
                bookingInfo{
                    service
                    pet
                    price
                    duration
                    serviceName
                    petName
                }
            }
            discounts{
                id
                name
                discount
                services
                totalDiscount
            }
            prices{
                totalPrice
                totalDiscount
            }
        }
    }
`;

const getClients = gql`
    query getClients{
        getClients{
            id
            name
            email
            phoneNumber
            cpf
            birth
            address{
                street
                number
                zipCode
                complement
                neighborhood
                city
                uf
            }
            pets{
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            facebookId
        }
    }
`;

const getClientById = gql`
    query client($id: ID!){
        client(id:$id){
            id
            name
            email
            phoneNumber
            cpf
            birth
            address{
                street
                number
                zipCode
                complement
                neighborhood
                city
                uf
            }
            pets{
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            facebookId
        }
    }
`;

const clientByFacebookId = gql`
    query clientByFacebookId($facebookId: String!){
        clientByFacebookId(facebookId:$facebookId){
            id
            name
            email
            phoneNumber
            cpf
            birth
            address{
                street
                number
                zipCode
                complement
                neighborhood
                city
                uf
            }
            pets{
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            facebookId
        }
    }
`;
const getNotAcceptedBreeds = gql`
    query getNotAcceptedBreeds($specie: SpecieType!){
        getNotAcceptedBreeds(specie:$specie){
            id
            name
            specie
            hair
            size
            notAccepted
        }
    }
`;

const createClient = gql`
    mutation createClient($clientInput: ClientInput!) {
        createClient(clientInput: $clientInput) {
            id
            name
            email
            phoneNumber
            cpf
            birth
            address{
                street
                number
                zipCode
                complement
                neighborhood
                city
                uf
            }
            pets{
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            facebookId
        }
    }
`;

const editClient = gql`
    mutation editClient( $id: ID!, $clientInput: ClientInput!) {
        editClient(id: $id, clientInput: $clientInput) {
            id
            name
            email
            phoneNumber
            cpf
            birth
            address{
                street
                number
                zipCode
                complement
                neighborhood
                city
                uf
            }
            pets{
                id
                name
                specie
                hair
                size
                observation
                breed{
                    id
                    name
                    specie
                    hair
                    size
                    notAccepted
                    icon
                }
                genre
            }
            facebookId
        }
    }
`;

const editPet = gql`
    mutation editPet($client: ID!,$id: ID!, $petInput: PetInput!) {
        editPet(client: $client, id:$id, petInput: $petInput ) {
            id
            name
            specie
            hair
            size
            observation
            breed{
                id
                name
                specie
                hair
                size
                notAccepted
                icon
            }
            genre
        }
    }
`;
const createPet = gql`
    mutation createPet($client: ID!,$petInput: PetInput!) {
        createPet(client: $client, petInput:$petInput ) {
            id
            name
            specie
            hair
            size
            observation
            breed{
                id
                name
                specie
                hair
                size
                notAccepted
                icon
            }
            genre
        }
    }
`;
const getBillingMethods = gql`
    query getBillingMethods( $type: ShopSegment!) {
        getBillingMethods (type: $type) {
            name
            tag
            active
            billingItems{
                name
                tag
                active
                min
                max
                description
            }
        }
    }
`;

const getChecklists = gql`
    query getChecklists($segmentType: ShopSegment!) {
        getChecklists(segmentType: $segmentType) {
            id
            name
            items{
                id
                name
                itemType
                options
            }
        }
    }
`;

const getServiceCategoriesWithServices = gql`
    query getServiceCategoriesWithServices($segmentType: ShopSegment!,$filter: FilterServicesInput){
        getServiceCategoriesWithServices(segmentType: $segmentType,filter:$filter) {
            #            type -> Returning Null
            name
            #            capacity  -> giving error
            services{
                id
                name
                priceTable{
                    price
                    duration
                    hairItemType
                    sizeItemType
                }
                species{
                    CAT
                    DOG
                }
                segmentType
                serviceCategoryType
                description
                order
                # filter only showOnChatabot
            }
        }
    }
`;
const getTimeTable = gql`
    query segment($type: ShopSegment!) {
        segment (type: $type) {
            timeTable{
                fullTime
                monday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                tuesday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                wednesday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                thursday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                friday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                saturday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                sunday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
            }
        }
    }
`;

const getShopGeneralInfo = gql`
    query getGeneralInfo {
        getShopGeneralInfo {
            name
            description
            phoneNumber
        }
    }
`;

const getSegments = gql`
    query getSegments {
        getSegments{
            type
            active
            acceptedSpecies{
                dog
                cat
            }
            timeTable{
                fullTime
                monday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                tuesday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                wednesday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                thursday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                friday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                saturday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
                sunday{
                    closed
                    hasPause
                    start
                    stop
                    pauseStop
                    pauseStart
                }
            }
        }
    }
`;


function json(response) {
    return response.json()
}

exports.login = function (user,password) {
//function login(user,password) {
    return new Promise(function(resolve, reject) {
        fetch(BASE_URL + '/auth/login', {
            method: "POST",
            body: JSON.stringify({"login": user, "password": password}),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(json)
            .then(function (data) {
                if(data.status && data.status == 401){
                    reject(data);
                }
                resolve(data);
            })
            .catch(function (error) {
                // console.log('Request failed', error);
                reject(error);
            });
    });
};

const fetchPolicy = 'no-cache';

const httpLink = createHttpLink({
    uri: BASE_URL + '/graphql/',
    fetch: fetch
});


const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

exports.getSegments = function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getSegments,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        })
            .then(result => {
                console.log(result.data.getSegments);
                resolve(result.data.getSegments);
            })
            .catch(error => {
                reject(error);
            });
    });
};

exports.loadShopGeneralInfo = function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getShopGeneralInfo,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        })
            .then(result => {
                // console.log(result.data.getShopGeneralInfo);
                resolve(result.data.getShopGeneralInfo);
            })
            .catch(error => {
                // console.error('error',error)
                reject(error);
            });
    });
};

// function loadTimeTables(token,segmentType) {
exports.loadTimeTables = function (token,segmentType) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getTimeTable,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                type: segmentType,
            }
        })
            .then(result => {
                // console.log(result.data);
                resolve(result.data.segment.timeTable);
            })
            .catch(error => {
                // console.error('error',error);
                reject(error);
            });
    });
};

// function loadCategoriesWithServices(token,segmentType) {
exports.loadCategoriesWithServices = function (token,segmentType) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getServiceCategoriesWithServices,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                segmentType: segmentType,
                filter: {
                    showOnChatbot: true,
                }
            }
        }).then(result => {
            // console.log(result.data.getServiceCategoriesWithServices);
            resolve(result.data.getServiceCategoriesWithServices);
        })
            .catch(error => {
                // console.error('error',error);
                reject(error);
            });
    });
};

exports.loadChecklists = function (token,segmentType) {
// function loadChecklists(token,segmentType) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getChecklists,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                segmentType: segmentType,
            }
        }).then(result => {
            //console.log(result.data.getChecklists);
            resolve(result.data.getChecklists);
        })
            .catch(error => {
                // console.error('error',error);
                reject(error);
            });
    });
};
//
exports.loadBillingMethods = function (token,segmentType) {
//function loadBillingMethods(token,segmentType) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getBillingMethods,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                type: segmentType,
            }
        }).then(result => {
            //console.log(result.data.getBillingMethods);
            resolve(result.data.getBillingMethods);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.searchCep = function (zipCode){
    let consultZip;
    if(zipCode.indexOf('-')>0){
        let newZipString;
        newZipString = zipCode.split('-');
        consultZip = newZipString[0] + newZipString[1];
    }
    else{
        consultZip = zipCode;
    }
    return new Promise(function(resolve, reject) {
        cep(consultZip).then((result) => {
            resolve(result);
        }).catch((error) => {
            let msg ='';
            if(error.type === 'service_error'){
                msg = 'ZIP_NOT_FOUND'
            } else if (error.type === 'validation_error'){
                msg = 'ZIP_WRONG_FORMAT'
            }
            reject(msg);
        })
    });
};

exports.createClient = function (token,clientInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation: createClient,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                clientInput: clientInput
            }
        }).then(result => {
            //console.log(result.data.createClient);
            resolve(result.data.createClient);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.editClient = function (token,id,clientInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation: editClient,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                id: id,
                clientInput: clientInput
            }
        }).then(result => {
            resolve(result.data.editClient);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.createPet = function (token,clientID,petInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation: createPet,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                client: clientID,
                petInput: petInput
            }
        }).then(result => {
            //console.log(result.data.createClient);
            resolve(result.data.createPet);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.editPet = function (token,id,clientID,petInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation: createPet,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                id: id,
                client: clientID,
                petInput: petInput
            }
        }).then(result => {
            //console.log(result.data.createClient);
            resolve(result.data.createPet);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.loadNotAcceptedBreeds = function (token,specie) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getNotAcceptedBreeds,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                specie: specie,
            }
        }).then(result => {
            // console.log('Get Not Accepted', result.data.getNotAcceptedBreeds);
            resolve(result.data.getNotAcceptedBreeds);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.loadClients= function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getClients,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        }).then(result => {
            // console.log('Get All Clients', result.data.getClients);
            resolve(result.data.getClients);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.loadClientById= function (token,clientID) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getClientById,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                id: clientID,
            }
        }).then(result => {
            // console.log('Get Client id', result.data.client);
            resolve(result.data.client);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.loadClientByFacebookId = function (token,facebookId) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:clientByFacebookId,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                facebookId: facebookId,
            }
        }).then(result => {
            // console.log('Get Client by FB id', result.data.clientByFacebookId);
            resolve(result.data.clientByFacebookId);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};


exports.loadAvailableTimes = function (token,bookingClientInput) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getAvailableTimes,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                bookingClientInput: bookingClientInput,
            }
        }).then(result => {
            resolve(result.data.getAvailableTimes);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.loadGetCombos = function (token,segmentType) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getCombos,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                segmentType: segmentType,
                filter: {
                    showOnChatbot: true
                }
            }
        }).then(result => {
            console.error(result);
            resolve(result.data.getCombos);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};


exports.loadQuickAvailableTimes = function (token,bookingQuickClientInput) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getQuickAvailableTimes,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                bookingQuickClientInput: bookingQuickClientInput,
            }
        }).then(result => {
            resolve(result.data.getQuickAvailableTimes);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.createBooking = function (token, timeId, bookingInput, checklist, employee) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation:createBooking,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                timeId: timeId,
                bookingInput: bookingInput,
                checklist: checklist,
                employee: employee
            }
        }).then(result => {
            resolve(result.data.createBooking);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.getEmployees = function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getEmployees,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        }).then(result => {
            resolve(result.data.getEmployees);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.getBookinsByUser = function (token,filters) {
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getBookinsByUser,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                filters: filters
            }
        }).then(result => {
            resolve(result.data.getBookinsByUser);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.changeBookingDate = function (token,bookingId,timeId,status,checklist,employee) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            fetchPolicy: fetchPolicy,
            mutation:changeBookingDate,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                bookingId: bookingId,
                timeId: timeId,
                status: status,
                checklist: checklist,
                employee: employee
            }
        }).then(result => {
            resolve(result.data.changeBookingDate);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.changeBookingStatus = function (token,bookingId,status,checklist,employee,services) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            fetchPolicy: fetchPolicy,
            mutation:changeBookingStatus,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                bookingId: bookingId,
                status: status,
                checklist: checklist,
                employee: employee,
                services: services,
            }
        }).then(result => {
            resolve(result.data.changeBookingStatus);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};


exports.removeBooking = function (token,bookingId,employee) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            fetchPolicy: fetchPolicy,
            mutation:removeBooking,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                bookingId: bookingId,
                employee: employee
            }
        }).then(result => {
            resolve(result.data.removeBooking);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.changeChatbotNotification = function (token,id, chatbotNotificationInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            fetchPolicy: fetchPolicy,
            mutation:changeChatbotNotification,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                id: id,
                chatbotNotificationInput: chatbotNotificationInput,
            }
        }).then(result => {
            resolve(result.data.changeChatbotNotification);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};

exports.findClients= function (token,value,type,page,qty){
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:findClient,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                value: value,
                type: type,
                page: page,
                qty: qty
            }
        }).then(result => {
            // console.log('Get Client id', result.data.client);
            resolve(result.data.findClient);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};


exports.getPetPlans= function (token,filter,page,qty){
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getPetPlans,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                filter: filter,
                page: page,
                qty: qty
            }
        }).then(result => {
            // console.log('Get Client id', result.data.client);
            resolve(result.data.getPetPlans);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};


exports.getPlans = function (token){
    return new Promise(function(resolve, reject) {
        client.query({
            fetchPolicy: fetchPolicy,
            query:getPlans,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                filter: {
                    showOnChatbot: true
                }
            }
        }).then(result => {
            // console.log('Get Client id', result.data.client);
            resolve(result.data.getPetPlans);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};
exports.createPetPlan = function (token,petPlanInput) {
    return new Promise(function(resolve, reject) {
        client.mutate({
            mutation: createClient,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                petPlanInput: petPlanInput
            }
        }).then(result => {
            //console.log(result.data.createClient);
            resolve(result.data.createClient);
        })
            .catch(error => {
                console.error('error',error);
                reject(error);
            });
    });
};
