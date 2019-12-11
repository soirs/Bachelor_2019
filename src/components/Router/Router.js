import React, { Component } from 'react'

import PropTypes from 'prop-types';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomeContent from '../HomeContent';
import NotFoundContent from '../NotFoundContent';
import Login from '../Login';
// import Boligudlejning from '../Boligudlejning';

class Router extends Component {
  render(props) {
    // Properties
    const { user, performingAction, onSignUpClick, openSnackbar, userData } = this.props;

    return (
      <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        <Switch>

          <Route path="/" exact>
            <HomeContent user={user} userData={userData}
              performingAction={performingAction}
              openSnackbar={openSnackbar}
              onSignUpClick={onSignUpClick}
              {...props} />
          </Route>
{/* 
          <Route path='/Boligudlejning' exact>
            <Boligudlejning user={user} performingAction={performingAction} openSnackbar={openSnackbar} {...props} />
          </Route>
 */}
          <Route path='/Login' exact>
          <Login user={user} {...props} />
        </Route>

          <Route>
            <NotFoundContent />
          </Route>

        </Switch>
      </BrowserRouter>
    )
  }
}

Router.propTypes = {
  // Properties
  user: PropTypes.object,
  // Custom Functions
  openSnackbar: PropTypes.func.isRequired,
};

export default Router;
