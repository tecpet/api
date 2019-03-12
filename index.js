const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch');
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const setContext = require('apollo-link-context').setContext;

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

exports.login = function (login,password) {
// function login(user,password) {
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
                // example of setting the headers with context per operation
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
                // example of setting the headers with context per operation
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
                // example of setting the headers with context per operation
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
                resolve(result.data.getSegments); // does not have field data.getTimeTable
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
                // example of setting the headers with context per operation
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
                // example of setting the headers with context per operation
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            },
            variables: {
                segmentType: segmentType,
            }
        }).then(result => {
            console.log(result.data.getChecklists);
            resolve(result.data.getChecklists);
        })
            .catch(error => {
                // console.error('error',error);
                reject(error);
            });
    });
};

// loadTimeTables(token,"PET_SHOP");
// loadSegments(token);
// loadCategoriesWithServices(token,"PET_SHOP");
// login('','').then(result => console.log('Login',result)).catch(e=>console.log("ERROR",e));
// loadChecklists(token,"PET_SHOP");