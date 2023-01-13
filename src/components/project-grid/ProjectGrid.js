import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ProjectForm from "../project-form/ProjectForm";
import ProjectLinkageForm from "../employee-project-linkage-form";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import {Edit} from '@mui/icons-material';
import {Box,IconButton,Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProjectGrid = () => {
  const [tableData, setTableData] = useState([]);
  const [getrow,selectedRow]=useState(null);
  const url = "http://localhost:4000/projects";
  const allProjectsUrl = "/api/project/allProjects"
  const [projectForm, setProjectForm] = useState(false);
  const [projectLinkajeForm, setProjectLinkajeForm] = useState(false);
  const [submitBtnDisable,setSubmitBtnDisable] = useState(false);
  const [update,getUpdate] = useState(false);

  const handleClickOpen = (type,row) => {
    if (type === "project") {
      selectedRow();
      setProjectForm(true);
      setSubmitBtnDisable(false);
    } else if (type === "projectlinkage") {
      setProjectLinkajeForm(true);
      setSubmitBtnDisable(false);
    }
    else if(type=='edit' && row)
    {
      selectedRow(row['original']);
      setProjectForm(true);
      setSubmitBtnDisable(false);
    }
    else if(type=='view')
    {
      selectedRow(row['original']);
      setProjectForm(true);
      setSubmitBtnDisable(true);
    }
  };

  const handleClose = (type) => {
    if (type === "project") {
      setProjectForm(false);
    } else if (type === "projectlinkage") {
      setProjectLinkajeForm(false);
    }
    else if (type === "edit") {
      selectedRow();
      setProjectForm(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [update]);

  const getUser = () => {
    fetch(allProjectsUrl)
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp.map((result,index)=>
      {
        result['serialNumber']=index+1;
        return result;
      })));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serialNumber",
        header: "S.No"
      },
      {
        accessorKey: "client.clientName",
        header: "Client Name"
      },
      {
        accessorKey: "client.clientLocation",
        header: "Client Location"
      },
      {
        accessorKey: "projectLocation",
        header: "Project Location"
      },
      {
        accessorKey: "projectType",
        header: "Project Type"
      },
      {
        accessorKey: "projectLead",
        header: "Project Lead"
      },
      
    ],
    []
  );

  return (
    <>
      <Grid sx={{ m: 0, p: 2 }} align="right">
        <Button
          className="btn-add"
          variant="contained"
          color="success"
          onClick={() => handleClickOpen("project")}
        >
          <AddCircleOutlineIcon /> &nbsp; create new project
        </Button>
        <Button
          sx={{ m: 2 }}
          className="btn-add"
          variant="contained"
          color="success"
          onClick={() => handleClickOpen("projectlinkage")}
        >
          <AssignmentOutlinedIcon />
          &nbsp; Asign Project
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
          <Box sx={{ display: 'flex',  gap: '0.5rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => handleClickOpen("edit",row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="View">
              <IconButton color="success" onClick={() => handleClickOpen("view",row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}/>
      <ProjectForm
        open={projectForm}
        handleClose={() => handleClose("project")}
        update={getUpdate}
        rowUpdate={getrow}
        disableBtn={submitBtnDisable}
      />
      <ProjectLinkageForm
        open={projectLinkajeForm}
        handleClose={() => handleClose("projectlinkage")}
      />
    </>
  );
};

export default ProjectGrid;
