import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Illustration from '../Assets/documents_illustration.svg'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default function Review(props) {
  const { estateValue, improvementValue, sliderValue, formValue } = props.state;
  const classes = useStyles();

  const formatCurrency = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
  });

  const imgStyle = {
    maxWidth: '20%',
    width: '20%',
    display: 'inherit',
    margin: '0 auto 20px',
  };

  return (
    <React.Fragment>
      <img src={Illustration} alt="" style={imgStyle} />

      <ExpansionPanel className={classes.root}>

        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel"
          id="panel1a-header"
        >

          <Typography className={classes.heading} variant="subtitle1">Du har indtastet følgende:</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography variant='caption' className={classes.root}>
            <Box display={'flex'} mb={1} width="100%">
              <Box flexGrow={1}>Anskaffelses sum:</Box>
              <Box>{formatCurrency.format(estateValue)}</Box>
            </Box>
            <Box display={'flex'} mb={1} width="100%">
              <Box flexGrow={1}>Forbedringer frem til indkomstårets start: </Box>
              <Box>{formatCurrency.format(improvementValue)}</Box>
            </Box>
            <Divider light mb={1} mt={1} />
            <Box display={'flex'} mt={1} mb={1} width="100%">
              <Box flexGrow={1}>Måneders udlejning i 2019:</Box>
              <Box>{sliderValue}</Box>
            </Box>
            <Box display={'flex'} width="100%">
              <Box flexGrow={1}>Bolig køb/salg status:</Box>
              <Box>{formValue === 'false' ? 'Ikke solgt' : 'Du har solgt din bolig i 2019'}</Box>
            </Box>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Typography variant="h5" gutterBottom>
        Indberet følgende på din selvangivelse:
      </Typography>

      <Typography variant='subtitle1'>
        <strong>Rubrik 221</strong>
      </Typography>
      <Typography variant='subtitle2'>
        <Box display={'flex'} m={1}>
          <Box flexGrow={1}>
            Fradrag:
      </Box>
          <Box>24 100 kr</Box>
        </Box>
      </Typography>

      <Divider light />

      <Typography variant='subtitle1'>
        <strong>Rubrik 233</strong>
      </Typography>

      <Typography variant='subtitle2'>
        <Box display={'flex'} m={1}>
          <Box flexGrow={1}>
            Renteudgifter:
      </Box>
          <Box>2.500 kr</Box>
        </Box>
      </Typography>
    </React.Fragment>
  );
}