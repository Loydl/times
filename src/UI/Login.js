import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleButton from '../utils/GoogleButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { query } from './Navbar';

const authMutaion = gql`    
    mutation AuthMutaion($googleToken: String!) {
        authenticateGoogleUser(googleToken: $googleToken) {
            token
        }
    }
`;

class Login extends Component {

    constructor() {
        super();

        this.state = {
            redirectToReferrer: false,
            error: null
        };
    }

    handleSuccess = (response) => {
        this.props.mutate({
            variables: { googleToken: response.token.idToken }
        })
            .then(({ data }) => {
                this.props.userQuery.refetch();
                localStorage.setItem('token', data.authenticateGoogleUser.token);
                this.setState({
                    redirectToReferrer: true
                })

            })
            .catch(error => {
                this.setState({
                    error: error.message
                })
            })
    }

    handleFailure(error){
        this.setState({
            loading: false,
            error
        })
    }

    render() {
        const { error, redirectToReferrer } = this.state;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        if (redirectToReferrer || !!localStorage.getItem('token')) {
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
                            { error ? <div className="alert alert-danger">{ error }</div> : null}
                            <p>You must log in to view the page at {from.pathname}</p>
                            <GoogleButton
                                provider='google'
                                appId={process.env['REACT_APP_GOOGLE_OAUTH_CLIENT_ID']}
                                onLoginSuccess={this.handleSuccess}
                                onLoginFailure={this.handleFailure.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(authMutaion),
    graphql(query, { name: 'userQuery' })
)(Login);