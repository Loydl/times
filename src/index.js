import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container';
import { Router } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import history from './utils/Histrory';

import registerServiceWorker from './registerServiceWorker';

import $ from 'jquery'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-select/dist/react-select.css';
window.jQuery = window.$ = $;
require('bootstrap/dist/js/bootstrap.bundle.min');



const httpLink = createHttpLink({
    uri: process.env['REACT_APP_GRAPHQL_API'],
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');

    const decoded = token ? jwtDecode(token) : {};

    if(decoded.exp < new Date().getTime() / 1000) {
        localStorage.removeItem('token');
        history.push('/login')
    }

    // return the headers to the context so httpLink can read them
    return {
        headers: decoded.exp < new Date().getTime() ? Object.assign({}, headers, { Authorization: `Bearer ${token}`}) : Object.assign({}, headers)
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export { client };

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <Container/>
        </Router>
    </ApolloProvider>
    , document.getElementById('root')
);
registerServiceWorker();
