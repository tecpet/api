const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch');
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const setContext = require('apollo-link-context').setContext;

const getGeneralInfo = gql`
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
    return new Promise(function(resolve, reject) {
        fetch('http://tecpet-api-dev.sa-east-1.elasticbeanstalk.com/auth/login', {
            method: "POST",
            body: JSON.stringify({"login": login, "password": password}),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(json)
        .then(function (data) {
            // console.log('Request succeeded with JSON response', data);
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
                resolve(result.data.getSegments);
            })
            .catch(error => {
                reject(error);
            });
    });
};


exports.getShopGeneralInfo = function (token) {
    return new Promise(function(resolve, reject) {
        client.query({
            query:getGeneralInfo,
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
