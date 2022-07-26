import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Box,
  Paper,
  Typography,
} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import ExpandMore from "@material-ui/icons/ExpandMore";
import styled from "styled-components/macro";
import ParametersControl from "../parametersControl";

const Container = styled(Paper)`
  background: none;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  left: 49px;
  position: absolute;
  top: 10px;
  max-height: calc(100% - 32px);
  overflow-x: hidden;
  overflow-y: hidden;
  width: 300px;
  z-index: 3;
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  // max-height: 487px;
  max-height: 60vh;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
`;

const GraphModeControl = (props) => {
  const [expandedItem, setExpandedItem] = useState("parameters");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedItem(isExpanded ? panel : false);
  };

  return (
    <Container>
      <Accordion
        expanded={expandedItem === "parameters"}
        onChange={handleChange("parameters")}
      >
        <AccordionSummary
          aria-controls="parameters-content"
          id="parameters-header"
          expandIcon={<ExpandMore />}
        >
          <Box alignItems="center" display="flex" gridColumnGap={8}>
            <BuildIcon />
            <Typography variant="subtitle1">Parameters</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <ParametersControl props={props} />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default GraphModeControl;
