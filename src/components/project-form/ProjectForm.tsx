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
import { ToastContainer, toast } from 'react-toastify';

interface ProjectTypes{
    open:boolean,
    handleClose:any,
    update:any,
    rowUpdate:any,
    disableBtn:boolean
}
type ProjectType={ id:number,value:string}[];

interface ClientSelected{
    // {clientId:'',clientName:'',clientLocation:''}
    clientId:string,
    clientName:string,
    clientLocation:string
}



const ProjectForm = ({ open, handleClose, update,rowUpdate,disableBtn} : ProjectTypes) => {
    const [clientData, setClientApi] = useState<any>([]);
    let [clientSelected, setClientSelectedData] = useState<any>();
    const [projectName, setProjectName] = useState<any>();
    const [projectLocation, setProjectLocation] = useState<any>('');
    const [projectLead, setProjectLead] = useState<any>(false);
    let [projectType, setProjectType] = useState<any>();
    const [addProjectValidation, setAddProjectValidation] = useState<any>(false);
    const url = "/api/client/allClients";
    const projectUrl = "/api/project";

    const projectTypes:ProjectType = [
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
            let ptype =projectTypes.find((res:any)=>
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
            setProjectType(ptype as any);
        }
        else{
            setClientSelectedData({clientId:'',clientName:'',clientLocation:''} as any)
            setProjectName('');
            setProjectLocation('');
            setProjectLead('' as any);
            setProjectType({id:'',value:''} as any);
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
    if (projectLead && projectLocation && projectName && clientSelected && projectType) {
            setAddProjectValidation(false);
        }
        else {
            setAddProjectValidation(true);
            return;
        }
        const data = [{
            "clientId": (clientSelected?.clientId),
            "projectId":rowUpdate ? rowUpdate?.projectId : '',
            "projectLead": projectLead,
            "projectLocation": projectLocation,
            "projectName": projectName,
            "projectType": projectType?.value
        }];
        fetch(projectUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp)=>{
            update(true);
            if(resp.status >= 400)
            {
                let data = resp.json();
                data.then(result=>{
                    let errorMessage = result[0]['errorMessage'];
                    toast(errorMessage);
                })
            }
        })  
        setProjectLead('');
        setProjectLocation('');
        setProjectName(null);
        handleClose();
    }
    const keyDown=(e:any)=> {
        e.preventDefault();
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {disableBtn ? "View Project" : rowUpdate? "Edit Project":"Add Project"}
                </DialogTitle>
                <Container>
                    <Row>
                        <Col>
                            <Autocomplete
                                className="box"
                                freeSolo
                                disabled={disableBtn}
                                options={clientData}
                                value={clientSelected || null}
                                getOptionLabel={(option) => [option?.clientName,option.clientLocation].join(' ')}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setClientSelectedData(newValue as any);
                                    } else {
                                        setClientSelectedData(null as any);
                                    }
                                }}
                                renderInput={
                                    (params) =>
                                        <TextField
                                            {...params}
                                            autoFocus
                                            id="name"
                                            onKeyDown={keyDown}
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
                                            onKeyDown={keyDown}
                                            id="type"
                                            label="Select Project Type"
                                            variant="outlined"
                                            error={(!projectType && addProjectValidation) ? true : false}
                                            
                                        />
                                }
                            />
                        </Col>
                    </Row>

                </Container>
                <DialogActions>
                   {disableBtn ? '':<Button variant="contained" color="success" onClick={createProject}>{rowUpdate ? 'Edit':'Add'}</Button>}
                    <Button variant="outlined" onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer/>
        </React.Fragment>
    );
};

export default ProjectForm;
