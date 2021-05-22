import React, { useEffect } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import FormField from './FormField';

const SliderField = ({ name, ...rest }) => {
  const { register, setValue } = useFormContext();
  useEffect(() => {
    register({ name });
  }, [name, register]);

  const handleChange = (value) => setValue(name, value);
  const styleProps = {
    helperText: {
      mt: 0,
    },
  };
  return (
    <FormField name={name} {...rest} styleProps={styleProps}>
      {({ helperId }) => {
        return (
          <Slider
            color="blue"
            defaultValue={30}
            aria-describedby={helperId}
            onChange={handleChange}
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb />
          </Slider>
        );
      }}
    </FormField>
  );
};

export default SliderField;
