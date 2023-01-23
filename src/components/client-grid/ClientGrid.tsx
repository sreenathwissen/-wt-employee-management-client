import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClientForm from "../client-form";
import {Edit} from '@mui/icons-material';
import {Box,IconButton,Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClientGrid = () => {
  const [tableData, setTableData] = useState([]);
  const [getrow,selectedRow]=useState(null);
  const [update,getUpdate] = useState(false);
  const url = "http://localhost:4000/clients";
  const [clientForm, setClientForm] = useState(false);
  const [submitBtnDisable,setSubmitBtnDisable] = useState(false);

const types = "client | edit | view"

enum USER {
  client='client',
  edit='edit',
  view='view'
}


  const handleClickOpen = (type:any,row:any) => {
    if (USER.client) {
      selectedRow(null);
      setClientForm(true);
      setSubmitBtnDisable(false);
    }
    else if(USER.edit && row)
    {
      selectedRow(row['original']);
      setClientForm(true);
      setSubmitBtnDisable(false);
    }
    else if(USER.view && row)
    {
      selectedRow(row['original']);
      setClientForm(true);
      setSubmitBtnDisable(true);
    }
  };

  const handleClose = (type:any) => {
    if (USER.client) {
      setClientForm(false);
    }
    else if (USER.edit) {
      selectedRow(null);
      setClientForm(false);
    }
    getUser();
  };

  useEffect(() => {
    getUser();
  }, [update]);

  const getUser = () => {
    fetch('/api/client/allClients')
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp.map((result:any,index:number)=>
      {
        result['serialNumber']=index+1;
        return result;
      })));
  };

  const columns:any = useMemo(
    () => [
      {
        accessorKey: "serialNumber", //access nested data with dot notation
        header: "S.No",
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
      },
      {
        accessorKey: "clientLocation", //normal accessorKey
        header: "Client Location",
      },
    ],
    []
  );

  return (
    <>
      <Grid component={Grid as any} sx={{ m: 0, p: 2 }} align="right">
        <Button
          // sx={{ m: 2 }}
          className="btn-add"
          variant="contained"
          color="success"
          onClick={() => handleClickOpen(USER.client ,null)}
        >
          <AddCircleOutlineIcon /> &nbsp; create client
        </Button>
      </Grid>
      <MaterialReactTable columns={columns} data={tableData} enableEditing displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: "left",
            },
            muiTableBodyCellProps: {
              align: "center",
            },
          },
        }} 
        positionActionsColumn="last"
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => handleClickOpen(USER.edit,row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="View">
              <IconButton color="success" onClick={() => handleClickOpen(USER.view,row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}/>
      <ClientForm open={clientForm} handleClose={() => handleClose("client")} update={getUpdate}
        rowUpdate={getrow}
        disableBtn={submitBtnDisable}/>
    </>
  );
};

export default ClientGrid;
