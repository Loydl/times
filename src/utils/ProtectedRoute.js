import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class ProtectedRoute extends React.Component {

    render() {
        const { component: Component, path } = this.props;


        return (
            <Route path={path} render={props => (
                !!localStorage.getItem('token') ? (
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

