import React, { useMemo } from "react";
import DataScrubbing from "../../components/DataScrubbing";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const ListWqatParameters = () => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: ParametersLookup } = useQuery(
    ["same-as-lookup-parameters"],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/same-as-lookup-parameters`,
          { headers }
        );
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: ChemicalConversionsLookup } = useQuery(
    ["list-chemical-form-conversions"],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/list-chemical-form-conversions`,
          { headers }
        );
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const FormattedParametersLookup = useMemo(() => {
    let converted = {};
    if (ParametersLookup?.length) {
      ParametersLookup.forEach((d) => {
        converted[d.same_as_ndx] = d.item_name;
      });
    }
    converted[-999] = "-----";
    return converted;
  }, [ParametersLookup]);

  const FormattedChemicalConversionsLookup = useMemo(() => {
    let converted = {};
    if (ChemicalConversionsLookup?.length) {
      ChemicalConversionsLookup.forEach((d) => {
        converted[d.chem_conv_ndx] = `${d.chem_form_1} to ${d.chem_form_2}`;
      });
    }
    return converted;
  }, [ChemicalConversionsLookup]);

  const columns = [
    {
      title: "Enabled",
      field: "wqat_include",
      type: "boolean",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Sample Fraction",
      field: "sample_fraction",
      editable: "never",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Characteristic Name",
      field: "characteristic_name",
      editable: "never",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Display Name",
      field: "display_name",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Display Abbreviation",
      field: "display_abbrev",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Official Name",
      field: "official_name",
      type: "boolean",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Method Speciation",
      field: "method_speciation",
      editable: "never",
      cellStyle: {
        height: "40px",
      },
    },
    {
      title: "Same As",
      field: "same_as_ndx",
      lookup: FormattedParametersLookup,
      cellStyle: { height: "40px" },
    },
    {
      title: "Chemical Conversion",
      field: "chem_conv_ndx",
      lookup: FormattedChemicalConversionsLookup,
      cellStyle: { height: "40px" },
    },
  ];

  return (
    <DataScrubbing
      endpoint="list-wqat-parameters"
      title="Parameters"
      indexField="parameter_ndx"
      tableMaxHeight="calc(100vh - 64px - 48px - 106px - 48px - 64px - 180px)"
      columns={columns}
    />
  );
};

export default ListWqatParameters;
