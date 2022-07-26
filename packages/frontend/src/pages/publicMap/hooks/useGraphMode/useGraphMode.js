import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import useFetchData from "../../../../hooks/useFetchData";
import { groupByValue } from "../../../../utils";
import { styleValues } from "../useLayerStyles/useLayerStyles";
import { titleize } from "inflected";

const useGraphMode = ({
  map,
  updateLayerFilters,
  updateLayerStyles,
  filterValues,
  layers,
  lastLocationIdClicked,
  setLastLocationIdClicked,
  setDataVizVisible,
  graphModeVisible,
  setGraphModeVisible,
}) => {
  const [legendVisible, setLegendVisible] = useState(true);
  const [lastLocationId, setLastLocationId] = useState(null);
  const [inputValue, setInputValue] = useState(0);

  const initFilterValues = {
    periodOfRecord: "full",
    analysis: "benchmark_scale_median",
    parameterGroups: [
      "CECs",
      "Chemistry/Physical",
      "Metals/Ions",
      "Nutrients",
      "Pathogens",
      "Solids",
    ],
    parameters: ["Ecoli"],
    recordCount: 0,
  };
  const [filterValuesGraphMode, setFilterValuesGraphMode] =
    useState(initFilterValues);

  const periodOfRecords = [
    {
      value: "short",
      label: "Recent",
    },
    {
      value: "medium",
      label: "Last 10 Years",
    },
    {
      value: "full",
      label: "Full Period",
    },
  ];
  const analysisTypes = [
    {
      value: "benchmark_scale_median",
      label: "Median",
    },
    {
      value: "benchmark_scale_pctile85",
      label: "85th Percentile",
    },
  ];
  const [parameterGroups, isParameterGroupsLoading] = useFetchData(
    "list-parameter-groups-graph-mode",
    [],
    false
  );

  const [hasParametersLoaded, setHasParametersLoaded] = useState(false);
  const { data: parameters, isFetching: isParametersFetching } = useQuery(
    [
      "list-parameters-graph-mode",
      filterValuesGraphMode.periodOfRecord,
      filterValuesGraphMode.parameterGroups,
      isParameterGroupsLoading,
    ],
    async () => {
      if (!isParameterGroupsLoading) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/list-parameters-graph-mode`,
            {
              periodOfRecord: filterValuesGraphMode.periodOfRecord,
              parameterGroups: filterValuesGraphMode.parameterGroups.map(
                (parameterGroup) => getParameterGroupIndexByName(parameterGroup)
              ),
            }
          );
          return data;
        } catch (err) {
          console.error(err);
        }
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const [benchmarkScaleColors] = useFetchData(
    "list-benchmark-scale-colors",
    [],
    false
  );
  const getHexColorForScore = (score) => {
    return benchmarkScaleColors.find((x) => x.benchmark_scale === score)
      .symbol_color;
  };

  const graphModeBenchmarkColorsDefaults = [
    { name: `Above secondary benchmark`, color: `red` },
    { name: `Above benchmark`, color: `orange` },
    { name: `Approaching benchmark`, color: `yellow` },
    { name: `Below benchmark`, color: `MediumSeaGreen` },
    { name: `Below benchmark`, color: `PaleTurquoise` },
    { name: `No benchmarks available`, color: `cornflowerblue` },
  ];
  const [graphModeBenchmarkColors, setGraphModeBenchmarkColors] = useState(
    graphModeBenchmarkColorsDefaults
  );
  useEffect(() => {
    if (benchmarkScaleColors) {
      setGraphModeBenchmarkColors([
        {
          name: `Above secondary benchmark`,
          color: benchmarkScaleColors[5]?.symbol_color ?? `red`,
        },
        {
          name: `Above benchmark`,
          color: benchmarkScaleColors[4]?.symbol_color ?? `orange`,
        },
        {
          name: `Approaching benchmark`,
          color: benchmarkScaleColors[3]?.symbol_color ?? `yellow`,
        },
        {
          name: `Below benchmark`,
          color: benchmarkScaleColors[2]?.symbol_color ?? `MediumSeaGreen`,
        },
        {
          name: `Below detection limits`,
          color: benchmarkScaleColors[1]?.symbol_color ?? `PaleTurquoise`,
        },
        {
          name: `No benchmarks available`,
          color: benchmarkScaleColors[0]?.symbol_color ?? `cornflowerblue`,
        },
      ]);
    }
  }, [benchmarkScaleColors]);

  const [graphModePopupVisible, setGraphModePopupVisible] = useState(true);
  const [graphModeLayersVisible, setGraphModeLayersVisible] = useState(true);
  const handleGraphModeLayersToggleClick = () => {
    if (graphModeLayersVisible) {
      layers.forEach((layer) => {
        if (
          ["spwqat-locations-circle", "spwqat-locations-symbol"].includes(
            layer.id
          )
        ) {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "visible"
          );
        } else {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "none"
          );
        }
      });
    } else {
      layers.forEach((layer) => {
        if (layer?.layout?.visibility === "visible") {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "visible"
          );
        } else {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "none"
          );
        }
      });
    }
    setGraphModeLayersVisible(!graphModeLayersVisible);
  };

  const handleGraphModeClick = () => {
    if (!graphModeVisible) {
      // layers.forEach((layer) => {
      //   if (
      //     ["spwqat-locations-circle", "spwqat-locations-symbol"].includes(
      //       layer.id
      //     )
      //   ) {
      //     map.setLayoutProperty(
      //       layer?.lreProperties?.name || layer.id,
      //       "visibility",
      //       "visible"
      //     );
      //   } else {
      //     map.setLayoutProperty(
      //       layer?.lreProperties?.name || layer.id,
      //       "visibility",
      //       "none"
      //     );
      //   }
      // });
      setDataVizVisible(true);
      map.setFilter("spwqat-locations-circle", null);
      map.setFilter("spwqat-locations-symbol", null);
    } else {
      map.setFilter("spwqat-locations-circle", null);
      map.setFilter("spwqat-locations-symbol", null);

      updateLayerFilters(filterValues);
      updateLayerStyles(styleValues.default);
      setDataVizVisible(false);

      layers.forEach((layer) => {
        if (layer?.layout?.visibility === "visible") {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "visible"
          );
        } else {
          map.setLayoutProperty(
            layer?.lreProperties?.name || layer.id,
            "visibility",
            "none"
          );
        }
      });
    }
    handleFilterValuesGraphMode("recordCount", 0);
    setInputValue(0);
    setGraphModePopupVisible(true);
    map.fire("closeAllPopups");
    setLastLocationIdClicked(null);
    setLastLocationId(null);
    setGraphModeVisible(!graphModeVisible);
    setGraphModeLayersVisible(true);
  };

  useEffect(() => {
    if (!isParametersFetching && parameters?.length && !hasParametersLoaded) {
      setHasParametersLoaded(true);
      onSelectAllParameters();
    }
  }, [isParametersFetching, parameters]); //eslint-disable-line

  useEffect(() => {
    if (hasParametersLoaded) {
      setFilterValuesGraphMode((prevState) => {
        return {
          ...prevState,
          parameters: cleanParams(filterValuesGraphMode.parameters),
        };
      });
    }
  }, [parameters]); //eslint-disable-line

  useEffect(() => {
    if (hasParametersLoaded) {
      setFilterValuesGraphMode((prevState) => {
        return {
          ...prevState,
          parameterGroups: cleanParamGroups(
            filterValuesGraphMode.parameterGroups
          ),
        };
      });
    }
  }, [parameterGroups]); //eslint-disable-line

  const [hasGraphDataLoaded, setHasGraphDataLoaded] = useState(false);
  const [isAnalyticsTableDataLoading, setIsAnalyticsTableDataLoading] =
    useState(false);
  const { data } = useQuery(
    [
      "locations-map-graph-mode",
      filterValuesGraphMode.periodOfRecord,
      filterValuesGraphMode.recordCount,
      filterValuesGraphMode.parameters,
      hasParametersLoaded,
    ],
    async () => {
      if (hasParametersLoaded) {
        setIsAnalyticsTableDataLoading(true);
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/locations-map-graph-mode`,
            {
              periodOfRecord: filterValuesGraphMode.periodOfRecord,
              recordCount: filterValuesGraphMode.recordCount,
              parameters: filterValuesGraphMode.parameters.map((parameter) =>
                getParameterIndexByName(parameter)
              ),
            }
          );

          setHasGraphDataLoaded(true);
          return data;
        } catch (err) {
          console.error(err);
        }
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (graphModeVisible) {
      setIsAnalyticsTableDataLoading(false);
      recolorPointsForLayers(data);
      fetchAnalyticsTableForLocation();
      fetchAnalyticsTimeSeriesForLocation();
    }
  }, [graphModeVisible, data]); //eslint-disable-line

  useEffect(() => {
    if (graphModeVisible) {
      recolorPointsForLayers(data);
    }
  }, [filterValuesGraphMode.analysis]); //eslint-disable-line

  const recolorPointsForLayers = (data = null) => {
    const layerIds = ["spwqat-locations-circle"];

    // sort by location_index ascending
    data.sort((a, b) => (a.ndx > b.ndx ? 1 : b.ndx > a.ndx ? -1 : 0));

    const colorData = [];
    const locationValues = {};

    data.forEach((row) => {
      // set a default score
      if (typeof locationValues[row.ndx] === "undefined") {
        locationValues[row.ndx] = -1;
      }

      if (filterValuesGraphMode.analysis === "benchmark_scale_pctile85") {
        if (row.benchmark_scale_pctile85 > locationValues[row.ndx]) {
          locationValues[row.ndx] = row.benchmark_scale_pctile85;
        }
      } else {
        if (row.benchmark_scale_median > locationValues[row.ndx]) {
          locationValues[row.ndx] = row.benchmark_scale_median;
        }
      }
    });

    for (const [loc_id, score] of Object.entries(locationValues)) {
      colorData.push(parseInt(loc_id));
      colorData.push(getHexColorForScore(score));
    }

    layerIds.forEach((id) => {
      map.setFilter(id, [
        "match",
        ["get", "ndx"],
        Object.keys(locationValues).map((x) => parseInt(x)).length
          ? Object.keys(locationValues).map((x) => parseInt(x))
          : "",
        true,
        false,
      ]);

      map.setFilter(id.replace("circle", "symbol"), [
        "match",
        ["get", "ndx"],
        Object.keys(locationValues).map((x) => parseInt(x)).length
          ? Object.keys(locationValues).map((x) => parseInt(x))
          : "",
        true,
        false,
      ]);

      if (colorData.length) {
        map.setPaintProperty(id, "circle-opacity", 1);
        map.setPaintProperty(id, "circle-stroke-opacity", 1);
        map.setPaintProperty(id, "circle-color", [
          "interpolate",
          ["linear"],
          ["get", "ndx"],
          ...colorData,
        ]);
      }
    });
  };

  const getParameterGroupIndexByName = (name) => {
    let parameterGroup = parameterGroups?.find(
      (x) => x.parameter_group_name === name
    );
    return parameterGroup.parameter_group_ndx;
  };

  const getParameterIndexByName = (name) => {
    let parameter = parameters.find((x) => x.parameter_abbrev === name);
    return parameter?.parameter_ndx || null;
  };

  const cleanParams = (params) => {
    const newParams = [];

    parameters.forEach((x) => {
      if (params.indexOf(x.parameter_abbrev) !== -1) {
        newParams.push(x.parameter_abbrev);
      }
    });

    return newParams;
  };

  const cleanParamGroups = (params) => {
    const newParams = [];

    parameterGroups
      .filter((item) =>
        item.stats_period.includes(filterValuesGraphMode.periodOfRecord)
      )
      .forEach((x) => {
        if (params.indexOf(x.parameter_group_name) !== -1) {
          newParams.push(x.parameter_group_name);
        }
      });

    return newParams;
  };

  const handleFilterValuesGraphMode = (name, value) => {
    if (!["periodOfRecord", "analysis", "recordCount"].includes(name)) {
      setFilterValuesGraphMode((prevState) => {
        const existingVals = [...prevState[name]];
        const existingIndex = existingVals.indexOf(value);
        existingIndex > -1
          ? existingVals.splice(existingIndex, 1)
          : existingVals.push(value);

        return {
          ...prevState,
          [name]: existingVals,
        };
      });
    } else {
      setFilterValuesGraphMode((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  const onSelectAllParameters = () => {
    setFilterValuesGraphMode((prevState) => {
      return {
        ...prevState,
        parameters: parameters.map((x) => x.parameter_abbrev),
      };
    });
  };

  const onSelectNoneParameters = () => {
    setFilterValuesGraphMode((prevState) => {
      return {
        ...prevState,
        parameters: [],
      };
    });
  };

  const onSelectAllParameterGroups = () => {
    setFilterValuesGraphMode((prevState) => {
      return {
        ...prevState,
        parameterGroups: parameterGroups.map((x) => x.parameter_group_name),
      };
    });
  };

  const onSelectNoneParameterGroups = () => {
    setFilterValuesGraphMode((prevState) => {
      return {
        ...prevState,
        parameterGroups: [],
      };
    });
  };

  useEffect(() => {
    if (graphModeVisible !== null) {
      onSelectAllParameters();
      onSelectAllParameterGroups();
    }
  }, [graphModeVisible]); //eslint-disable-line

  const [analyticsResults, setAnalyticsResults] = useState(null);
  const [timeSeriesResults, setTimeSeriesResults] = useState(null);

  function fetchAnalyticsTableForLocation(location_index) {
    if (graphModeVisible) {
      if (!location_index) location_index = lastLocationId;
      if (!location_index) return;
      setAnalyticsResults(
        data.filter(
          (item) =>
            item.stats_period === filterValuesGraphMode.periodOfRecord &&
            item.ndx === location_index
        )
      );
    }
  }

  const [isTimeSeriesResultsLoading, setIsTimeSeriesResultsLoading] =
    useState(false);
  function fetchAnalyticsTimeSeriesForLocation(location_index) {
    setIsTimeSeriesResultsLoading(true);
    if (graphModeVisible) {
      if (!location_index) location_index = lastLocationId;
      if (!location_index) return;

      async function send() {
        try {
          const { data: line } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/ts-daily-table-for-map-display/${location_index}`,
            {
              parameters: cleanParams(filterValuesGraphMode.parameters).map(
                (x) => getParameterIndexByName(x)
              ),
              periodOfRecord: filterValuesGraphMode.periodOfRecord,
            }
          );

          const groupedLineArray = groupByValue(line, "parameter");

          const { data: bar } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/ts-annual-table-for-map-display/${location_index}`,
            {
              parameters: cleanParams(filterValuesGraphMode.parameters).map(
                (x) => getParameterIndexByName(x)
              ),
              periodOfRecord: filterValuesGraphMode.periodOfRecord,
            }
          );

          const groupedBarArray = groupByValue(bar, "parameter");

          // console.log("line", groupedLineArray);
          // console.log("bar", groupedBarArray);

          setTimeSeriesResults({
            line: groupedLineArray,
            bar: groupedBarArray,
          });
        } catch (err) {
          // Is this error because we cancelled it ourselves?
          if (axios.isCancel(err)) {
            console.log(`call was cancelled`);
          } else {
            console.error(err);
          }
        }
      }

      send().then(() => {});
    }
  }

  useEffect(() => {
    setIsTimeSeriesResultsLoading(false);
  }, [timeSeriesResults]);

  useEffect(() => {
    setLastLocationId(lastLocationIdClicked);
    fetchAnalyticsTableForLocation(lastLocationIdClicked);
    fetchAnalyticsTimeSeriesForLocation(lastLocationIdClicked);
  }, [lastLocationIdClicked]); //eslint-disable-line

  const handleExportClick = (index) => {
    if (![2, 3].includes(index)) return;
    async function send() {
      try {
        if (index === 2) {
          let { data: timeseriesData } = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/ts-daily-table-for-map-display`,
            {
              parameters: cleanParams(filterValuesGraphMode.parameters).map(
                (x) => getParameterIndexByName(x)
              ),
              periodOfRecord: filterValuesGraphMode.periodOfRecord,
              indexes: [...new Set(data.map((item) => item.ndx))],
            }
          );

          const timeseriesDataCsvString = [
            [
              `"Results for parameters: ${filterValuesGraphMode.parameters.join(
                ", "
              )}"`,
            ],
            [
              `"Time Series Data for the ${titleize(
                filterValuesGraphMode.periodOfRecord
              )} Period"`,
            ],
            [
              "Location ID",
              "Location Name",
              "Parameter",
              "Activity Date",
              "Data Value",
              "Units",
              // "Source",
              "Organization",
            ],
            ...timeseriesData.map((item) => [
              item.location_id,
              item.location_name.replaceAll(",", "."),
              item.param_abbrev.replaceAll(",", "."),
              item.collect_date,
              item.result,
              item.units,
              // item.source,
              item.organization,
            ]),
          ]
            .map((e) => e.join(","))
            .join("\n");

          const a = document.createElement("a");
          a.href =
            "data:attachment/csv," +
            encodeURIComponent(timeseriesDataCsvString);
          a.target = "_blank";
          a.download = `Time Series Data for the ${titleize(
            filterValuesGraphMode.periodOfRecord
          )} Period.csv`;
          document.body.appendChild(a);
          a.click();
          // return csvString;
        }

        if (index === 3) {
          let tableData = [...data];
          console.log(data);
          console.log(tableData);
          const tableDataCsvString = [
            [
              `"Results for parameters: ${filterValuesGraphMode.parameters.join(
                ", "
              )}"`,
            ],
            [
              `"Stats & Benchmarks Data for the ${titleize(
                filterValuesGraphMode.periodOfRecord
              )} Period"`,
            ],
            [
              "Location ID",
              "Location Name",
              "Parameter",
              "Units",
              "Count of Results (Statistics)",
              "85th or 15th percentile",
              "Benchmark Classification: 85th/15th",
              "Median",
              "Benchamrk Classification: Median",
              "Analysis Period (Statistics)",
              "From",
              "To",
              "Benchmark 0",
              "Benchmark 1",
              "Benchmark 2",
              "Benchmark 3",
              "Benchmark 4",
              "Trend (all data)",
              "Organizations",
            ],
            ...tableData.map((item) => [
              item.location_id,
              item.location_name.replaceAll(",", "."),
              item.parameter.replaceAll(",", "."),
              item.units,
              item.recordcount,
              item.pctile85,
              item.benchmark_scale_pctile85,
              item.median,
              item.benchmark_scale_median,
              item.stats_period,
              item.por_start,
              item.por_end,
              item.bmk_line0,
              item.bmk_line1,
              item.bmk_line2,
              item.bmk_line3,
              item.bmk_line4,
              item.trend,
              item.organization_name.replaceAll(",", "."),
            ]),
          ]
            .map((e) => e.join(","))
            .join("\n");

          const a = document.createElement("a");
          a.href =
            "data:attachment/csv," + encodeURIComponent(tableDataCsvString);
          a.target = "_blank";
          a.download = `Stats & Benchmarks Data for the ${titleize(
            filterValuesGraphMode.periodOfRecord
          )} Period.csv`;
          document.body.appendChild(a);
          a.click();
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }
    send();
  };

  return {
    filterValuesGraphMode,
    periodOfRecords,
    analysisTypes,
    parameterGroups,
    parameters,
    handleFilterValuesGraphMode,
    onSelectAllParameters,
    onSelectNoneParameters,
    onSelectAllParameterGroups,
    onSelectNoneParameterGroups,
    handleGraphModeClick,
    hasGraphDataLoaded,
    analyticsResults,
    timeSeriesResults,
    isTimeSeriesResultsLoading,
    getHexColorForScore,
    isAnalyticsTableDataLoading,
    legendVisible,
    setLegendVisible,
    graphModeBenchmarkColors,
    handleGraphModeLayersToggleClick,
    graphModeLayersVisible,
    graphModePopupVisible,
    setGraphModePopupVisible,
    inputValue,
    setInputValue,
    handleExportClick,
  };
};

export default useGraphMode;
