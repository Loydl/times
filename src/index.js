import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container';
import { BrowserRouter as Router } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

import $ from 'jquery'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
window.jQuery = window.$ = $;
require('bootstrap/dist/js/bootstrap.bundle.min');


ReactDOM.render(
    <Router>
        <Container/>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
