import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ClearIcon from "@mui/icons-material/Clear";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type AutocompleteProps = {
  id: string;
  options?: any;
  disabled?: boolean;
  label?: string;
  handleChange?: any;
  handleclear?: any;
  value?:any
  size?:any
};

export default function CheckboxesTags({
  id,
  options,
  disabled,
  label,
  handleChange,
  handleclear,
  value,
  size
}: AutocompleteProps) {
  return (
    <Autocomplete
      multiple
      fullWidth
      disabled={disabled}
      id={id}
      size={size}
      
      options={options}
      disableCloseOnSelect
      onChange={handleChange}
      value={value} 
      getOptionLabel={(option: any) => option?.name}
      clearIcon={<ClearIcon onClick={handleclear} />}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option?.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} fullWidth size={size} />
      )}
    />
  );
}
