import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import fire from './fire'

export default class ProtectedRoute extends React.Component {
    constructor() {
        super();

        this.state = {
            loggedIn: true
        }
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: !!user
            })
        });
    }

    render() {
        const { component: Component, path } = this.props;

        return (
            <Route path={path} render={props => (
                this.state.loggedIn ? (
                    <Component {...props}/>
                ) : (
                    <Redirect push to={{
                        pathname: '/login',
                        state: { from: props.location}
                    }}/>
                )
            )}/>
        )
    }
}
