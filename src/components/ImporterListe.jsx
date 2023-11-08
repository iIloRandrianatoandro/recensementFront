import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button, FormLabel
  } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MuiFileInput } from 'mui-file-input'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';


//composant pour mettre le titre de la boite de dialogue du formulaire
function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;
    BootstrapDialogTitle.propTypes = {
      children: PropTypes.node,
      onClose: PropTypes.func.isRequired,
    };
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        <CloseIcon />
        </IconButton>
          ) : null}
      </DialogTitle>
    );
  }
export default function ImporterListe() {
    //url du backend
    const baseUrl = "http://localhost:8000/api";
    //navigation  
    const navigate = useNavigate();
    // definition des state de l'application
    const [importer, setImporter] = useState(true);
    const [premiereUtilisation, setPremiereUtilisation] = useState(true);
    const [afficherPremiereUtilisation, setAfficherPremiereUtilisation] = useState(true);
    const [excel, setExcel] = useState(null)
    const [annee, setAnnee] = useState(new Date());

    const getAnnee = (newYear) => {
        setAnnee(newYear);
    }
    const getExcel = (newFile) => {
        setExcel(newFile)
    }

    //fermer la fenetre
    const fermerFenetre=()=>{
      setImporter(false);
      navigate(`/`);
    }
    //obtenir la valeur de premierUtilisation
    const getPremiereUtilisation = (event) => {
        setPremiereUtilisation(event.target.checked);
      };
    const importerMateriel=()=>{

    }
  return (
    <>
        <Dialog
        open={importer}//la boite de dialogie s'ouvre quand importer==true
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre}>
                Importer la liste des matériels à recenser
            </BootstrapDialogTitle>
            <DialogContent dividers>
            <form onSubmit={importerMateriel} style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
                {afficherPremiereUtilisation && (
                <FormGroup>
                    <FormControlLabel control={
                    <Switch  defaultChecked 
                    checked={premiereUtilisation}
                    onChange={getPremiereUtilisation}
                    />} 
                    label="Première utilisation" />
                </FormGroup>
                )}
        <FormLabel>Année</FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Année" 
        views={['year']}
       // value={dayjs(annee)}
        onChange={getAnnee}
        />
      </DemoContainer>
    </LocalizationProvider>
        <FormLabel>Fichier Excel</FormLabel>
        <MuiFileInput value={excel} onChange={getExcel} inputProps={{ accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }}/>
        <Button
          variant="contained"
          type="submit"
          color="success"
          sx={{ color:'black'}}
        >
          importer
        </Button>
        <Button
          variant="contained"
          type="button"
          sx={{bgcolor:'yellow', color:'black'}}
          onClick={fermerFenetre}
        >
          Annuler
        </Button>
      </form>
    </DialogContent>
    </Dialog>
    </>
  )
}
