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

export default function RecenserMateriel() {
  //url du backend
  const baseUrl = "http://localhost:8000/api";
  // récupérer l'id du recensement a partir de l'url
  const { id } = useParams();
  //navigation  
  const navigate = useNavigate();
  // definition des state de l'application
  const [recenser, setRecenser] = useState(true);
  const [designation, setDesignation] = useState("");
  const [existantApresEcriture, setExistantApresEcriture] = useState("");
  const [deficitPartArticle, setDeficitPartArticle] = useState(0);
  const [excedentParArticle, setExcedentParArticle] = useState(0);
  const [observation, setObservation] = useState("");
  const [recensementEffectuer, setRecensementEffectuer] = useState(false);
  const [erreur, setErreur] = useState(false);

  //pour effectuer le recensement dans la base de données
  const recenserMateriel=async(e)=>{
    e.preventDefault();
    await axios.request({
      url: `${baseUrl}/recenserMateriel/${id}`,
      method:"POST",
      data: {
        deficitParArticle: deficitPartArticle,
        excedentParArticle: excedentParArticle,
        observation: observation,
      },            
    })
    .then(res=>{
      if(res.status===200){setRecensementEffectuer(true);}
    })
    .catch(err=>{setErreur(true)})
  }
  //désactiver le champ excedent s'il y a deficit
  const remplirDeficit = (event) => {
    const value = event.target.value;
    setDeficitPartArticle(value);
    if (value) {
      setExcedentParArticle(0);
    }
  };
    
  //désactiver le champ deficit s'il y a excedent
  const remplirExcedent = (event) => {
    const value = event.target.value;
    setExcedentParArticle(value);    
    if (value) {
      setDeficitPartArticle(0);
    }
  };
  //fermer la fenetre
  const fermerFenetre=()=>{
    setRecenser(false);
    navigate(`/`);
  }
  useEffect(()=>{
    //recuperer les informations du recensement pour les afficher
    const getRecensementById=async()=>{
      const response = await axios.get(`${baseUrl}/voirRecensement/${id}`);
      const recensement= response.data[0]
      setDesignation(recensement.designation);
      setExistantApresEcriture(recensement.existantApresEcriture)
    };
    getRecensementById();
  },[id])
  return (
    <>
    <Dialog
    open={recenser}//la boite de dialogie s'ouvre quand recenser==true
    >
    <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre}>
    Recenser le matériel
    </BootstrapDialogTitle>
    <DialogContent dividers>
      <form onSubmit={recenserMateriel} style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
        <FormLabel>Désignation</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={designation}
          disabled={true}
        />
        <FormLabel>Existant après écriture</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={existantApresEcriture}
          disabled={true}
        />
        <FormLabel>Déficit par article</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          type='number'
          InputProps={{inputProps:{min: 0,max: existantApresEcriture} }}//max  existantApresEcriture
          value={deficitPartArticle}
          onChange={remplirDeficit}
          disabled={excedentParArticle.length > 0}
        />
        <FormLabel>Excédent par article</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          type='number'
          InputProps={{inputProps:{min: 0,max: 10} }}
          value={excedentParArticle}
          onChange={remplirExcedent}
          disabled={deficitPartArticle.length > 0}
        />
        <FormLabel>Observation</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          onChange={(e) => setObservation(e.target.value)}
        />
        <Button
          variant="contained"
          type="submit"
          color="success"
          sx={{ color:'black'}}
        >
          Recenser
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
      {recensementEffectuer && (
      <div>
        <Dialog
          open={recensementEffectuer}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Succès</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Recensement effectué avec succès
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setRecensementEffectuer(false);navigate('/')}} autoFocus>
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
              Il y a une erreur pendant le recensement du matériel
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setErreur(false);navigate('/')}} autoFocus>
            OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}

  </>
)
}
