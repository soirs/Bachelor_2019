import React, { Component } from 'react';

import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import PersonIcon from '@material-ui/icons/Person';

import authentication from '../../services/authentication';
import Logo from '../Assets/digital_revisor_logo_white.svg'

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null
      }
    };
  }

  getAvatar = () => {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    const photoUrl = user.photoURL;

    if (photoUrl) {
      return (<Avatar alt="Avatar" src={photoUrl} />);
    }

    const { userData } = this.props;

    if (!userData) {
      return <PersonIcon />;
    }

    const nameInitials = authentication.user.getNameInitials({
      ...user,
      ...userData
    });

    if (nameInitials) {
      return <Avatar alt="Avatar">{nameInitials}</Avatar>;
    }

    return <PersonIcon />;
  };

  openMenu = (event) => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl
      }
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null
      }
    });
  };

  handleSettingsClick = () => {
    this.closeMenu();
    this.props.onSettingsClick();
  };

  handleSignOutClick = () => {
    this.closeMenu();
    this.props.onSignOutClick();
  };

  render() {
    // Properties
    const { performingAction, user } = this.props;

    // Events
    const {
      onSignInClick
    } = this.props;

    const imgStyle = {
      // maxWidth: '100px',
      // textAlign: 'center',
      maxHeight: '45px',
      cursor: 'pointer'
    };

    const barStyle = {
      background: '#1b1c1d',
    };
    const boxStyle = {
      maxHeight: '45px'
    };
    const { menu } = this.state;

    return (
      <AppBar color="primary" style={barStyle} position="static">
        <Toolbar variant="regular">
        <img src={Logo} alt='DR LOGO' style={imgStyle} />
          <Box display="flex" flexGrow={1} style={boxStyle}>
          </Box>

          {user &&
            <>
              <IconButton color="inherit" disabled={performingAction} onClick={this.openMenu}>
                {this.getAvatar()}
              </IconButton>

              <Menu anchorEl={menu.anchorEl} open={Boolean(menu.anchorEl)} onClose={this.closeMenu}>
                <MenuItem disabled={performingAction} onClick={this.handleSettingsClick}>Indstillinger</MenuItem>
                <MenuItem disabled={performingAction} onClick={this.handleSignOutClick}>Log ud</MenuItem>
              </Menu>
            </>
          }

          {!user &&
            <>
              {/* <Box mr={1}>
                <Button color="secondary" disabled={performingAction} variant="contained" onClick={onSignUpClick}>Opret bruger</Button>
              </Box> */}

              <Button color="secondary" disabled={performingAction} variant="contained" onClick={onSignInClick}>Log ind</Button>
            </>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

Bar.defaultProps = {
  performingAction: false
};

Bar.propTypes = {
  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  // onTitleClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired
};

export default Bar;
