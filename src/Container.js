import React, { Component } from 'react';
import { Route, withRouter, Redirect} from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './UI/Navbar';
import Login from './UI/Login';
import TimeRecords from './UI/TimeRecords/Container';

class Container extends Component {
  render() {

      if(this.props.location.pathname === '/') {
          return (
              <Redirect push to='/records' />
          )
      }

      return (
          <div className="container-fluid">
              <Navbar/>
              <Route path="/login" component={Login}/>
              <ProtectedRoute path="/records" component={TimeRecords}/>
          </div>
      );
  }
}

export default withRouter(Container);
