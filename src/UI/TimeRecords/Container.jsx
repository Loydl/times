import React, { Component } from 'react';
import Form from './Form';
import Table from './Table';

export default class Container extends Component {

    render() {
        return(
            <div className="container">
                <Form />
                <Table />
            </div>
        )
    }
}