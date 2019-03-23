const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch');
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const setContext = require('apollo-link-context').setContext;
const cep = require('cep-promise');

const createClient = gql`
    mutation createClient($clientInput: ClientInput!) {
        createClient(clientInput: $clientInput) {
            id
        }
    }
`;

const editClient = gql`
    mutation editClient( $id: ID!, $clientInput: ClientInput!) {
        editClient(id: $id, clientInput: $clientInput) {
            id
        }
    }
`;

const editPet = gql`
    mutation editPet($client: ID!,$id: ID!, $petInput: PetInput!) {
        editPet(client: $client, id:$id, petInput: $petInput ) {
            id
        }
    }
`;
const createPet = gql`
    mutation createPet($client: ID!,$petInput: PetInput!) {
        createPet(client: $client, petInput:$petInput ) {
            id
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
    query getServiceCategoriesWithServices($segmentType: ShopSegment!){
        getServiceCategoriesWithServices(segmentType: $segmentType) {
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
        }
    }
`;


function json(response) {
    return response.json()
}

exports.login = function (user,password) {
//function login(user,password) {
    return new Promise(function(resolve, reject) {
        fetch('http://tecpet-api-dev.sa-east-1.elasticbeanstalk.com/auth/login', {
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


const httpLink = createHttpLink({
    uri: 'http://tecpet-api-dev.sa-east-1.elasticbeanstalk.com/graphql/',
    fetch: fetch
});


const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

exports.getSegments = function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
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
                resolve(result.data.getSegments);
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
            query:getServiceCategoriesWithServices,
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                segmentType: segmentType,
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
//function searchCep(zipCode){
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
            if (!result.errors) {
                //console.log(result);
                resolve(result);
            } else {
                console.log('ERROR CEP API',result.errors);
                reject(result);
            }
        }, (result) => {
            console.log('ERROR Network',result);
            reject(result);
        });
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

