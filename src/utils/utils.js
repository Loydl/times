import fire from './fire';

const loggedIn = () => {
    return !!fire.auth().currentUser;
};

const getUser = () => {
    return fire.auth().currentUser;
}

export { loggedIn, getUser };