import React, { useEffect } from 'react';
import { RadioButtonConfig } from './RadioButtonConfig.interface';

const RadioButton = (props: { config: RadioButtonConfig; checked: boolean }) => {
  useEffect(() => {
    console.log(props.config.value);
  }, [props.config.value]);

  return (
    <div key={props.config.name} className="flex items-center">
      <input
        id={props.config.value}
        name={props.config.name}
        type={props.config.type}
        value={props.config.value}
        checked={props.checked}
        onChange={props.config.onChange}
        className="focus:ring-green h-4 w-4 text-green border-gray-300"
      />
      <label
        htmlFor={props.config.value}
        className="ml-2 block text-normal font-medium text-gray-800"
      >
        {props.config.label}
      </label>
    </div>
  );
};

export default RadioButton;
