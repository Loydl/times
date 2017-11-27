import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { client } from './../index';

const query = gql`
    query User {
        user {
            email
        }
    }
`;

class Navbar extends Component {

    handleLogout() {
        localStorage.removeItem('token');
        client.resetStore();
        this.props.history.push('/login')
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <span className="navbar-brand">Times</span>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <span className="navbar-text" onClick={() => this.handleLogout()}>
                        { this.props.data.user && !this.props.data.loading? this.props.data.user.email : '' }
                     </span>
                </div>
            </nav>
        )
    }
}

export default withRouter(graphql(query)(Navbar));
export { query };