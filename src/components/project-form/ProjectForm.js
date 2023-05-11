import React, { useState } from "react";
import {
    InputLabel,
    FormControl,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
    Button,
    Input,
    FormHelperText,
    TextField,
    Autocomplete,
    Box
} from '@mui/material';
import { Row, Col, Container } from "react-bootstrap";
import { useEffect } from "react";

const ProjectForm = ({ open, handleClose, update,rowUpdate,disableBtn}) => {
    // const [projectdata,setProjectData]=useState({
    //     clientData:[]
    // })
    // setProjectData({...projectdata,clientData:})

    const [clientData, setClientApi] = useState([]);
    let [clientSelected, setClientSelectedData] = useState();
    const [projectName, setProjectName] = useState('');
    const [projectLocation, setProjectLocation] = useState('');
    const [projectLead, setProjectLead] = useState(false);
    let [projectType, setProjectType] = useState();
    const [addProjectValidation, setAddProjectValidation] = useState(false);
    const url = "/api/client/allClients";
    const projectUrl = "/api/project";

    const projectTypes = [
        {
            id: 1, value: 'TFR',
        },
        {
            id: 2, value: 'TNM',
        },
        {
            id: 3, value: 'Internal',
        }
    ]

    useEffect(() => {
        getAllClients();
        if(rowUpdate)
        {
            let ptype=projectTypes.find(res=>
                {
                    if(rowUpdate?.projectType=='T&M'){
                        rowUpdate.projectType='TNM';
                    } 
                    if(res['value'] == rowUpdate?.projectType)
                    {
                        return res;
                    }
                });

            setClientSelectedData(rowUpdate.client)
            setProjectName(rowUpdate.projectName);
            setProjectLocation(rowUpdate.projectLocation);
            setProjectLead(rowUpdate.projectLead);
            setProjectType(ptype);
        }
        else{
            setClientSelectedData({clientId:'',clientName:'',clientLocation:''})
            setProjectName('');
            setProjectLocation('');
            setProjectLead('');
            setProjectType({id:'',value:''});
        }
    },[rowUpdate])

    const getAllClients = () => {
        fetch(url)
            .then((resp) => resp.json())
            .then((resp) => {
                setClientApi(resp);
            }
            );
    }

    const createProject = () => {
        update(false);
        if(clientSelected)
        {
            clientSelected=clientSelected.clientId;
            setClientSelectedData(clientSelected);
        }
        if(projectType)
        {
            projectType=projectType.value;
            setProjectType(projectType);
        }

        if (projectLead && projectLocation && projectName && clientSelected && projectType) {
            setAddProjectValidation(false);
        }
        else {
            setAddProjectValidation(true);
            return;
        }
        const data = [{
            "clientId": clientSelected,
            "projectId":rowUpdate ? rowUpdate?.projectId : '',
            "projectLead": projectLead,
            "projectLocation": projectLocation,
            "projectName": projectName,
            "projectType": projectType
        }];
        fetch(projectUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((resp) => console.log(resp));
        setProjectLead('');
        setProjectLocation('');
        setProjectName();
        handleClose();
        update(true);
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {disableBtn ? "View Project Details" : rowUpdate? "Edit Project Details":"Enter The New Project's Details"}
                </DialogTitle>
                <Container maxwidth="sm">
                    <Row>
                        <Col>
                            <Autocomplete
                                className="box"
                                freeSolo
                                disabled={disableBtn}
                                options={clientData}
                                value={clientSelected || null}
                                getOptionLabel={(option) => [option.clientName,option.clientLocation].join(' ')}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setClientSelectedData(newValue);
                                    } else {
                                        setClientSelectedData(null);
                                    }
                                }}
                                renderInput={
                                    (params) =>
                                        <TextField
                                            {...params}
                                            autoFocus
                                            id="name"
                                            disabled={disableBtn}
                                            autoComplete="off"
                                            label="Client"
                                            error={(!clientSelected && addProjectValidation) ? true : false}
                                            variant="outlined"

                                        />
                                }
                            />
                        </Col>

                        <Col>
                            <FormControl className="box">
                                <TextField id="outlined-basic" disabled={disableBtn} autoComplete="off" value={projectName}  error={(!projectName && addProjectValidation) ? true : false} label="Project Name" variant="outlined" onChange={(e) => { setProjectName(e.target.value) }} />
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormControl className="box">
                                <TextField id="outlined-basic" disabled={disableBtn} autoComplete="off" label="Project Location" error={(!projectLocation && addProjectValidation) ? true : false} variant="outlined" value={projectLocation} onChange={(e) => { setProjectLocation(e.target.value) }} />
                            </FormControl>
                        </Col>
                        <Col>
                            <FormControl className="box">
                                <TextField id="outlined-basic" disabled={disableBtn} label="Project Lead" variant="outlined" autoComplete="off" value={projectLead} error={(!projectLead && addProjectValidation) ? true : false} onChange={(e) => { setProjectLead(e.target.value) }} />
                            </FormControl>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Autocomplete
                                sx={{ width: 250 }}
                                className="box"
                                freeSolo
                                disabled={disableBtn}
                                options={projectTypes}
                                value={projectType || null}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setProjectType(newValue);
                                    } else {
                                        setProjectType(null);
                                    }
                                }}
                                renderInput={
                                    (params) =>
                                        <TextField
                                            {...params}
                                            autoFocus
                                            autoComplete="off"
                                            disabled={disableBtn}
                                            style={{pointerEvents:'none'}}
                                            id="type"
                                            label="Select Project Type"
                                            variant="outlined"
                                            error={(!projectType && addProjectValidation) ? true : false}
                                            onChange={(e) => { 
                                                setProjectType('') }}
                                        />
                                }
                            />
                        </Col>
                    </Row>

                </Container>
                <DialogActions>
                   {disableBtn ? '':<Button variant="contained" color="success" onClick={createProject}>{rowUpdate ? 'Edit':'Create project'}</Button>}
                    <Button variant="outlined" onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ProjectForm;
