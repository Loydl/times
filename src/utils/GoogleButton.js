import React from 'react';
import SocialLogin from 'react-social-login';
import GoogleButton from 'react-google-button';

class Button extends React.Component {
    render() {
        const { triggerLogin, ...props } = this.props;

        return <GoogleButton onClick={triggerLogin} {...props} />
    }
}

export default SocialLogin(Button)