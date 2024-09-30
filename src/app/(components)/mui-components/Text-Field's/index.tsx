import React from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TextFieldProps } from "@mui/material";

interface CustomTextFieldProps {
  type?: "email" | "text" | "search";
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: any;
  name?: any;
  value?: string;
  defaultValue?: any;
  select?: any;
  selectData?: any;
  disabled?: boolean;
  field?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  type,
  label,
  placeholder,
  error,
  helperText,
  name,
  value,
  select,
  onChange,
  defaultValue,
  selectData,
  disabled,
  field,
  ...restProps
}) => {
  return (
    <Stack>
      <TextField
        {...restProps}
        name={name}
        label={label}
        error={error}
        value={value}
        type={field}
        select={!!select}
        defaultValue={defaultValue}
        variant="outlined"
        placeholder={placeholder}
        helperText={helperText}
        onChange={onChange}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        sx={{
          borderRadius: "8px",
          mb: 3,
        }}
        InputProps={
          type
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    {type === "email" && (
                      <MdOutlineMailOutline fontSize="medium" />
                    )}
                    {type === "search" && <FaMagnifyingGlass />}
                  </InputAdornment>
                ),
              }
            : {}
        }
      >
        {" "}
        {select && selectData?.length > 0 ? (
          selectData?.map((option: any) => (
            <MenuItem
              key={option?._id}
              value={option?.shift}
              sx={{ fontSize: "12px" }}
            >
              {option?.shiftName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            <Typography>{"No data"}</Typography>
          </MenuItem>
        )}
      </TextField>
    </Stack>
  );
};

export default CustomTextField;
