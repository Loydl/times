import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { query } from './Navbar';

const authMutaion = gql`    
    mutation authUser($input: AuthenticateInput!) {
         authenticate(input: $input) {
             jwtToken
         }
    }
`;

class Login extends Component {

    constructor() {
        super();

        this.state = {
            redirectToReferrer: false,
            error: null,
            email: '',
            password: ''
        };
    }

    submitLogin(e) {
        e.preventDefault();

        const { email, password } = this.state;

        this.props.mutate({
            variables: {
                input: {
                    email,
                    password
                }
            }
        })
            .then(({ data }) => {

                localStorage.setItem('token', data.authenticate.jwtToken);
                this.props.userQuery.refetch();
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


    render() {
        const { error, redirectToReferrer, email, password } = this.state;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        const token = localStorage.getItem('token');

        const decoded = token ? jwtDecode(token) : {};

        if (redirectToReferrer || decoded.exp < new Date().getTime()) {
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

                            <form onSubmit={e => this.submitLogin(e)}>
                                <div className='form-group'>
                                    <label>username</label>
                                    <input type="email" value={email} onChange={e => this.setState({ email: e.target.value })} className="form-control" required/>
                                </div>
                                <div className='form-group'>
                                    <label>password</label>
                                    <input type="password" value={password} onChange={e => this.setState({ password: e.target.value })} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(authMutaion),
    graphql(query, { name: 'userQuery'})
)(Login);