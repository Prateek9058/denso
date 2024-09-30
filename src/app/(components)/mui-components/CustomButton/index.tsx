import { styled, Box, Typography, Button } from "@mui/material";

// Create a styled component from the Button component with specific styles
const CustomPrimaryBtn = styled(Button)(({ theme }) => ({
  backgroundColor: "#28844B",
  borderRadius: "6px",
  color: "white",
}));

// Export CustomAvatar as the default export
export default CustomPrimaryBtn;
