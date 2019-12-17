import React, { useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import debounce from 'lodash.debounce';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 12,
    label: '12',
  },
];
function valuetext(value) {
  return `${value}`;
}

export default function Questions(props) {
  const { sliderValue, sliderChange, formValue, formChange, userData } = props;
  // eslint-disable-next-line no-unused-vars
  const [sliderStateValue, setSliderValue] = useState();
  // eslint-disable-next-line no-unused-vars
  const [radioFormValue, setFormValue] = useState();

  const debounceSlider = useCallback(debounce(sliderChange, 800), [])
  const debounceForm = useCallback(debounce(formChange, 800), [])

  const handleSliderChange = (e, newValue) => {
    setSliderValue(newValue);
    debounceSlider(newValue);
  };
  const handleFormChange = (e, newValue) => {
    setFormValue(newValue);
    debounceForm(newValue);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Din bolig
      </Typography>
      <Box m={1}>
        <Typography>
          Vælg antal måneder din bolig har haft anvendelse til udlejning i 2019:
    </Typography>
        <Slider
          p={1}
          required
          defaultValue={userData.sliderValue || sliderValue}
          // value={sliderStateValue}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-always"
          step={1}
          min={0}
          max={12}
          marks={marks}
          valueLabelDisplay="on"
          onChange={handleSliderChange}
        />
        <Typography>
          Har du solgt boligen i år?
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            required
            defaultValue={userData.formValue || formValue}
            aria-label="sold"
            name="sold"
            // value={formValue}
            onChange={handleFormChange}>
            <FormControlLabel value="true" control={<Radio />} label="Ja" />
            <FormControlLabel value="false" control={<Radio />} label="Nej" />
          </RadioGroup>
        </FormControl>
      </Box>
    </React.Fragment>
  );
}