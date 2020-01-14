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
import FooterBar from '../FooterBar';
import NewUpdateReady from '../utility/NewUpdateReady';
import {Workbox} from 'workbox-window';

const wb = new Workbox('/sw.js');

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
      },
      isServiceWorkerReady: false
    };
  }
  /* Open login/logout dialog */
  openDialog = (dialogId, callback) => {
    const dialog = this.state[dialogId];

    if (!dialog || dialog.open === undefined || null) {
      return;
    }

    dialog.open = true;

    this.setState({ dialog }, callback);
  };
  /* Close Dialogs */
  closeDialog = (dialogId, callback) => {
    const dialog = this.state[dialogId];

    if (!dialog || dialog.open === undefined || null) {
      return;
    }

    dialog.open = false;

    this.setState({ dialog }, callback);
  };

  /* Settings & Login/Logout Dialog */
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

  /* Within settings - delete account */
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
  /* Sign out action */
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

  /* Snackbar/toast messages - supply only a message string */
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
  /* Uses openSnackbars autoHideDuration to activate */
  closeSnackbar = (clearMessage = false) => {
    const { snackbar } = this.state;

    this.setState({
      snackbar: {
        message: clearMessage ? '' : snackbar.message,
        open: false
      }
    });
  };
  iOSInstaller = () => {
    const { activateIOS } = this.state;

    this.setState({ activateIOS: !activateIOS })
  }
  /* Emit: App is updating to newest version when the controllerchange value changes from null. */
  updateReadySnackbar = () => {
    const { isServiceWorkerReady } = this.state;

    if ('serviceWorker' in navigator) {
      let refreshing;
      
      window.addEventListener('NewContentAvailablePleaseUpdate', () => {
        if (refreshing) return;
        console.log('Live', isServiceWorkerReady)
        refreshing = true;
        this.setState({ isServiceWorkerReady: true })

        // return fireUpdatePrompt();
      });
      // const fireUpdatePrompt = () => this.openSnackbar('Opdaterer til nyeste version. Venligst klik på logoet for at få den nyeste version');
    }
  }
  /* A prompt only shown on iOS devices to add the appliaction to homescreen */
  /* The delay is 30 days until next automatic prompt */
  /* NOTE: iOS will not prompt if the application is already installed or on homescreen */
  iosA2HSPrompt = () => {
    if (navigator.standalone) { // if the device responds with being already installed - the function defaults
      return false;
    }

    let today = moment().toDate(); // fetches todays date
    let lastPrompt = moment(localStorage.getItem("installPrompt")); // tries to fetch installPrompt from localStorage
    let days = moment(today).diff(lastPrompt, "days"); // checks days between lastPrompt and today

    let isApple = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    let prompt = (isNaN(days) || days > 30) && isApple;

    if (isApple && "localStorage" in window) {
      localStorage.setItem("installPrompt", today);
    }
    if (prompt) {
      return true
    }
  }

  installPrompt = null;

  installApp = async () => {
    if (!this.installPrompt) { return false }
    console.log("1: Install button pressed:")
    console.log("2: Attempting app install - Will only proceed in Chrome")

    this.installPrompt.prompt();
    console.log("3: Awaiting user feedback")

    let outcome = await this.installPrompt.userChoice;
    outcome.outcome == 'accepted' ? console.log(`4: PWA${outcome.outcome}`) : console.log(`4: PWA ${outcome.outcome}`)

    this.installPrompt = null;
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
    const { isServiceWorkerReady } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        {/* A2HS iOS */}
        {this.iosA2HSPrompt() && <InstallPWA />}
        {/* Prompt when new version is available */}
        {isServiceWorkerReady && <NewUpdateReady />}

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
              installApp={this.installApp}
              user={user}
              userData={userData}
              openSnackbar={this.openSnackbar}
              onSignUpClick={() => this.openDialog('signUpDialog')}
            />

            <br />
            <br />

            <FooterBar
              user={user}
              onSettingsClick={() => this.openDialog('settingsDialog')}
              installApp={this.installApp}
              performingAction={performingAction}
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
    this.updateReadySnackbar();

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

    wb.addEventListener('waiting', () => {
      console.log('Waiting much')
    });
    wb.addEventListener('activated', () => {
      console.log('activated much')
    });
    wb.addEventListener('installed', () => {
      console.log('installed much')
    });

    console.log("Listening for Install prompt");
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.installPrompt = e;
    })

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
