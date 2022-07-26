import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";

const GraphModeLayersToggle = ({
  open = false,
  onToggle,
  top = 178,
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
      <Tooltip title="Layers">
        <IconButton
          size="small"
          color={open ? "secondary" : "default"}
          onClick={onToggle}
        >
          <LayersIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default GraphModeLayersToggle;
