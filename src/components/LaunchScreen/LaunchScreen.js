import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Logo from '../Assets/digital_revisor_logo_black.svg'
import FillFormSvg from '../Assets/fill_form.svg'

class LaunchScreen extends Component {
  render() {

    const wrapperStyle = {
      display: 'flex',
      flexDirection: 'column',
    }
    const imgStyle = {
      opacity: '40%',
      minWidth: '10%',
      maxWidth: '80%',
      maxHeight: '15vh',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
    }
    const spinnerStyle = {
      margin: '5vh auto 0 auto',
      minWidth: '20%',
      maxWidth: '40%',
      opacity: '80%'
    }

    return (
      <>
        <Box position="absolute" top="5%" left="50%" marginLeft='-10%' width='20%'>
          <img src={Logo} alt='DR LOGO' style={imgStyle} />
        </Box>

        <Box position="absolute" top="25%" left="50%" marginLeft='-30%' width='60%' style={wrapperStyle}>
          <CircularProgress size='10%' color='secondary' style={spinnerStyle} />
        </Box>

        <Box position="absolute" bottom="5%" left="50%" marginLeft='-30%' width='60%'>
          <img src={FillFormSvg} alt='fill_form' style={imgStyle} />
        </Box>

      </>
    );
  }
}

export default LaunchScreen;
