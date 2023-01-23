import React, { useEffect, useState } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Button,
    TextField,
    InputBase,
    Autocomplete
} from '@mui/material';
import { Row, Col, Container } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

  import 'react-toastify/dist/ReactToastify.css';

  type props = {
    open:boolean,
    handleClose:any,
    update:any,
    rowUpdate:any,
    disableBtn:boolean
  }

  interface Name{
    clientName:string,
    setClientName?:Function;
  }
  interface Location{
    clientLocation:string,
    setClientLocation?:Function
  }

interface Validate{
    addClientValidation?:boolean,
    setAddClientValidation?:any;
}

interface Search{
    clientSearch:any[],
    setClientSearch?:Function
}

const ClientForm = ({ open, handleClose,update,rowUpdate,disableBtn} : props) => {
    const [clientName, setClientName] = useState<Name>({clientName:''});
    const [clientLocation, setClientLocation] = useState<Location>({clientLocation:''});
    const [addClientValidation, setAddClientValidation] = useState<Validate>({addClientValidation:false});
    const [clientSearch, setClientSearch] = useState<Search>({clientSearch:[]});
    const url = "/api/client";

    useEffect(() => {
        if (clientName && clientName.clientName.length >= 3 && clientLocation && clientLocation.clientLocation.length >= 3)
            setAddClientValidation({addClientValidation:true});
        else
        setAddClientValidation({addClientValidation:false});

        if (clientSearch.clientSearch[0] === clientName.clientName) {
            let flag = false;
            clientSearch.clientSearch.forEach((client) => {
                if (client.clientLocation === clientLocation) {
                    flag = true;
                }
            });
            setAddClientValidation({addClientValidation:!flag});
        }
    }, [clientLocation, clientName]);

    useEffect(() => {
        fetch('/api/client/search?clientName=' + clientName)
            .then((resp) => resp.json())
            .then((resp) => setClientSearch(resp));
    }, [clientName]);

useEffect(()=>{
    if(rowUpdate){
        setClientName(rowUpdate.clientName);
        setClientLocation(rowUpdate.clientLocation);
    }
   

},[rowUpdate])

    const saveClient = () => {
        if(clientLocation && clientName)
        {
            setAddClientValidation({addClientValidation:false});
        }
        else{
            setAddClientValidation({addClientValidation:true});
            return;
        }
        update(false);
        const data = [{
            "clientId": rowUpdate?rowUpdate.clientId:'',
            "clientLocation": clientLocation,
            "clientName": clientName
        }];
        fetch(url, {
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
        setClientLocation({clientLocation:''});
        setClientName({clientName:''});
        handleClose();
    };

    const onClose = () => {
        setClientLocation({clientLocation:''});
        setClientName({clientName:''});
        handleClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                {disableBtn ? "View Client" : rowUpdate? "Edit Client":"Add Client"}
                </DialogTitle>
                <DialogContent>
                    <Container>
                        <Row>
                            <Col>
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    fullWidth
                                    disabled={disableBtn}
                                    value={clientName}
                                    options={clientSearch.clientSearch.map((option) => option.clientName)}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setClientName({clientName:newValue});
                                        } else if (newValue && newValue.inputValue) {
                                            setClientName(newValue.inputValue);
                                        } else {
                                            setClientName(newValue);
                                        }
                                    }}
                                    renderInput={
                                        (params) =>
                                            <TextField
                                                {...params}
                                                autoFocus
                                                disabled={disableBtn}
                                                margin="dense"
                                                autoComplete="off"
                                                error={(!clientName && addClientValidation) ? true : false}
                                                id="name"
                                                label="Name"
                                                variant="outlined"
                                                value={clientName}
                                                onChange={(e) => { setClientName({clientName:e.target.value}) }}
                                            />
                                    }
                                />
                            </Col>
                            <Col>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    disabled={disableBtn}
                                    margin="dense"
                                    id="name"
                                    label="Location"
                                    autoComplete="off"
                                    type="text"
                                    variant="outlined"
                                    error={(!clientLocation && addClientValidation) ? true : false}
                                    value={clientLocation}
                                    onChange={(e) => { setClientLocation({clientLocation:e.target.value}) }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </DialogContent>
                <DialogActions>
                 {disableBtn ? '':<Button variant="contained" color="success" onClick={saveClient}>{rowUpdate ? 'Edit': 'Add'}</Button>}
                    <Button variant="outlined" onClick={onClose}>close</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </React.Fragment>
    );
};

export default ClientForm;
