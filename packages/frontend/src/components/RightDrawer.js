import React from "react";
import styled from "styled-components/macro";
import {
  Drawer,
  Fab as MuiFab,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography as MuiTypography,
} from "@material-ui/core";
import Tune from "@material-ui/icons/Tune";
import { customSecondary } from "../theme/variants";
import { NavLink } from "react-router-dom";
import DatePicker from "./pickers/DatePicker";
import OptionsPicker from "./pickers/OptionsPicker";

const Fab = styled(MuiFab)`
  position: fixed;
  top: calc(220px);
  right: -200px;
  z-index: 1000;
  padding-right: 100px;
  transition: right 0.25s ease-out 0.25s;

  &:hover {
    right: -90px;
  }
`;

const TuneIcon = styled(Tune)`
  margin-right: 10px;
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)}px;
  padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)`
  background-color: ${(props) => props.theme.sidebar.header.background};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  justify-content: start;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  font-family: ${(props) => props.theme.typography.fontFamily};

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled.img`
  border-radius: 50%;
  margin-right: 16px;
`;

const SidebarSection = styled(MuiTypography)`
  color: ${() => customSecondary[500]};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  display: block;
`;

export function RightDrawer() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((state) => !state);
  };

  return (
    <>
      <Fab color="primary" variant="extended" onClick={toggleDrawer}>
        <TuneIcon />
        Graph Options
      </Fab>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Brand
          component={NavLink}
          to="/"
          button
          style={{
            pointerEvents: "all",
          }}
        >
          <BrandIcon
            src={`/static/img/spwqat-logo-square.png`}
            width="40"
            height="40"
            alt="SPWQAT Icon"
          />
          Graph Options
        </Brand>
        <List disablePadding>
          <Items>
            <RadioGroup
              aria-label="data"
              name="data"
              // value={radioValue}
              // onChange={handleRadioChange}
            >
              <SidebarSection>Data Selection</SidebarSection>

              <ListItem>
                <FormControlLabel
                  value="has_production"
                  control={<Radio />}
                  label="label 1"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  value="has_waterlevels"
                  control={<Radio />}
                  label="label 2"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  value="has_wqdata"
                  control={<Radio />}
                  label="label 3"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="label 4"
                />
              </ListItem>
            </RadioGroup>
            <SidebarSection>Date Range</SidebarSection>
            <ListItem>
              <DatePicker
                label="Select Start Date"
                name="startDate"
                // selectedDate={filterValues.startDate}
                setSelectedDate={() => {}}
                // checked={filterValues.checked}
              />
            </ListItem>
            <ListItem>
              <DatePicker
                label="Select End Date"
                name="endDate"
                // selectedDate={filterValues.endDate}
                setSelectedDate={() => {}}
                // checked={filterValues.checked}
              />
            </ListItem>

            <SidebarSection>Parameters</SidebarSection>
            <ListItem>
              <OptionsPicker
                selectedOption={{ label: "one", value: 1 }}
                options={[
                  { label: "one", value: 1 },
                  { label: "two", value: 2 },
                  { label: "three", value: 3 },
                ]}
                label="Water Quality Parameters"
                setSelectedOption={() => {}}
              />
            </ListItem>
          </Items>
        </List>
      </Drawer>
    </>
  );
}
