import React, { useRef, useState } from "react";
import styled from "styled-components/macro";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MenuItem, Paper, TextField as MuiTextField } from "@material-ui/core";

import Map from "./map";
import ZoomInfo from "./controls/zoomInfo";
import { useMap } from "./hooks/useMap";
import useFilters from "./hooks/useFilters";

import { INIT_MAP_CONFIG, WELLS_SEARCH_OPTIONS } from "./constants";

import DisclaimerDialog from "./components/DisclaimerDialog";
import MeasurementsPopup from "../../components/map/components/MeasurementsPopup";
import MainControl from "./controls/mainControl/";

import PrintReportDialog from "./components/PrintReportDialog";
import { useReactToPrint } from "react-to-print";
import PrintMapFormat from "./components/PrintMapFormat";
import SplitButton from "../../components/SplitButton";
import MeasurementsControl from "./controls/MeasurementsControl";
import GraphModeToggle from "./controls/graphModeToggle";

import FiltersBar from "./components/FiltersBar";
import FiltersBarGraphMode from "./components/FiltersBarGraphMode";
import GraphModeControl from "./controls/graphModeControl";
import Search from "./filters/search";
import CommaSeparatedWellsSearch from "./filters/commaSeparatedWellsSearch";
import useGraphMode from "./hooks/useGraphMode";
import DataViz from "./components/DataViz";
import DataVizControl from "./controls/dataVizControl";
import Legend from "./components/Legend";
import LegendControl from "./controls/LegendControl";
import GraphModeLayersToggle from "./controls/GraphModeLayersToggle";
import GraphModePopupToggle from "./controls/GraphModePopupToggle";

const FiltersBarRoot = styled(Paper)`
  align-items: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(6)}px;
  padding: 12px 16px 12px 32px;
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)}px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)}px;
  flex: 1 1 0;
`;

const FiltersSectionRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)}px;
  flex-grow: 100;
`;

const TextField = styled(MuiTextField)`
  width: 125px;
  min-width: 125px;
  display: flex;
`;

const PublicMap = () => {
  const mapContainer = useRef(null);
  const {
    activeBasemap,
    basemaps,
    layers,
    map,
    zoomLevel,
    searchRadiusBuffers,
    resetSearchRadiusBuffers,
    handleClearSearchRadiusBuffers,
    handleEnableSearchRadiusControl,
    updateSearchRadiusBuffers,
    updateLayerFilters,
    updateLayerStyles,
    updateLayerVisibility,
    updateLayerOpacity,
    updateBasemap,
    measurementsVisible,
    handleClearMeasurements,
    setMeasurementsVisible,
    polygonRef,
    radiusRef,
    pointRef,
    lineRef,
    measurementsContainerRef,
    eventsRegistered,
    lastLocationIdClicked,
    setLastLocationIdClicked,
    dataVizVisible,
    setDataVizVisible,
    graphModeVisible,
    setGraphModeVisible,
  } = useMap(mapContainer, INIT_MAP_CONFIG);
  const {
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  } = useFilters({ onFilterChange: updateLayerFilters });

  const {
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
  } = useGraphMode({
    map,
    updateLayerFilters,
    updateLayerStyles,
    filterValues,
    layers,
    setDataVizVisible,
    lastLocationIdClicked,
    setLastLocationIdClicked,
    graphModeVisible,
    setGraphModeVisible,
  });

  const printRef = useRef();
  const [printReportDialogOpen, setPrintReportDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const handlePrintMapClick = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSavePNG = () => {
    const a = document.createElement("a");
    a.href = map.getCanvas().toDataURL();
    a.download = "map.png";
    document.body.appendChild(a);
    a.click();
  };

  const splitButtonOptions = [
    "Print PDF",
    "Save PNG",
    "Export Time Series",
    "Export Stats & Benchmarks",
  ];
  const handleSplitButtonClick = (index) => {
    if ([2, 3].includes(index)) {
      handleExportClick(index);
      return;
    }

    if (index === 0) {
      setPrintReportDialogOpen(true);
    } else if (index === 1) {
      handleSavePNG();
    }
  };

  const handleSearchSelect = (result) => {
    map?.flyTo({ center: result?.location_geometry?.coordinates, zoom: 16 });
  };

  return (
    <>
      {process.env.NODE_ENV !== "development" && <DisclaimerDialog />}

      {process.env.NODE_ENV === "development" && (
        <ZoomInfo zoomLevel={zoomLevel} />
      )}

      <FiltersBarRoot>
        <FiltersContainer>
          <TextField
            variant="outlined"
            select
            fullWidth
            size="small"
            label="Search Options"
            value={filterValues?.search?.value}
            onChange={handleFilterValues}
            name="search"
          >
            {WELLS_SEARCH_OPTIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          {filterValues?.search?.value === "attributes_search" && (
            <FiltersSectionRow>
              <Search onSelect={handleSearchSelect} />
            </FiltersSectionRow>
          )}
          {filterValues?.search?.value === "comma_separated_wells_search" && (
            <FiltersSectionRow>
              <CommaSeparatedWellsSearch map={map} />
            </FiltersSectionRow>
          )}
        </FiltersContainer>
        {graphModeVisible ? (
          <FiltersBarGraphMode
            filterValues={filterValuesGraphMode}
            periodOfRecords={periodOfRecords}
            analysisTypes={analysisTypes}
            handleFilterValues={handleFilterValuesGraphMode}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        ) : (
          <FiltersBar
            filterValues={filterValues}
            handleFilterValues={handleFilterValues}
            handleSelectAll={handleSelectAll}
            handleSelectNone={handleSelectNone}
            updateLayerStyles={updateLayerStyles}
          />
        )}
        <FiltersSection>
          <FiltersContainer>
            <>
              <SplitButton
                options={splitButtonOptions}
                handleExportClick={handleSplitButtonClick}
                graphModeVisible={graphModeVisible}
              />
              <PrintReportDialog
                downloadCallback={handlePrintMapClick}
                setPrintReportDialogOpen={setPrintReportDialogOpen}
                printReportDialogOpen={printReportDialogOpen}
                title={title}
                setTitle={setTitle}
              />
            </>
          </FiltersContainer>
        </FiltersSection>
      </FiltersBarRoot>

      <Map ref={mapContainer}>
        <MeasurementsPopup
          measurementsContainerRef={measurementsContainerRef}
          radiusRef={radiusRef}
          polygonRef={polygonRef}
          pointRef={pointRef}
          lineRef={lineRef}
          onHide={() => setMeasurementsVisible(false)}
          onClear={handleClearMeasurements}
        />
        {eventsRegistered && graphModeVisible ? (
          <GraphModeControl
            filterValues={filterValuesGraphMode}
            handleFilterValues={handleFilterValuesGraphMode}
            parameterGroups={parameterGroups}
            parameters={parameters}
            onSelectAllParameters={onSelectAllParameters}
            onSelectNoneParameters={onSelectNoneParameters}
            onSelectAllParameterGroups={onSelectAllParameterGroups}
            onSelectNoneParameterGroups={onSelectNoneParameterGroups}
          />
        ) : (
          <MainControl
            activeBasemap={activeBasemap}
            basemaps={basemaps}
            bufferValues={searchRadiusBuffers}
            layers={layers}
            onBasemapChange={updateBasemap}
            onBufferValuesChange={updateSearchRadiusBuffers}
            onClearBuffers={handleClearSearchRadiusBuffers}
            onEnableSearchRadiusControl={handleEnableSearchRadiusControl}
            onLayerChange={updateLayerVisibility}
            onOpacityChange={updateLayerOpacity}
            onResetBuffers={resetSearchRadiusBuffers}
            value={filterValues?.search?.value}
          />
        )}
        {graphModeVisible && (
          <DataViz
            open={dataVizVisible}
            onClose={() => setDataVizVisible(false)}
            analyticsResults={analyticsResults}
            timeSeriesResults={timeSeriesResults}
            filterValues={filterValuesGraphMode}
            isTimeSeriesResultsLoading={isTimeSeriesResultsLoading}
            getHexColorForScore={getHexColorForScore}
            isAnalyticsTableDataLoading={isAnalyticsTableDataLoading}
            lastLocationIdClicked={lastLocationIdClicked}
          />
        )}

        {eventsRegistered && hasGraphDataLoaded && (
          <GraphModeToggle
            open={graphModeVisible}
            handleClick={handleGraphModeClick}
          />
        )}

        {graphModeVisible && (
          <>
            <DataVizControl
              open={dataVizVisible}
              handleClick={() => setDataVizVisible(!dataVizVisible)}
            />
            <LegendControl
              open={legendVisible}
              onToggle={() => setLegendVisible(!legendVisible)}
            />
            {legendVisible && (
              <Legend legendColors={graphModeBenchmarkColors} />
            )}
            <GraphModeLayersToggle
              open={graphModeLayersVisible}
              onToggle={handleGraphModeLayersToggleClick}
            />
            <GraphModePopupToggle
              open={graphModePopupVisible}
              onToggle={() => setGraphModePopupVisible(!graphModePopupVisible)}
            />
            {!graphModePopupVisible && (
              <div
                dangerouslySetInnerHTML={{
                  __html: "<style>.mapboxgl-popup { display: none; }</style>",
                }}
              />
            )}
          </>
        )}

        {!measurementsVisible && (
          <MeasurementsControl
            open={measurementsVisible}
            onToggle={() => setMeasurementsVisible(!measurementsVisible)}
            right={49}
            bottom={30}
          />
        )}
      </Map>

      {eventsRegistered && printReportDialogOpen && (
        <span
          style={{
            display: "none",
            width: "100%",
          }}
        >
          <PrintMapFormat
            ref={printRef}
            title={title}
            mapImg={map.getCanvas().toDataURL("image/png")}
            map={map}
          />
        </span>
      )}
    </>
  );
};

export default PublicMap;
