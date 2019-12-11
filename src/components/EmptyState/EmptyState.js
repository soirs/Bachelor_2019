import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const styles = {
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },
  title: {
    fontFamily: 'Dosis, Lato, SansSerif',
    fontWeight: '600'
  }
};

class EmptyState extends Component {
  render() {
    // Styling
    const { classes } = this.props;

    // Properties
    const { icon, title, description, button, a2hsBtn } = this.props;

    return (
      <div className={classes.center}>
        {icon}
        {title && <Typography className={classes.title} color="textSecondary" variant="h4" mt='2'>{title}</Typography>}
        {description && <Typography color="textSecondary" variant="subtitle1" gutterBottom>{description}</Typography>}
        {button}
        <br/>
        {a2hsBtn}
      </div>
    );
  }
}

EmptyState.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Properties
  icon: PropTypes.element,
  title: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.element
};

export default withStyles(styles)(EmptyState);
