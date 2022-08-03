import React from "react";
import { Box } from "@material-ui/core";
import GraphIcon from "@material-ui/icons/BarChart";
import Button from "@material-ui/core/Button";
import MapIcon from "@material-ui/icons/Map";

const GraphModeToggle = ({ open = false, handleClick }) => {
  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      position="absolute"
      zIndex={1}
      top={58}
      right={10}
      display="flex"
      flexDirection="column"
      width={260}
    >
      <Button
        onClick={handleClick}
        color={open ? "primary" : "secondary"}
        variant="contained"
        size="small"
        startIcon={open ? <MapIcon /> : <GraphIcon />}
      >
        {open ? "Return to Map Explorer" : "Explore in Graph Mode"}
      </Button>
    </Box>
  );
};

export default GraphModeToggle;
