import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import GraphIcon from "@material-ui/icons/List";

const DataVizControl = ({ open = false, handleClick }) => {
  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      position="absolute"
      zIndex={1}
      top={98}
      right={10}
      display="flex"
      flexDirection="column"
    >
      <Tooltip title="Detailed Results">
        <IconButton
          size="small"
          color={open ? "secondary" : "default"}
          onClick={handleClick}
        >
          <GraphIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default DataVizControl;
