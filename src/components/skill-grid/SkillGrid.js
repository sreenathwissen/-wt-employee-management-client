import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete, debounce } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const SkillGrid = () => {
  const [skilldata, setSkillData] = useState({
    tableData: [],
    open: false,
    error: false,
    editEnable: false,
    inputskill: {} || "",
    skillOptions: [],
    submitBtnDisable: false,
  });
  const {
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      skillName: "",
    },
  });

  const columns = useMemo(() => [
    {
      accessorKey: "serialNumber",
      header: "S.No",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "skillName", //access nested data with dot notation
      header: "Skill Name",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ]);

  const handleClickOpen = (type, row) => {
    if (type == "skill") {
      setSkillData((prev) => ({
        ...prev,
        skillOptions: [],
        inputskill: { skillId: 0, skillName: "", serialNumber: 0 },
        open: true,
        editEnable: false,
      }));
    } else if (type == "edit" && row) {
      setSkillData((prev) => ({
        ...prev,
        skillOptions: [],
        editEnable: true,
        inputskill: row["original"],
        open: true,
        submitBtnDisable: false,
      }));
    } else if (type == "view") {
      setSkillData((prev) => ({
        ...prev,
        inputskill: row["original"],
        open: true,
        submitBtnDisable: true,
      }));
    }
  };

  const handleClose = () => {
    setSkillData((prev) => ({
      ...prev,
      open: false,
      error: false,
      submitBtnDisable: false,
    }));
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isPresent = false;
    if (
      Object.keys(skilldata.inputskill).length > 0
        ? skilldata.inputskill?.skillName
        : skilldata.inputskill
    ) {
      setSkillData((prev) => ({ ...prev, open: false, error: false }));
    } else {
      setSkillData((prev) => ({ ...prev, error: true }));
      return;
    }
    let skillname =
      Object.keys(skilldata.inputskill).length > 0
        ? skilldata.inputskill?.skillName
        : skilldata?.inputskill;
    skilldata.tableData.map((skill) => {
      if (skill?.skillName?.toLowerCase() === skillname.toLowerCase()) {
        isPresent = true;
        return;
      }
    });
    if (isPresent) {
      alert("Skill Already Present!!!");
      return;
    }
    let data = [
      { skillId: skilldata?.inputskill?.skillId, skillName: skillname.trim() },
    ];
    await fetch("/api/skill", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      handleClose();
      getSkills();
    });
  };

  useEffect(() => {
    getSkills();
  }, []);

  const setSkills = (e) => {
    setTimeout(async () => {
      await fetch(`/api/skill/search?skill=${e}`)
        .then((resp) => resp.json())
        .then((resp) =>
          setSkillData((prev) => ({ ...prev, skillOptions: resp }))
        );
    }, 500);
  };

  const getSkills = async () => {
    await fetch("/api/skill")
      .then((resp) => resp.json())
      .then((resp) =>
        setSkillData((prev) => ({
          ...prev,
          tableData: resp.map((result, index) => {
            result["serialNumber"] = index + 1;
            return result;
          }),
        }))
      );
  };
  return (
    <>
      <Dialog
        open={skilldata.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            padding: "5px 24px",
          }}
        >
          {skilldata?.submitBtnDisable ? "View Skill" : skilldata?.editEnable? "Edit Skill": "Add Skill"}
          <span style={{ marginLeft: "250px" }}>
            <CloseIcon
              onClick={handleClose}
              style={{ cursor: "pointer", color: "red" }}
            />
          </span>
        </DialogTitle>
        <DialogContent maxwidth="400px">
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              <Grid2 item xs={8}>
                <Controller
                  control={control}
                  name="skillName"
                  render={({ field }) => (
                    <Autocomplete
                      freeSolo
                      disabled={skilldata.submitBtnDisable}
                      value={skilldata.inputskill || null}
                      options={skilldata.skillOptions?.map((data) => data)}
                      getOptionLabel={(option) => option.skillName}
                      onInputChange={(e) => {
                        setSkills(e?.target.value);
                        setSkillData((prev) => ({
                          ...prev,
                          inputskill: {
                            skillId: skilldata.inputskill?.skillId,
                            skillName:
                              e?.target.value ??
                              skilldata.inputskill?.skillName,
                          },
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          id="skillName"
                          disabled={skilldata.submitBtnDisable}
                          autoComplete="off"
                          label="Skill Name"
                          variant="outlined"
                          margin="normal"
                          {...params}
                          {...field}
                          error={skilldata.error}
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </Grid2>
              <DialogActions>
                {skilldata.submitBtnDisable ? (
                  ""
                ) : (
                  <Button color="primary" variant="contained" type="submit">
                    {skilldata.inputskill?.skillId !== 0 ? "Edit" : "Add"}
                  </Button>
                )}
              </DialogActions>
            </Grid2>
          </form>
        </DialogContent>
      </Dialog>
      {skilldata.submitBtnDisable ? (
        ""
      ) : (
        <Grid sx={{ m: 0, p: 2 }} align="right">
          <Button
            className="btn-add"
            variant="contained"
            color="success"
            onClick={() => handleClickOpen("skill")}
          >
            <AddCircleOutlineIcon /> &nbsp; Add Skill
          </Button>
        </Grid>
      )}
      <MaterialReactTable
        columns={columns}
        initialState={{ density: "compact" }}
        enableColumnFilters={false}
        data={skilldata.tableData}
        enableEditing
        enableRowVirtualization
        displayColumnDefOptions={{
          "mrt-row-actions": {
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
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => handleClickOpen("edit", row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="View">
              <IconButton
                color="success"
                onClick={() => handleClickOpen("view", row)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </>
  );
};

export default SkillGrid;
