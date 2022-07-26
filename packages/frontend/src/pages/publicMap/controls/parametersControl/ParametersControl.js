import React from "react";
import { Box, Grid, Typography as MuiTypography } from "@material-ui/core";
import styled from "styled-components/macro";
import Chips from "../../../../components/Chips";
import { spacing } from "@material-ui/system";
import Button from "@material-ui/core/Button";

const ChipsGroup = styled.div`
  ${spacing};
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  margin-left: 3px;
  margin-right: 3px;
`;

const FilterGroup = styled(Box)`
  width: 100%;
  :not(:last-child) {
    border-bottom: 1px solid #dddddd;
  }
`;

const Typography = styled(MuiTypography)(spacing);

const ParametersControl = ({
  props: {
    filterValues,
    handleFilterValues,
    parameterGroups,
    parameters,
    onSelectAllParameters,
    onSelectNoneParameters,
    onSelectAllParameterGroups,
    onSelectNoneParameterGroups,
  },
}) => {
  return (
    <div>
      <FilterGroup p={1}>
        <ChipsGroup mb={4}>
          <Typography variant="subtitle1" gutterBottom>
            Parameter Groups
          </Typography>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  disabled={!parameterGroups.length}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={onSelectAllParameterGroups}
                >
                  + Select All
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={!parameterGroups.length}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={onSelectNoneParameterGroups}
                >
                  - Select None
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Chips
            data={parameterGroups.filter((item) =>
              item.stats_period.includes(filterValues.periodOfRecord)
            )}
            valueField="parameter_group_name"
            displayField="parameter_group_name"
            handleChipClick={(e) =>
              handleFilterValues("parameterGroups", e.target.textContent)
            }
            type="parameter-groups-type"
            activeChips={filterValues.parameterGroups}
          />
        </ChipsGroup>
      </FilterGroup>

      <FilterGroup p={1}>
        <ChipsGroup mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Parameters
          </Typography>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  disabled={!parameters.length}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={onSelectAllParameters}
                >
                  + Select All
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={!parameters.length}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={onSelectNoneParameters}
                >
                  - Select None
                </Button>
              </Grid>
            </Grid>
          </Box>
          {parameters.length === 0 && (
            <Typography mt={3} align="center" variant="subtitle2">
              ----- None Available -----
            </Typography>
          )}
          <Chips
            data={parameters}
            valueField="parameter_abbrev"
            displayField="parameter_abbrev"
            handleChipClick={(e) =>
              handleFilterValues("parameters", e.target.textContent)
            }
            type="parameter-type"
            activeChips={filterValues.parameters}
            tooltipField1="parameter_name"
            tooltipField2="unit_desc"
          />
        </ChipsGroup>
      </FilterGroup>
    </div>
  );
};

export default ParametersControl;
