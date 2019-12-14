import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

// import HomeIcon from '@material-ui/icons/Home';

import EmptyState from '../EmptyState';
import Button from '@material-ui/core/Button';
import Boligudlejning from '../Boligudlejning';
import Illustration from '../Assets/documents_illustration.svg'

const styles = (theme) => ({
  emptyStateIcon: {
    fontSize: theme.spacing(12)
  },

  button: {
    // backgroundColor: '#79B729',
    color: 'white',
    marginTop: '5vh',
    padding: '1vh 1.5vh'
  },

  a2hs: {
    marginTop: '5vh',
    padding: '1vh 1.5vh'
  },

  buttonIcon: {
    marginRight: theme.spacing(1)
  }
});


class HomeContent extends Component {
  render() {
    // Events
    const { onSignUpClick, performingAction, openSnackbar, userData, installApp } = this.props;

    // Styling
    const { classes } = this.props;

    // Properties
    const { user } = this.props;

    const imgStyle = {
      maxWidth: '100px',
      textAlign: 'center',
    };

    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    let isStandalone = ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true)

    if (user) {
      return (
        <Boligudlejning user={user} userData={userData} openSnackbar={openSnackbar} />
      );
    }
    return (
      <EmptyState
        title={process.env.REACT_APP_NAME}
        description="Nu kan du sagtens selv"
        icon={
          <img src={Illustration} alt='DR LOGO' style={imgStyle} />
        }
        button={
          <Button className={classes.button} disabled={performingAction}
            color='primary'
            variant="contained" onClick={onSignUpClick}>
            Opret bruger
          </Button>
        }
        a2hsBtn={
          !isIOS && !isStandalone &&
          <Button className={classes.a2hs} color='secondary' disabled={performingAction} variant="contained" onClick={installApp}>
            Download app
          </Button>
        }
      />
    );
  }
}

HomeContent.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  onSignUpClick: PropTypes.func,
  // onTitleClick: PropTypes.func.isRequired,
  // onSettingsClick: PropTypes.func.isRequired,
  // onSignOutClick: PropTypes.func.isRequired
};

HomeContent.defaultProps = {
  performingAction: false
};


export default withStyles(styles)(HomeContent);
