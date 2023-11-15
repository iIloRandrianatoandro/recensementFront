import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button, FormLabel
  } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useEffect } from "react";
import { Box } from '@mui/material';

import axios from "axios";

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

export default function ModifierMateriel() {
   //url du backend
   const baseUrl = "http://localhost:8000/api";
   // récupérer l'id du recensement a partir de l'url
   const { id } = useParams();
   //navigation  
   const navigate = useNavigate();
   // definition des state de l'application
   const [modifier, setModifier] = useState(true);
   const [designation, setDesignation] = useState("");
   const [nomenclature, setNomenclature] = useState("");
   const [especeUnite, setEspeceUnite] = useState("");
   const [modificationEffectuee, setModificationEffectuee] = useState(false);
   const [erreur, setErreur] = useState(false);
   //pour effectuer la modification dans la base de données
  const modifierMateriel=async(e)=>{
    e.preventDefault();
    await axios.request({
      url: `${baseUrl}/modifierMateriel/${id}`,
      method:"POST",
      data: {
        designation: designation,
        nomenclature: nomenclature,
        especeUnite: especeUnite,
      },            
    })
    .then(res=>{
      if(res.status===200){setModificationEffectuee(true);}
    })
    .catch(err=>{setErreur(true)})
  }
  //fermer la fenetre
  const fermerFenetre=()=>{
    setModifier(false);
    navigate(`/listerMateriel`);
  }
  useEffect(()=>{
    //recuperer les informations du materiel pour les afficher
    const getRecensementById=async()=>{
      const response = await axios.get(`${baseUrl}/voirMateriel/${id}`);
      const materiel= response.data[0]
      setDesignation(materiel.designation);
      setNomenclature(materiel.nomenclature);
      setEspeceUnite(materiel.especeUnite);
    };
    getRecensementById();
  },[id])
  return (
    <>
    <Dialog
    open={modifier}//la boite de dialogie s'ouvre quand recenser==true
    >
    <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre}sx={{ color: 'black' }}>
    Modifier le matériel
    </BootstrapDialogTitle>
    <DialogContent dividers>
      <form onSubmit={modifierMateriel} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "500px", maxWidth: "md", height: "400px", maxHeight: "md", marginTop:20 }}>
        <FormLabel>Nomenclature</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={nomenclature}
          onChange={(e) => setNomenclature(e.target.value)}
          required
        />
        <FormLabel>Désignation</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
        <FormLabel>Espece Unite</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={especeUnite}
          onChange={(e) => setEspeceUnite(e.target.value)}
          required
        />
        <Box style={{ display: "flex", flexDirection: "row", gap: "10px",marginTop:30}}>
        <Button
          style={{width:"50%"}}
          variant="contained"
          type="button"
          sx={{ bgcolor: 'grey', color: 'black' }}
          onClick={fermerFenetre}
        >
          Annuler
        </Button>
        <Button
          style={{width:"50%"}}
          variant="contained"
          type="submit"
          color="success"
          sx={{ color: 'black' }}
        >
          Modifier
        </Button>
        </Box>
        
      </form>
    </DialogContent>
    </Dialog>
      {modificationEffectuee && (
      <div>
        <Dialog
          open={modificationEffectuee}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Succès</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Modification effectuée avec succès
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setModificationEffectuee(false);navigate('/listerMateriel')}} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}
      {erreur && (
      <div>
        <Dialog
          open={erreur}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Erreur</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Il y a une erreur pendant la modification du matériel
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setErreur(false);navigate('/listerMateriel')}} autoFocus>
            OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}

  </>
  )
}
