import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import StepperForm from "../stepper-form/StepperForm";
import CloseIcon from "@mui/icons-material/Close";


interface userData{
  firstName:string,
  lastName:string,
  email:string
}

interface DataTypes{
  open:boolean,
  handleClose:any,
  data:userData,
  onChange?:any,
  handleFormSubmit?:any
}


const DataForm = ({ open, handleClose, data} : DataTypes) => {
  const { firstName, lastName, email } = data;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Create New Employee"}
          <span style={{ marginLeft: "310px" }}>
            <CloseIcon
              onClick={handleClose}
              style={{ cursor: "pointer", color: "red" }}
            />
          </span>
        </DialogTitle>
        <DialogContent>
          <StepperForm />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataForm;
