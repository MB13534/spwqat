import React, { useState } from "react";
import {
  Box,
  Card,
  Collapse,
  Icon,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography as MuiTypography,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import styled, { keyframes } from "styled-components";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";
import IconButton from "@material-ui/core/IconButton";
import { Close, Room } from "@material-ui/icons";
import ExpandButton from "../../../components/graphs/ExpandButton";
import Loader from "../../../components/Loader";
import BenchmarkPopover from "./BenchmarkPopover";
import { makeStyles } from "@material-ui/core/styles";
import { dateFormatter } from "../../../utils";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertTitle } from "@material-ui/lab";

const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 0;
  }

  to {
    transform: scale(.25);
    opacity: 1;
  }
`;

const OuterContainer = styled(Box)`
  margin-left: 49px;
  bottom: 48px;
  z-index: 3;
  position: absolute;
  max-height: 100%;
  width: calc(100% - 49px - 49px);
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  animation: ${({ open }) => (open ? fadeIn : fadeOut)} 0.5s linear;
  transition: visibility 0.5s linear;
`;

const Viz = styled.div`
  height: ${({ height }) => height};
  max-width: 100%;
`;

const GraphTooltip = styled.div`
  background-color: white;
  padding: 10px;
  border: 1px solid rgb(204, 204, 204);
`;

const TimeseriesContainer = styled.div`
  height: calc(${({ height }) => height} - 146px);
  width: 100%;
`;
const CircleMarker = styled.div`
  text-align: center;
  border-radius: 50%;
  color: white;
  background-color: ${({ theme }) => theme.palette.primary.main};
  width: 50px;
  height: 50px;
  line-height: 66px;
  margin-right: 13px;
`;

const CloseContainer = styled.div`
  // position: absolute;
  display: flex;
  justify-content: end;
  margin-top: 5px;
  margin-right: 5px;
  margin-bottom: -10px;
`;
const BenchmarkCircle = styled.div`
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  margin: auto;
  color: white;
  line-height: 45px;
  border: black solid 2px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

// const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      stroke="purple"
      strokeWidth={3}
      fill={payload.nondetect ? "transparent" : "purple"}
    />
  );
};

const DataViz = ({
  open = false,
  onClose,
  analyticsResults = [],
  timeSeriesResults = {},
  filterValues,
  isTimeSeriesResultsLoading,
  getHexColorForScore,
  isAnalyticsTableDataLoading,
  lastLocationIdClicked,
}) => {
  const [dataVizHeight, setDataVizHeight] = useState({
    viz: "460px",
    timeSeries: "500px",
    chart: 250,
  });

  const handleExpand = () => {
    let newState = { ...dataVizHeight };
    if (newState.viz === "460px" && newState.timeSeries === "500px") {
      newState.viz = "70vh";
      newState.timeSeries = "100%";
      newState.chart = 500;
    } else {
      newState.viz = "460px";
      newState.timeSeries = "500px";
      newState.chart = 250;
    }
    setDataVizHeight(newState);
  };

  const useRowStyles = makeStyles((theme) => ({
    popover: {
      pointerEvents: "none",
      borderRadius: 4,
    },
    paper: {
      backgroundColor: "transparent",
    },
  }));

  function TimeSeriesGraphRow({ row }) {
    const lineData = timeSeriesResults?.line[row.parameter] ?? [];
    const barData = timeSeriesResults?.bar[row.parameter] ?? [];

    const classes = useRowStyles();
    const [open, setOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    const formatStatistic = (row) => {
      if (filterValues.analysis === "benchmark_scale_pctile85") {
        return row.pctile85;
      } else {
        return row.median;
      }
    };

    const formatValue = (row) => {
      if (filterValues.analysis === "benchmark_scale_pctile85") {
        return (
          <BenchmarkCircle
            backgroundColor={getHexColorForScore(row.benchmark_scale_pctile85)}
          />
        );
      } else {
        return (
          <BenchmarkCircle
            backgroundColor={getHexColorForScore(row.benchmark_scale_median)}
          />
        );
      }
    };

    const setTrendIcon = (trend) => {
      const val = trend ? trend.toLowerCase() : "";
      if (val === "no trend") {
        return `swap_vert`;
      } else if (val.includes(`increasing`)) {
        return `arrow_upward`;
      } else if (val.includes(`decreasing`)) {
        return `arrow_downward`;
      } else if (val === "stable") {
        return `trending_flat`;
      } else {
        return "not_interested";
      }
    };

    const dateToInt = (data) => {
      return data.map(({ ...el }) => {
        el.collect_date = new Date(el.collect_date).getTime();
        return el;
      });
    };

    function CustomDailyTooltip({ payload, active }) {
      if (active) {
        const item = payload[0].payload;
        return (
          <GraphTooltip>
            <Typography variant="h4">{`Site : ${item.location_id}`}</Typography>
            <Typography variant="body2">{`Date : ${dateFormatter(
              item.collect_date,
              "MM-DD-YYYY"
            )}`}</Typography>
            <Typography variant="body2">{`Organization : ${item.organization}`}</Typography>
            <Typography variant="body2">{`Value : ${item.result} ${item.units}`}</Typography>
          </GraphTooltip>
        );
      }
      return null;
    }

    function CustomAnnualTooltip({ payload, active }) {
      if (active) {
        const item = payload[0].payload;
        return (
          <GraphTooltip>
            <Typography variant="h4">{`Site : ${item.location_id}`}</Typography>
            <Typography variant="body2">{`Year : ${item.collect_year}`}</Typography>
            <Typography variant="body2">{`Median : ${item.result_median} ${item.units}`}</Typography>
            <Typography variant="body2">{`85th Percentile : ${item.result_pctile85} ${item.units}`}</Typography>
          </GraphTooltip>
        );
      }
      return null;
    }

    return (
      typeof timeSeriesResults !== "undefined" && (
        <React.Fragment>
          <TableRow>
            <TableCell component="th" scope="row">
              {row.parameter}
            </TableCell>
            <TableCell align="center">
              {formatStatistic(row)} {row.units}
            </TableCell>
            <TableCell align="center">
              <div
                aria-owns={openPopover ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{
                  cursor: isTimeSeriesResultsLoading ? "default" : "pointer",
                }}
              >
                {formatValue(row)}
              </div>
            </TableCell>
            <Popover
              disableAutoFocus
              disableEnforceFocus
              id="mouse-over-popover"
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={openPopover}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              // disableRestoreFocus
            >
              {!isTimeSeriesResultsLoading &&
                (Object.keys(timeSeriesResults?.line)?.length > 0 ||
                  Object.keys(timeSeriesResults?.bar)?.length > 0) && (
                  <BenchmarkPopover
                    data={lineData[0] ?? barData[0] ?? {}}
                    lowIsBad={row.low_is_bad}
                  />
                )}
            </Popover>
            <TableCell align="center">
              <Icon>{setTrendIcon(row.trend)}</Icon>
              <br />
              {row.trend === "No Current Trend" ? "NA" : row.trend}
            </TableCell>
            <TableCell align="center">{row.recordcount}</TableCell>
            <TableCell align="center">{`${dateFormatter(
              row.por_start,
              "MM-DD-YYYY"
            )} - ${dateFormatter(row.por_end, "MM-DD-YYYY")}`}</TableCell>
            <TableCell align="center">{row.organization_name}</TableCell>
            <TableCell align={"right"}>
              {isTimeSeriesResultsLoading ? (
                <Loader />
              ) : (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </TableCell>
          </TableRow>
          {!isTimeSeriesResultsLoading && (
            <TableRow style={{ backgroundColor: "#eee" }}>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={8}
              >
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Card style={{ margin: "12px" }}>
                    {Object.keys(timeSeriesResults?.line)?.length > 0 ? (
                      <>
                        <Typography variant="h3" align="center" mt={2}>
                          Daily Time Series
                        </Typography>
                        <ResponsiveContainer height={dataVizHeight.chart}>
                          <LineChart
                            margin={{
                              top: 25,
                              right: 75,
                              bottom: 25,
                              left: 75,
                            }}
                            data={dateToInt(lineData)}
                          >
                            <RechartsTooltip content={<CustomDailyTooltip />} />
                            <ReferenceArea
                              y1={row.low_is_bad ? lineData[0]?.bmk_line4 : 0}
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color4
                                  : lineData[0]?.bmk_color0 || "#EEEEEE"
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line3
                                  : lineData[0]?.bmk_line0
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color3
                                  : lineData[0]?.bmk_color1
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line2
                                  : lineData[0]?.bmk_line1
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color2
                                  : lineData[0]?.bmk_color2
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line1
                                  : lineData[0]?.bmk_line2
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color1
                                  : lineData[0]?.bmk_color3
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line0
                                  : lineData[0]?.bmk_line3
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color0
                                  : lineData[0]?.bmk_color4
                              }
                              fillOpacity={1}
                            />

                            <CartesianGrid
                              strokeDasharray="1 6"
                              stroke="white"
                            />

                            {/*this line is just responsible for adding info to the*/}
                            {/*tooltip without having to create a custom tooltip*/}
                            {/*//TODO mjb organization glitches the graph for some*/}
                            {/*reason*/}
                            {/*<Line*/}
                            {/*  dataKey="organization"*/}
                            {/*  stroke="black"*/}
                            {/*  name="Organization"*/}
                            {/*/>*/}
                            <Line
                              type="monotone"
                              dataKey="result"
                              stroke="none"
                              name="Value"
                              isAnimationActive={false}
                              dot={<CustomizedDot />}
                            />
                            <ReferenceLine
                              y={formatStatistic(row)}
                              stroke="black"
                              strokeWidth={3}
                              strokeDasharray="9 9"
                            >
                              <Label
                                value={`${
                                  filterValues.analysis ===
                                  "benchmark_scale_median"
                                    ? "Median"
                                    : "85th Percentile"
                                }: ${formatStatistic(row)} ${row.units}`}
                                position="insideBottomRight"
                                stroke="black"
                              />
                            </ReferenceLine>
                            <XAxis
                              dataKey="collect_date"
                              type="number"
                              // minTickGap={25}
                              domain={["auto", "auto"]}
                              tickFormatter={(unixTime) =>
                                dateFormatter(unixTime, "MM-DD-YYYY")
                              }
                            />
                            <YAxis
                              label={{
                                value: `${row.parameter} (${row.units})`,
                                angle: -90,
                                position: "insideBottomLeft",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        <strong>
                          **There is no daily data available for these
                          filters.** —
                        </strong>
                        please try again!
                      </Alert>
                    )}
                  </Card>

                  <Card style={{ margin: "12px" }}>
                    {Object.keys(timeSeriesResults?.bar)?.length > 0 ? (
                      <>
                        <Typography variant="h3" align="center" mt={2}>
                          Annual Time Series
                        </Typography>
                        <ResponsiveContainer height={dataVizHeight.chart}>
                          <BarChart
                            // barGap={10}
                            barSize={50}
                            margin={{
                              top: 25,
                              right: 75,
                              bottom: 25,
                              left: 75,
                            }}
                            data={barData}
                          >
                            <RechartsTooltip
                              content={<CustomAnnualTooltip />}
                            />
                            <ReferenceArea
                              y1={row.low_is_bad ? lineData[0]?.bmk_line4 : 0}
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color4
                                  : lineData[0]?.bmk_color0 || "#EEEEEE"
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line3
                                  : lineData[0]?.bmk_line0
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color3
                                  : lineData[0]?.bmk_color1
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line2
                                  : lineData[0]?.bmk_line1
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color2
                                  : lineData[0]?.bmk_color2
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line1
                                  : lineData[0]?.bmk_line2
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color1
                                  : lineData[0]?.bmk_color3
                              }
                              fillOpacity={1}
                            />
                            <ReferenceArea
                              y1={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_line0
                                  : lineData[0]?.bmk_line3
                              }
                              fill={
                                row.low_is_bad
                                  ? lineData[0]?.bmk_color0
                                  : lineData[0]?.bmk_color4
                              }
                              fillOpacity={1}
                            />

                            <CartesianGrid
                              strokeDasharray="1 6"
                              stroke="white"
                            />
                            <Legend />
                            <Bar
                              type="monotone"
                              dataKey="result_median"
                              name={"Median"}
                              fill="#8884d8"
                              isAnimationActive={false}
                              // barSize={35}
                              // maxBarSize={50}
                              // barGap={10}
                            />

                            <Bar
                              type="monotone"
                              dataKey="result_pctile85"
                              name={"85th percentile"}
                              fill="#A5A5A5"
                              isAnimationActive={false}
                              // barSize={35}
                              // maxBarSize={50}
                              // barGap={10}
                            />

                            <ReferenceLine
                              y={formatStatistic(row)}
                              stroke="black"
                              strokeWidth={3}
                              strokeDasharray="9 9"
                            >
                              <Label
                                value={`${
                                  filterValues.analysis ===
                                  "benchmark_scale_median"
                                    ? "Median"
                                    : "85th Percentile"
                                }: ${formatStatistic(row)} ${row.units}`}
                                position="insideBottomRight"
                                stroke="black"
                              />
                            </ReferenceLine>

                            <XAxis dataKey="collect_year" />

                            <YAxis
                              label={{
                                value: `${row.parameter} (${row.units})`,
                                angle: -90,
                                position: "insideBottomLeft",
                              }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        <strong>
                          **There is no annual data available for these
                          filters.** —
                        </strong>
                        please try again!
                      </Alert>
                    )}
                  </Card>
                </Collapse>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      )
    );
  }

  return (
    <OuterContainer
      bgcolor="#ffffff"
      boxShadow="0 0 0 2px rgba(0,0,0,.1)"
      borderRadius={4}
      open={open}
    >
      {analyticsResults?.length > 0 && lastLocationIdClicked ? (
        <Viz height={dataVizHeight.viz}>
          <CloseContainer>
            <ExpandButton
              handleExpand={handleExpand}
              expanded={dataVizHeight.viz !== "460px"}
            />
            <Tooltip title="Close" arrow>
              <IconButton
                size="small"
                onClick={onClose}
                style={{ marginLeft: "4px" }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </CloseContainer>

          <Panel overflowY="scroll" overflowX="hidden">
            {isAnalyticsTableDataLoading && <Loader />}
            <Paper>
              <TimeseriesContainer height={dataVizHeight.timeSeries}>
                <Box ml={4} pt={2} pb={2} display="flex">
                  <CircleMarker>
                    <Room />
                  </CircleMarker>
                  <Box flexDirection="column" display="flex">
                    <Typography variant="h4">
                      <strong>{`${analyticsResults[0].location_name} (${analyticsResults[0].location_id})`}</strong>
                    </Typography>
                    <Typography variant="h4">
                      {analyticsResults[0].reach_name}
                    </Typography>
                  </Box>
                </Box>

                <TableContainer
                  style={{
                    overflowY: "scroll",
                    height: "100%",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 600 }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          {filterValues.analysis === "benchmark_scale_median"
                            ? "Median"
                            : "85th Percentile"}
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Benchmarks
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Trend
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Count
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Period of Record
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Organizations
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="center">
                          Visualizations
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {analyticsResults
                        .sort((a, b) =>
                          a[filterValues.analysis] < b[filterValues.analysis]
                            ? 1
                            : b[filterValues.analysis] <
                              a[filterValues.analysis]
                            ? -1
                            : 0
                        )
                        .map((row) => {
                          return (
                            <TimeSeriesGraphRow row={row} key={row.parameter} />
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TimeseriesContainer>
            </Paper>
          </Panel>
        </Viz>
      ) : (!lastLocationIdClicked && analyticsResults?.length > 0) ||
        !lastLocationIdClicked ? (
        <Alert severity="info" style={{ marginBottom: "-18px" }}>
          <AlertTitle>Info</AlertTitle>
          <strong>Please select a monitoring location on the map above.</strong>
        </Alert>
      ) : (
        <Alert severity="error" style={{ marginBottom: "-18px" }}>
          <AlertTitle>Error</AlertTitle>
          <strong>**There is no data available with this query.** — </strong>
          please try again!
        </Alert>
      )}
    </OuterContainer>
  );
};

export default DataViz;
