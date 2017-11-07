import React, { Component } from 'react';
import Form from './Form';
import Table from './Table';
import fire from '../../utils/fire';

export default class Container extends Component {

    constructor() {
        super();

        this.state = {
            user: null
        }
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            this.setState({
                user
            })
        });
    }

    render() {
        return(
            <div className="container">
                <Form user={this.state.user}/>
                <Table user={this.state.user}/>
            </div>
        )
    }
}