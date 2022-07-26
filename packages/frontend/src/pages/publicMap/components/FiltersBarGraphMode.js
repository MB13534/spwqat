import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField as MuiTextField,
} from "@material-ui/core";
import React, { useEffect } from "react";
import styled from "styled-components/macro";
import useDebounce from "../../../hooks/useDebounce";

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

const TextField = styled(MuiTextField)`
  width: 150px;
  min-width: 125px;
  display: flex;
`;

const FiltersBarGraphMode = ({
  filterValues,
  handleFilterValues,
  periodOfRecords,
  analysisTypes,
  inputValue,
  setInputValue,
}) => {
  const handleInput = (event) => {
    const { value } = event.target;
    setInputValue(+value);
  };

  const debouncedSearchValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    handleFilterValues("recordCount", debouncedSearchValue);
  }, [debouncedSearchValue]); //eslint-disable-line

  return (
    <>
      <FiltersSection>
        <FiltersContainer>
          <TextField
            variant="outlined"
            select
            fullWidth
            size="small"
            label="Period of Record"
            value={filterValues?.periodOfRecord}
            onChange={(e) =>
              handleFilterValues("periodOfRecord", e.target.value)
            }
          >
            {periodOfRecords.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="outlined"
            select
            fullWidth
            size="small"
            label="Analysis"
            value={filterValues.analysis}
            onChange={(e) => handleFilterValues("analysis", e.target.value)}
          >
            {analysisTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <FormControl variant="outlined">
            <InputLabel htmlFor="record-count">Min Records</InputLabel>
            <OutlinedInput
              style={{ width: "120px" }}
              type="number"
              autoComplete="off"
              variant="outlined"
              margin="dense"
              label="Record Count"
              value={inputValue}
              onChange={handleInput}
              // endAdornment={
              //   <InputAdornment position="end">
              //     <IconButton
              //       size="small"
              //       aria-label="record count"
              //       onClick={() =>
              //         handleFilterValues("recordCount", inputValue)
              //       }
              //     >
              //       <SearchIcon />
              //     </IconButton>
              //   </InputAdornment>
              // }
            />
          </FormControl>
        </FiltersContainer>
      </FiltersSection>
    </>
  );
};

export default FiltersBarGraphMode;
