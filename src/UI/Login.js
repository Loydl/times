import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import Loader from 'react-loader';
import firebase from 'firebase';
import fire from '../utils/fire';

const provider = new firebase.auth.GoogleAuthProvider();

export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            redirectToReferrer: false,
            error: null,
            loading: false,
            loggedIn: false
        };
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: !!user
            })
        });

        if(this.state.loggedIn) {
            this.setState({
                redirectToReferrer: true
            })
        }
    }

    handleLogin() {
        this.setState({
            loading: true,
            error: null
        });

        fire.auth().signInWithPopup(provider).then((result) => {
            console.log('result: ', result);
            this.setState({
                loading: false,
            })
        }).catch(error => {
            this.setState({
                error
            })
        });
    }

    render() {
        const { loading, error, redirectToReferrer } = this.state;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        if (this.state.loggedIn || redirectToReferrer) {
            return (
                <Redirect push to={from} />
            )
        }

        return (
            <div className='container'>
                <div className="row justify-content-md-center pt-3">
                    <div className="col-md-4">
                        <div className="container-fluid bg-light pt-3 pb-3 border rounded">
                            <div className='page-header'>
                                <h1>login</h1>
                            </div>
                            <Loader loaded={!loading}>
                                { error ? <div className="alert alert-danger">{ error.message }</div> : null}
                                <p>You must log in to view the page at {from.pathname}</p>
                                <GoogleButton
                                    onClick={() => this.handleLogin()}
                                />
                            </Loader>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}