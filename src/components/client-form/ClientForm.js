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

const ClientForm = ({ open, handleClose,update,rowUpdate,disableBtn}) => {
    const [clientName, setClientName] = useState('');
    const [clientLocation, setClientLocation] = useState('');
    const [addClientValidation, setAddClientValidation] = useState(false);
    const [clientSearch, setClientSearch] = useState([]);
    const url = "/api/client";

    useEffect(() => {
        if (clientName.length >= 3 && clientLocation.length >= 3)
            setAddClientValidation(true);
        else
            setAddClientValidation(false);

        if (clientSearch[0]?.clientName === clientName) {
            let flag = false;
            clientSearch.forEach((client) => {
                if (client.clientLocation === clientLocation) {
                    flag = true;
                }
            });
            setAddClientValidation(!flag);
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
            setAddClientValidation(false);
        }
        else{
            setAddClientValidation(true);
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
            .then((resp) => console.log(resp));
        setClientLocation('');
        setClientName('');
        handleClose();
        update(true);
    };

    const onClose = () => {
        setClientLocation('');
        setClientName('');
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
                {disableBtn ? "View Client Details" : rowUpdate? "Edit Client Details":"Enter The New Client Details"}
                </DialogTitle>
                <DialogContent>
                    <Container maxWidth="sm">
                        <Row>
                            <Col>
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    fullWidth
                                    disabled={disableBtn}
                                    value={clientName}
                                    options={clientSearch.map((option) => option.clientName)}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setClientName(newValue);
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
                                                onChange={(e) => { setClientName(e.target.value) }}
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
                                    onChange={(e) => { setClientLocation(e.target.value) }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </DialogContent>
                <DialogActions>
                 {disableBtn ? '':<Button variant="contained" color="success" onClick={saveClient}>{rowUpdate ? 'edit': 'add'}</Button>}
                    <Button variant="outlined" onClick={onClose}>close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ClientForm;
