import React, { useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import debounce from 'lodash.debounce';

export default function BasicInfo(props) {
  const { estateValue, estateChange, improvementValue, improvementChange, userData } = props;
  
  // eslint-disable-next-line no-unused-vars
  const [estateStateValue, setEstateValue] = useState();
  // eslint-disable-next-line no-unused-vars
  const [improvementStateValue, setImprovementValue] = useState();

const debounceEstate = useCallback(debounce(estateChange, 2000), [])
const debounceImprovement = useCallback(debounce(improvementChange, 2000), [])

  const handleEstateChange = (e, newValue) => {
    setEstateValue(newValue);
    debounceEstate(newValue)
    // estateChange(newValue);
  };
  const handleImprovementChange = (e, newValue) => {
    setImprovementValue(newValue);
    debounceImprovement(newValue)
    // improvementChange(newValue);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Grundlæggende informationer
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CurrencyTextField
            allowDecimalPadding={false}
            autoComplete='off'
            currencySymbol="kr"
            decimalCharacter=","
            defaultValue={userData.estateValue || estateValue}
            digitGroupSeparator="."
            fullWidth
            id="estate"
            inputmode='decimal'
            label="Anskaffelses sum:"
            minimumValue="0"
            modifyValueOnWheel={false}
            name="estate"
            onChange={handleEstateChange}
            outputFormat="string"
            required
            value={estateValue}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyTextField
            allowDecimalPadding={false}
            autoComplete='off'
            currencySymbol="kr"
            decimalCharacter=","
            defaultValue={userData.improvementValue || improvementValue}
            digitGroupSeparator="."
            fullWidth
            id="basic2"
            inputmode='decimal'
            label="Forbedringer frem til indkomstårets start"
            minimumValue="0"
            modifyValueOnWheel={false}
            name="baisc2"
            onChange={handleImprovementChange}
            outputFormat="string"
            required
            value={improvementValue}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}