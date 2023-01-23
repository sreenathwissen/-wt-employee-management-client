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


const types = "project | projectlinkage | edit | view" 

enum ProjectValues {
  project='project',
  projectlinkage='projectlinkage',
  edit='edit',
  view='view'
}


const ProjectGrid = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [getrow,selectedRow]=useState<any>(null);
  const url = "http://localhost:4000/projects";
  const allProjectsUrl = "/api/project/allProjects"
  const [projectForm, setProjectForm] = useState<any>(false);
  const [projectLinkajeForm, setProjectLinkajeForm] = useState<any>(false);
  const [submitBtnDisable,setSubmitBtnDisable] = useState<any>(false);
  const [update,getUpdate] = useState<any>(false);

  const handleClickOpen = (type:any,row:any) => {
    if (type === ProjectValues.project) {
      selectedRow(null);
      setProjectForm(true);
      setSubmitBtnDisable(false);
    } else if (type === ProjectValues.projectlinkage) {
      setProjectLinkajeForm(true);
      setSubmitBtnDisable(false);
    }
    else if(type==ProjectValues.edit && row)
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

  const handleClose = (type:any) => {
    if (type === ProjectValues.project) {
      setProjectForm(false);
    } else if (type === ProjectValues.projectlinkage) {
      setProjectLinkajeForm(false);
    }
    else if (type === ProjectValues.edit) {
      selectedRow(null);
      setProjectForm(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [update]);

  const getUser = () => {
    fetch(allProjectsUrl)
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp.map((result:any,index:any)=>
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
      <Grid component={Grid as any} sx={{ m: 0, p: 2 }} align="right">
        <Button
          className="btn-add"
          variant="contained"
          color="success"
          onClick={() => handleClickOpen(ProjectValues.project,null)}
        >
          <AddCircleOutlineIcon /> &nbsp; create new project
        </Button>
        <Button
          sx={{ m: 2 }}
          className="btn-add"
          variant="contained"
          color="success"
          onClick={() => handleClickOpen(ProjectValues.projectlinkage,null)}
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
              <IconButton onClick={() => handleClickOpen(ProjectValues.edit,row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="View">
              <IconButton color="success" onClick={() => handleClickOpen(ProjectValues.view,row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}/>
      <ProjectForm
        open={projectForm}
        handleClose={() => handleClose(ProjectValues.project)}
        update={getUpdate}
        rowUpdate={getrow}
        disableBtn={submitBtnDisable}
      />
      <ProjectLinkageForm
        open={projectLinkajeForm}
        handleClose={() => handleClose(ProjectValues.projectlinkage)}
      />
    </>
  );
};

export default ProjectGrid;
