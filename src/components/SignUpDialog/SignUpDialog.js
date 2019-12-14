import React, { Component } from 'react';

import PropTypes from 'prop-types';

import validate from 'validate.js';

import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

// import AuthProviderList from '../AuthProviderList';

import constraints from '../../constraints';
import authentication from '../../services/authentication';
import WorkingSVG from '../Assets/working.svg'

const styles = (theme) => ({
  icon: {
    marginRight: theme.spacing(0.5)
  },

  divider: {
    margin: 'auto'
  },

  grid: {
    marginBottom: theme.spacing(2)
  }
});

const initialState = {
  performingAction: false,

  emailAddress: '',
  emailAddressConfirmation: '',
  password: '',
  passwordConfirmation: '',

  errors: null
};

class SignUpDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  signUp = () => {
    const {
      emailAddress,
      emailAddressConfirmation,
      password,
      passwordConfirmation
    } = this.state;

    const errors = validate({
      emailAddress: emailAddress,
      emailAddressConfirmation: emailAddressConfirmation,
      password: password,
      passwordConfirmation: passwordConfirmation
    }, {
      emailAddress: constraints.emailAddress,
      emailAddressConfirmation: constraints.emailAddressConfirmation,
      password: constraints.password,
      passwordConfirmation: constraints.passwordConfirmation
    });

    if (errors) {
      this.setState({
        errors: errors
      });
    } else {
      this.setState({
        performingAction: true,

        errors: null
      }, () => {
        authentication.signUpWithEmailAddressAndPassword(emailAddress, password).then((value) => {
          this.props.dialogProps.onClose();
        }).catch((reason) => {
          const code = reason.code;
          const message = reason.message;

          switch (code) {
            case 'auth/email-already-in-use':
            case 'auth/invalid-email':
            case 'auth/operation-not-allowed':
            case 'auth/weak-password':
              this.props.openSnackbar(message);
              return;

            default:
              this.props.openSnackbar(message);
              return;
          }
        }).finally(() => {
          this.setState({
            performingAction: false
          });
        });
      });
    }
  };

  signInWithAuthProvider = (providerId) => {
    this.setState({
      performingAction: true
    }, () => {
      authentication.signInWithAuthProvider(providerId).then((user) => {
        this.props.dialogProps.onClose(() => {
          const displayName = user.displayName;
          const emailAddress = user.email;

          this.props.openSnackbar(`Logget ind som: ${displayName || emailAddress}`);
        });
      }).catch((reason) => {
        const code = reason.code;
        const message = reason.message;

        switch (code) {
          case 'auth/account-exists-with-different-credential':
          case 'auth/auth-domain-config-required':
          case 'auth/cancelled-popup-request':
          case 'auth/operation-not-allowed':
          case 'auth/operation-not-supported-in-this-environment':
          case 'auth/popup-blocked':
          case 'auth/popup-closed-by-user':
          case 'auth/unauthorized-domain':
            this.props.openSnackbar(message);
            return;

          default:
            this.props.openSnackbar(message);
            return;
        }
      }).finally(() => {
        this.setState({
          performingAction: false
        });
      });
    });
  };

  handleKeyPress = (event) => {
    const {
      emailAddress,
      emailAddressConfirmation,
      password,
      passwordConfirmation
    } = this.state;

    if (!emailAddress ||
      !emailAddressConfirmation ||
      !password ||
      !passwordConfirmation) {
      return;
    }

    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === 'Enter') {
      this.signUp();
    }
  };

  handleExited = () => {
    this.setState(initialState);
  };

  handleEmailAddressChange = (event) => {
    const emailAddress = event.target.value;

    this.setState({
      emailAddress: emailAddress,
      emailAddressConfirmation: emailAddress,
    });
  };

  handleEmailAddressConfirmationChange = (event) => {
    const emailAddressConfirmation = event.target.value;

    this.setState({
      emailAddressConfirmation: emailAddressConfirmation
    });
  };

  handlePasswordChange = (event) => {
    const password = event.target.value;

    this.setState({
      password: password,
      passwordConfirmation: password
    });
  };

  handlePasswordConfirmationChange = (event) => {
    const passwordConfirmation = event.target.value;

    this.setState({
      passwordConfirmation: passwordConfirmation
    });
  };

  render() {
    // Dialog Properties
    const { dialogProps } = this.props;

    const {
      performingAction,

      emailAddress,
      emailAddressConfirmation,
      password,
      passwordConfirmation,

      errors
    } = this.state;

    const imgStyle = {
      maxWidth: '50%',
      width: '50%',
      display: 'inherit',
      margin: '40px auto 0',
    };

    const titleStyle = {
      width: '100%',
      margin: '20px auto 0',
      display: 'inherit',
      textAlign: 'center'
    };

    const subtitleStyle = {
      width: '100%',
      margin: '0 auto 20px',
      display: 'inherit',
      textAlign: 'center',
      fontSize: '16px'
    };

    return (
      <Dialog fullWidth maxWidth="xs" {...dialogProps} onKeyPress={this.handleKeyPress} onExited={this.handleExited}>
        <DialogTitle>
        <img src={WorkingSVG} alt="" style={imgStyle} />
        <span style={titleStyle}>Velkommen til Digital Revisor!</span>
          <span style={subtitleStyle}>Opret din nye bruger her</span>
        </DialogTitle>

        <Hidden xsDown>
          <DialogContent>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <TextField
                      autoComplete="email"
                      disabled={performingAction}
                      error={!!(errors && errors.emailAddress)}
                      fullWidth
                      helperText={(errors && errors.emailAddress) ? errors.emailAddress[0] : ''}
                      label="E-mail adresse"
                      placeholder="john@madsen.dk"
                      required
                      type="email"
                      value={emailAddress}
                      variant="outlined"

                      onChange={this.handleEmailAddressChange}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      autoComplete="new-password"
                      disabled={performingAction}
                      error={!!(errors && errors.password)}
                      fullWidth
                      helperText={(errors && errors.password) ? errors.password[0] : ''}
                      label="Kodeord"
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      required
                      type="password"
                      value={password}
                      variant="outlined"

                      onChange={this.handlePasswordChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Hidden>

        <Hidden smUp>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item xs>
                <TextField
                  autoComplete="email"
                  disabled={performingAction}
                  error={!!(errors && errors.emailAddress)}
                  fullWidth
                  helperText={(errors && errors.emailAddress) ? errors.emailAddress[0] : ''}
                  label="E-mail adresse"
                  placeholder="john@madsen.dk"
                  required
                  type="email"
                  value={emailAddress}
                  variant="outlined"

                  onChange={this.handleEmailAddressChange}
                />
              </Grid>

              <Grid item >
                <TextField
                  autoComplete="new-password"
                  disabled={performingAction}
                  error={!!(errors && errors.password)}
                  fullWidth
                  helperText={(errors && errors.password) ? errors.password[0] : ''}
                  label="Kodeord"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  type="password"
                  value={password}
                  variant="outlined"

                  onChange={this.handlePasswordChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Hidden>

        <DialogActions>
          <Button color="primary" onClick={dialogProps.onClose}>Annuller</Button>

          <Button
            color="primary"
            disabled={
              !emailAddress ||
              !emailAddressConfirmation ||
              !password ||
              !passwordConfirmation ||
              performingAction
            }
            variant="contained"

            onClick={this.signUp}>
            Opret bruger
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SignUpDialog.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Dialog Properties
  dialogProps: PropTypes.object.isRequired,

  // Custom Functions
  openSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(SignUpDialog);
