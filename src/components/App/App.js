import React, { Component } from 'react';

import readingTime from 'reading-time';

import { MuiThemeProvider } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { auth, firestore } from '../../firebase';
import authentication from '../../services/authentication';
import theming from '../../services/theming';

import LaunchScreen from '../LaunchScreen';

import Bar from '../Bar';

import Router from '../Router';
import DialogHost from '../DialogHost';
import InstallPWA from "../utility/InstallPWA";
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userData: null,
      theme: theming.defaultTheme,

      ready: false,
      performingAction: false,

      aboutDialog: {
        open: false
      },

      signUpDialog: {
        open: false
      },

      signInDialog: {
        open: false
      },

      settingsDialog: {
        open: false
      },

      deleteAccountDialog: {
        open: false
      },

      signOutDialog: {
        open: false
      },

      snackbar: {
        autoHideDuration: 0,
        message: '',
        open: false
      }
    };
  }

  openDialog = (dialogId, callback) => {
    const dialog = this.state[dialogId];

    if (!dialog || dialog.open === undefined || null) {
      return;
    }

    dialog.open = true;

    this.setState({ dialog }, callback);
  };

  closeDialog = (dialogId, callback) => {
    const dialog = this.state[dialogId];

    if (!dialog || dialog.open === undefined || null) {
      return;
    }

    dialog.open = false;

    this.setState({ dialog }, callback);
  };

  closeAllDialogs = (callback) => {
    this.setState({
      aboutDialog: {
        open: false
      },

      signUpDialog: {
        open: false
      },

      signInDialog: {
        open: false
      },

      settingsDialog: {
        open: false
      },

      deleteAccountDialog: {
        open: false
      },

      signOutDialog: {
        open: false
      }
    }, callback);
  };

  deleteAccount = () => {
    this.setState({
      performingAction: true
    }, () => {
      authentication.deleteAccount().then(() => {
        this.closeAllDialogs(() => {
          this.openSnackbar('Deleted account');
        });
      }).catch((reason) => {
        const code = reason.code;
        const message = reason.message;

        switch (code) {
          default:
            this.openSnackbar(message);
            return;
        }
      }).finally(() => {
        this.setState({
          performingAction: false
        });
      });
    });
  };

  signOut = () => {
    this.setState({
      performingAction: true
    }, () => {
      authentication.signOut().then(() => {
        this.closeAllDialogs(() => {
          this.openSnackbar('Logget ud');
        });
      }).catch((reason) => {
        const code = reason.code;
        const message = reason.message;

        switch (code) {
          default:
            this.openSnackbar(message);
            return;
        }
      }).finally(() => {
        this.setState({
          performingAction: false
        });
      });
    });
  };

  openSnackbar = (message, autoHideDuration = 2, callback) => {
    this.setState({
      snackbar: {
        autoHideDuration: readingTime(message).time * autoHideDuration,
        // autoHideDuration: 2 * autoHideDuration,
        message,
        open: true
      }
    }, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  closeSnackbar = (clearMessage = false) => {
    const { snackbar } = this.state;

    this.setState({
      snackbar: {
        message: clearMessage ? '' : snackbar.message,
        open: false
      }
    });
  };

  updateReadySnackbar = () => {
    if ('serviceWorker' in navigator) {
      let refreshing;
      window.navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        // window.location.reload();
        refreshing = true;
        return fireUpdatePrompt();
      });
      const fireUpdatePrompt = () => this.openSnackbar('Opdaterer til nyeste version');
    }
  }

  iosA2HSPrompt = () => {
    if (navigator.standalone) {
      return false;
    }

    let today = moment().toDate();
    let lastPrompt = moment(localStorage.getItem("installPrompt"));
    let days = moment(today).diff(lastPrompt, "days");

    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    let isApple = ['iPhone', 'iPad', 'iPod'].includes(window.navigator.platform) || isIOS;

    let prompt = (isNaN(days) || days > 30) && isApple;

    if (isApple && "localStorage" in window) {
      localStorage.setItem("installPrompt", today);
    }
    return prompt && <InstallPWA />
  }

  render(props) {
    const {
      user,
      userData,
      theme,
      ready,
      performingAction,
    } = this.state;

    const {
      aboutDialog,
      signUpDialog,
      signInDialog,
      settingsDialog,
      deleteAccountDialog,
      signOutDialog
    } = this.state;

    const { snackbar } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        {/* A2HS */}
        {this.iosA2HSPrompt()}
        {/* A2HS */}

        {!ready &&
          <LaunchScreen />
        }

        {ready &&
          <>
            <Bar
              performingAction={performingAction}

              user={user}
              userData={userData}

              onSignUpClick={() => this.openDialog('signUpDialog')}
              onSignInClick={() => this.openDialog('signInDialog')}

              onSettingsClick={() => this.openDialog('settingsDialog')}
              onSignOutClick={() => this.openDialog('signOutDialog')}
            />

            <Router
              performingAction={performingAction}

              user={user}
              userData={userData}
              openSnackbar={this.openSnackbar}

              // For <HomeContent/>
              onSignUpClick={() => this.openDialog('signUpDialog')}
            />

            <DialogHost
              user={user}
              dialogs={
                {
                  aboutDialog: {
                    dialogProps: {
                      open: aboutDialog.open,

                      onClose: () => this.closeDialog('aboutDialog')
                    },

                    props: {
                      user: user
                    }
                  },

                  signUpDialog: {
                    dialogProps: {
                      open: signUpDialog.open,

                      onClose: (callback) => {
                        this.closeDialog('signUpDialog');

                        if (callback && typeof callback === 'function') {
                          callback();
                        }
                      }
                    },

                    props: {
                      performingAction: performingAction,

                      openSnackbar: this.openSnackbar
                    }
                  },

                  signInDialog: {
                    dialogProps: {
                      open: signInDialog.open,

                      onClose: (callback) => {
                        this.closeDialog('signInDialog');

                        if (callback && typeof callback === 'function') {
                          callback();
                        }
                      }
                    },

                    props: {
                      performingAction: performingAction,

                      openSnackbar: this.openSnackbar
                    }
                  },

                  settingsDialog: {
                    dialogProps: {
                      open: settingsDialog.open,

                      onClose: () => this.closeDialog('settingsDialog')
                    },

                    props: {
                      user: user,
                      userData: userData,
                      theme: theme,

                      openSnackbar: this.openSnackbar,

                      onDeleteAccountClick: () => this.openDialog('deleteAccountDialog')
                    }
                  },

                  deleteAccountDialog: {
                    dialogProps: {
                      open: deleteAccountDialog.open,

                      onClose: () => this.closeDialog('deleteAccountDialog')
                    },

                    props: {
                      performingAction: performingAction,
                      userData: userData,

                      deleteAccount: this.deleteAccount
                    }
                  },

                  signOutDialog: {
                    dialogProps: {
                      open: signOutDialog.open,

                      onClose: () => this.closeDialog('signOutDialog')
                    },

                    props: {
                      title: 'Log ud?',
                      contentText: 'Når du er logget ud vil du ikke være i stand til at varetage din profil og benytte dine tilknyttede produkter',
                      dismissiveAction: <Button color="primary" onClick={() => this.closeDialog('signOutDialog')}>Fortryd</Button>,
                      confirmingAction: <Button color="primary" disabled={performingAction} variant="contained" onClick={this.signOut}>Log ud</Button>
                    }
                  }
                }
              }
            />

            <Snackbar
              autoHideDuration={snackbar.autoHideDuration}
              message={snackbar.message}
              open={snackbar.open}
              onClose={this.closeSnackbar}
            />
          </>
        }
      </MuiThemeProvider>
    );
  }

  componentDidMount() {
    this.mounted = true;

    this.removeAuthStateChangedObserver = auth.onAuthStateChanged((user) => {
      if (!user) {
        if (this.removeReferenceListener) {
          this.removeReferenceListener();
        }

        if (this.mounted) {
          this.setState({
            user: null,
            userData: null,
            theme: theming.defaultTheme,

            ready: true
          });
        }

        return;
      }

      const uid = user.uid;

      if (!uid) {
        if (this.removeReferenceListener) {
          this.removeReferenceListener();
        }

        if (this.mounted) {
          this.setState({
            user: null,
            userData: null,
            theme: theming.defaultTheme,

            ready: true
          });
        }

        return;
      }

      const reference = firestore.collection('users').doc(uid);

      if (!reference) {
        if (this.removeReferenceListener) {
          this.removeReferenceListener();
        }

        if (this.mounted) {
          this.setState({
            user: null,
            userData: null,
            theme: theming.defaultTheme,

            ready: true
          });
        }

        return;
      }

      this.removeReferenceListener = reference.onSnapshot((snapshot) => {
        if (!snapshot.exists) {
          if (this.mounted) {
            this.setState({
              user: null,
              userData: null,
              theme: theming.defaultTheme,

              ready: true
            });
          }

          return;
        }

        const data = snapshot.data();

        if (!data) {
          if (this.mounted) {
            this.setState({
              user: null,
              userData: null,
              theme: theming.defaultTheme,

              ready: true
            });
          }

          return;
        }

        if (data.theme) {
          this.setState({
            theme: theming.createTheme(data.theme)
          });
        } else {
          this.setState({
            theme: theming.defaultTheme
          });
        }

        if (this.mounted) {
          this.setState({
            user: user,
            userData: data,

            ready: true
          });
        }
      }, (error) => {
        if (this.mounted) {
          this.setState({
            user: null,
            userData: null,
            theme: theming.defaultTheme,

            ready: true
          }, () => {
            const code = error.code;
            const message = error.message;

            switch (code) {
              default:
                this.openSnackbar(message);
                return;
            }
          });
        }
      });
    });
    this.updateReadySnackbar();
  }

  componentWillUnmount() {
    if (this.removeAuthStateChangedObserver) {
      this.removeAuthStateChangedObserver();
    }

    if (this.removeReferenceListener) {
      this.removeReferenceListener();
    }

    this.mounted = false;
  }
}

export default App;
