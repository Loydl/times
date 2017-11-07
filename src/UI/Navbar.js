import React, { Component } from 'react';
import fire from '../utils/fire';

export default class Navbar extends Component {

    constructor() {
        super();

        this.state = {
            user: null
        }
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            this.setState({
                user: user
            })
        });
    }

    handleLogout() {
        this.setState({
            user: null
        });

        fire.auth().signOut()
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
                        { this.state.user ? this.state.user.displayName : '' }
                     </span>
                </div>
            </nav>
        )
    }
}