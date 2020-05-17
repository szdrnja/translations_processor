import React, { FunctionComponent } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

interface IProps {
  title?: string;
  defaultValue?: string;
  options: Array<any>;
}

const RadioButtonGroup: FunctionComponent<IProps> = ({
  title,
  defaultValue,
  options,
}) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup
        aria-label={title}
        name={title}
        value={value}
        onChange={handleChange}
      >
        {options.map((opt, count = 0) => {
          return (
            <FormControlLabel
              value={opt}
              key={count + 1}
              control={<Radio color="default" />}
              label={opt}
              disabled={false}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
