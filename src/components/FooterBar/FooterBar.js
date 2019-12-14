import React from "react";
import Paper from "@material-ui/core/Paper";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { withStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import Box from '@material-ui/core/Box';
import InstallPWA from '../utility/InstallPWA';

const styles = (theme) => ({
  root: {
    background: '#F3F5F2',
    color: "#335236",
    "&$selected": {
      color: "#335236",
    },
  },
  wrapper: {
    // background: 'red'
  },
  selected: {
    fontSize: '0.75rem !important'
  }
});

class FooterBar extends React.Component {
  state = {
    activateIOS: false,
  };


  iOSInstaller = () => {
    const { activateIOS } = this.state;

    this.setState({ activateIOS: !activateIOS })
  }

  render(props) {
    const actionClasses = this.props.classes;
    const { user, installApp, performingAction } = this.props;

    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    return (
      <>
        <Paper>
          <Box display={{ xs: 'block', sm: 'block', md: 'none' }}>
            <BottomNavigation value={0}
              showLabels={true}
              style={{ position: 'fixed', bottom: 0, width: '100%', background: '#F3F5F2', borderTop: '1px solid #335236' }}>

              {!((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true) &&
              <BottomNavigationAction
                classes={actionClasses}
                label="Hent app"
                disabled={performingAction}
                icon={<SystemUpdateIcon />}
                onClick={isIOS ? this.iOSInstaller : installApp}
              />}

              <BottomNavigationAction
                classes={actionClasses}
                style={{ textDecoration: 'line-through', cursor: 'default' }}
                label={"Produkter"}
                icon={<ShoppingBasketIcon />}
              />

              <BottomNavigationAction
                classes={actionClasses}
                style={{ textDecoration: 'line-through', cursor: 'default' }}
                label="Chat"
                icon={<QuestionAnswerIcon />}
              />

              {user && <BottomNavigationAction
                classes={actionClasses}
                label="Indstillinger"
                icon={<SettingsIcon />}
                onClick={this.props.onSettingsClick}
              />}
            </BottomNavigation>
          </Box>
        </Paper>
        {this.state.activateIOS && <InstallPWA />}
      </>
    );
  }
}
export default withStyles(styles)(FooterBar);