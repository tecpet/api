
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const setContext = require('apollo-link-context').setContext;

const httpLink =  createHttpLink({
    uri: 'http://tecpet-api-dev.sa-east-1.elasticbeanstalk.com/graphql/',
    fetch: fetch
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6Im1hcmN1cyIsInBhc3N3b3JkIjoiMTIzNDUiLCJpYXQiOjE1NTIwNzg3NzYsImV4cCI6MTU1NDY3MDc3Nn0.Cn8LhyVtmQ_uW8L7ZEZCN72dZcSxXCfelq7-c-MCS-w'
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const getGeneralInfo = gql`
    query getGeneralInfo {
        getShopGeneralInfo {
            name
            description
            phoneNumber
        }
    }
`;

// function getShopGeneralInfo () {
exports.getShopGeneralInfo = function () {
    return new Promise(function(resolve, reject) {
        client.query({
            query:getGeneralInfo
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

// getShopGeneralInfo();


// require('dotenv').config();
// const gql = require('graphql-tag');
// const ApolloClient = require('apollo-boost').ApolloClient;
// const fetch = require('cross-fetch/polyfill').fetch;
// const createHttpLink = require('apollo-link-http').createHttpLink;
// const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
// const client = new ApolloClient({
//     link: createHttpLink({
//         uri: process.env.API,
//         fetch: fetch
//     }),
//     cache: new InMemoryCache()
// });
//
// client.mutate({
//     mutation: gql`
//         mutation popJob {
//             popJob {
//                 id
//                 type
//                 param
//                 status
//                 progress
//                 creation_date
//                 expiration_date
//             }
//         }
//     `,
// }).then(job => {
//     console.log(job);
// })
