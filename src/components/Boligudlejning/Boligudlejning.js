import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BasicInfo from './BasicInfo';
import Questions from './Questions';
import Review from './Review';

import authentication from '../../services/authentication';

const styles = (theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(2) * 1)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(2),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

class Boligudlejning extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      setActiveStep: 0,
      estateValue: '',
      improvementValue: '',
      sliderValue: 11,
      formValue: 'false',
    };
  }

  changeField = (fieldId) => {
    switch (fieldId) {
      case 'estateValue':
        this.updateEstate();
        return;
      case 'improvementValue':
        this.updateImprovement();
        return;
      case 'sliderValue':
        this.updateSlider();
        return;
      case 'formValue':
        this.updateForm();
        return;
      default:
        return;
    }
  };
  fieldUpdateHandler = (event, fieldId) => {
    if (!event || !fieldId) {
      return;
    }
    this.changeField(fieldId)
  };


  // UPDATE ESTATE
  // UPDATE ESTATE
  // UPDATE ESTATE
  updateEstate = () => {
    const { estateValue } = this.state;

    this.setState({
      errors: null
    }, () => {
      const { userData } = this.props;

      if (estateValue === userData.estateValue) {
        return;
      }

      this.setState({
        performingAction: true
      }, () => {
        authentication.updateEstate(estateValue).then(() => {
          const { openSnackbar } = this.props;
          openSnackbar('Værdi opdateret');

        }).catch((reason) => {
          console.log('reason :', reason);
          this.props.openSnackbar(reason);
          return;
        }).finally(() => {
          this.setState({
            performingAction: false
          });
        });
      });
    });
  };
  // UPDATE IMPROVEMENT
  // UPDATE IMPROVEMENT
  // UPDATE IMPROVEMENT
  updateImprovement = () => {
    const { improvementValue } = this.state;

    this.setState({
      errors: null
    }, () => {
      const { userData } = this.props;

      if (improvementValue === userData.improvementValue) {
        return;
      }

      this.setState({
        performingAction: true
      }, () => {
        authentication.updateImprovement(improvementValue).then(() => {
          const { openSnackbar } = this.props;
          openSnackbar('Værdi opdateret');

        }).catch((reason) => {
          console.log('reason :', reason);
          this.props.openSnackbar(reason);
          return;
        }).finally(() => {
          this.setState({
            performingAction: false
          });
        });
      });
    });
  };
  // UPDATE SLIDER
  // UPDATE SLIDER
  // UPDATE SLIDER
  updateSlider = () => {
    const { sliderValue } = this.state;

    this.setState({
      errors: null
    }, () => {
      const { userData } = this.props;

      if (sliderValue === userData.sliderValue) {
        return;
      }

      this.setState({
        performingAction: true
      }, () => {
        authentication.updateSlider(sliderValue).then(() => {
          const { openSnackbar } = this.props;
          openSnackbar('Værdi opdateret');

        }).catch((reason) => {
          console.log('reason :', reason);
          this.props.openSnackbar(reason);
          return;
        }).finally(() => {
          this.setState({
            performingAction: false
          });
        });
      });
    });
  };
  // UPDATE FORM
  // UPDATE FORM
  // UPDATE FORM
  updateForm = () => {
    const { formValue } = this.state;

    this.setState({
      errors: null
    }, () => {
      const { userData } = this.props;

      if (formValue === userData.formValue) {
        return;
      }

      this.setState({
        performingAction: true
      }, () => {
        authentication.updateForm(formValue).then(() => {
          const { openSnackbar } = this.props;
          openSnackbar('Værdi opdateret');

        }).catch((reason) => {
          console.log('reason :', reason);
          this.props.openSnackbar(reason);
          return;
        }).finally(() => {
          this.setState({
            performingAction: false
          });
        });
      });
    });
  };



  getStepContent = (step) => {
    const { estateValue, improvementValue, sliderValue, formValue } = this.state;
    switch (step) {
      case 0:
        return <BasicInfo estateValue={estateValue} estateChange={this.estateChange} improvementValue={improvementValue} improvementChange={this.improvementChange} userData={this.props.userData} />;
      case 1:
        return <Questions sliderValue={sliderValue} sliderChange={this.sliderChange} formValue={formValue} formChange={this.formChange} userData={this.props.userData} />;
      case 2:
        return <Review state={this.state} />;
      default:
        throw new Error('Unknown step');
    }
  };

  estateChange = (e) => {
    this.setState({ estateValue: e }, () => this.fieldUpdateHandler(e, 'estateValue'));
  }
  improvementChange = (e) => {
    this.setState({ improvementValue: e }, () => this.fieldUpdateHandler(e, 'improvementValue'));
  }
  sliderChange = (e) => {
    this.setState({ sliderValue: e }, () => this.fieldUpdateHandler(e, 'sliderValue'));
  }
  formChange = (e) => {
    this.setState({ formValue: e }, () => this.fieldUpdateHandler(e, 'formValue'));
  }
  handleNext = () => {
    const { activeStep } = this.state;
    // const { openSnackbar } = this.props;
    this.setState({ activeStep: (activeStep + 1) })
  };
  handleBack = () => {
    const { activeStep } = this.state;
    // const { openSnackbar } = this.props;
    this.setState({ activeStep: (activeStep - 1) })
  };

  render() {
    const { activeStep } = this.state;
    const steps = ['Info', 'Bolig', 'Indberetning'];
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Selvangivelse 2019
            </Typography>

            <Typography color="textSecondary" align="center" variant="subtitle1">Boligudlejning</Typography>

            {/* STEPPER */}
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>


            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                </Typography>

                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {this.getStepContent(activeStep)}
                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button variant="outlined" onClick={this.handleBack} className={classes.button}>
                          Tilbage
                    </Button>
                      )}
                      {activeStep !== steps.length - 1 && <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}

                      >
                        {/* activeStep === steps.length - 1 ? 'Indsend' : 'Næste' */}
                        {'Næste'}
                      </Button>}
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
  componentDidMount() {
    const { userData } = this.props;
    this.setState({ estateValue: userData.estateValue })
    this.setState({ improvementValue: userData.improvementValue })
    this.setState({ sliderValue: userData.sliderValue || 11 })
    this.setState({ formValue: userData.formValue })
  }
}
export default withStyles(styles)(Boligudlejning);
