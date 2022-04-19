import React from "react";

import CopyIcon from "@material-ui/icons/FileCopy";
import { copyToClipboard, dateFormatter } from "../utils";
import MaterialTable from "material-table";
import { useApp } from "../AppProvider";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { titleize } from "inflected";

const DataAdminTable = ({
  label,
  data,
  pageSize = 10,
  isLoading = false,
  height = "100%",
  actions = [],
  endpoint,
  lookupNdx,
  updateHandler,
  editableFields,
  columnDisplayFields,
}) => {
  const { doToast } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  const columns = columnDisplayFields.map((item) => ({
    title: item === "wqat_include" ? "Enabled" : titleize(item),
    cellStyle: {
      height: "40px",
      minWidth: "140px",
      ...(editableFields.includes(item) && {
        width: "1%",
        maxWidth: "1%",
      }),
    },
    field: item,
    type: editableFields.includes(item) ? "boolean" : null,
    editable: editableFields.includes(item) ? "onAdd" : "never",
  }));

  const handleUpdate = (newData, oldData, rowData, columnDef) => {
    return (async () => {
      try {
        if (oldData !== newData) {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };

          const patchData = {
            [columnDef.field]: newData,
          };

          await axios.patch(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${rowData[lookupNdx]}`,
            patchData,
            { headers }
          );
          updateHandler((prevState) => {
            const data = [...prevState];
            data[data.indexOf(rowData)][columnDef.field] = newData;
            return data;
          });
          doToast("success", "New data was updated to the database");
        } else {
          return null;
        }
      } catch (err) {
        console.error(err);
        const message = err?.message ?? "Something went wrong";
        doToast("error", message);
      }
    })();
  };

  return (
    <>
      <MaterialTable
        id={label}
        title={`${label} ${dateFormatter(new Date(), "MM/DD/YYYY, h:mm A")}`}
        columns={columns}
        isLoading={isLoading}
        data={data}
        cellEditable={{
          onCellEditApproved: handleUpdate,
        }}
        actions={[
          {
            icon: CopyIcon,
            tooltip: "Copy Data",
            isFreeAction: true,
            onClick: () => {
              try {
                copyToClipboard(data, columns, () =>
                  doToast("success", "Data was copied to your clipboard.")
                );
              } catch (error) {
                const message = error?.message ?? "Something went wrong";
                doToast("error", message);
              }
            },
          },
          ...actions,
        ]}
        options={{
          emptyRowsWhenPaging: false,
          columnsButton: true,
          exportButton: true,
          exportAllData: true,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 30, 60],
          padding: "dense",
          searchFieldAlignment: "left",
          showTitle: false,
          maxBodyHeight: height,
          rowStyle: (rowData) => {
            return {
              backgroundColor: rowData.needs_review && "#fff2a8",
            };
          },
        }}
      />
    </>
  );
};

export default DataAdminTable;
