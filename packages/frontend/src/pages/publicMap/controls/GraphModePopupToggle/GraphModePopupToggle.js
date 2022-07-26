import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import PopupIcon from "@material-ui/icons/Chat";

const GraphModePopupToggle = ({
  open = false,
  onToggle,
  top = 218,
  right = 10,
}) => {
  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      position="absolute"
      zIndex={1}
      top={top}
      right={right}
      display="flex"
      flexDirection="column"
    >
      <Tooltip title="Popups">
        <IconButton
          size="small"
          color={open ? "secondary" : "default"}
          onClick={onToggle}
        >
          <PopupIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default GraphModePopupToggle;
