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

export default function ModifierUtilisateur() {
  //url du backend
  const baseUrl = "http://localhost:8000/api";
  // récupérer l'id du recensement a partir de l'url
  const { id } = useParams();
  //navigation  
  const navigate = useNavigate();
  // definition des state de l'application
  const [modifier, setModifier] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modificationEffectuee, setModificationEffectuee] = useState(false);
  const [erreur, setErreur] = useState(false);
  //pour effectuer la modification dans la base de données
 const modifierUtilisateur=async(e)=>{
   e.preventDefault();
   await axios.request({
     url: `${baseUrl}/modifierUtilisateur/${id}`,
     method:"POST",
     data: {
      name: name,
      email: email,
      password: password,
     },            
   })
   .then(res=>{
     if(res.status===200){setModificationEffectuee(true);}
   })
   .catch(err=>{console.log(err.response.data);setErreur(true)})
 }
 //fermer la fenetre
 const fermerFenetre=()=>{
   setModifier(false);
   navigate(`/listerUtilisateur`);
 }
 useEffect(()=>{
   //recuperer les informations du materiel pour les afficher
   const getRecensementById=async()=>{
     const response = await axios.get(`${baseUrl}/voirUtilisateur/${id}`);
     const utilisateur= response.data
     //console.log(utilisateur.password)
     setName(utilisateur.name);
     setEmail(utilisateur.email);
   };
   getRecensementById();
 },[id])
  return (
    <>
    <Dialog
    open={modifier}//la boite de dialogie s'ouvre quand recenser==true
    >
    <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre}>
    Modifier l'utilisateur
    </BootstrapDialogTitle>
    <DialogContent dividers>
      <form onSubmit={modifierUtilisateur} style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
        <FormLabel>Nom</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel>E mail</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel>Mot de passe</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          type="submit"
          color="success"
          sx={{ color:'black'}}
        >
          Modifier
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
            <Button onClick={() => {setModificationEffectuee(false);navigate('/listerUtilisateur')}} autoFocus>
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
              Il y a une erreur pendant la modification de l'utilisateur
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setErreur(false);navigate('/listerUtilisateur')}} autoFocus>
            OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}

  </>
  )
}
