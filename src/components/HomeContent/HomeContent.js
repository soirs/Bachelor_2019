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
    backgroundColor: '#79B729',
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
  installPrompt = null;
  componentDidMount() {
    console.log("Listening for Install prompt");
    window.addEventListener('beforeinstallprompt', e => {
      // For older browsers
      e.preventDefault();
      console.log("Install Prompt fired");
      this.installPrompt = e;
      console.log('this.installPrompt :', this.installPrompt);
      // See if the app is already installed, in that case, do nothing.
      if ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true) {
        return false;
      }
    })
  }
  installApp = async () => {
    if (!this.installPrompt) { return false }
    this.installPrompt.prompt();

    let outcome = await this.installPrompt.userChoice;
    // eslint-disable-next-line eqeqeq
    if (outcome.outcome == 'accepted') {
      console.log("PWA setup accepted")
    }
    else {
      console.log("PWA setup rejected");
    }
    // Remove the event reference
    this.installPrompt = null;
  }

  render() {
    // Events
    const { onSignUpClick, performingAction, openSnackbar, userData } = this.props;

    // Styling
    const { classes } = this.props;

    // Properties
    const { user } = this.props;

    const imgStyle = {
      maxWidth: '100px',
      textAlign: 'center',
      cursor: 'pointer'
    };

    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

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
          <Button className={classes.button} disabled={performingAction} variant="contained" onClick={onSignUpClick}>
            Opret bruger
          </Button>
        }
        a2hsBtn={
          !isIOS &&
          <Button className={classes.a2hs} color='secondary' disabled={performingAction} variant="contained" onClick={this.installApp}>
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
