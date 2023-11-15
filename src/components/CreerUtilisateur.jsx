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
export default function CreerUtilisateur() {
  //url du backend
  const baseUrl = "http://localhost:8000/api";
  // récupérer l'id du recensement a partir de l'url
  const { id } = useParams();
  //navigation  
  const navigate = useNavigate();
  // definition des state de l'application
  const [creer, setCreer] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [utilisateurCreer, setUtilisateurCreer] = useState(false);
  const [erreur, setErreur] = useState(false);

  //pour effectuer la creation dans la base de données
  const creerUtilisateur=async(e)=>{
    e.preventDefault();
    await axios.request({
      url: `${baseUrl}/creerUtilisateur/`,
      method:"POST",
      data: {
        name: name,
        email: email,
        password: password,
      },            
    })
    .then(res=>{
      if(res.status===200){setUtilisateurCreer(true);}
    })
    .catch(err=>{setErreur(true)})
  }
  //fermer la fenetre
  const fermerFenetre=()=>{
    setCreer(false);
    navigate(`/listerUtilisateur`);
  }
  return (
    <>
    <Dialog 
    open={creer}//la boite de dialogie s'ouvre quand creer==true
    >
    <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre} sx={{ color: 'black' }}>
    Créer un nouvel utilisateur
    </BootstrapDialogTitle>
    <DialogContent dividers>
      <form onSubmit={creerUtilisateur} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "500px", maxWidth: "md", height: "400px", maxHeight: "md", marginTop:20 }}>
        <FormLabel>Nom</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel>Adresse mail</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          type='email'
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel>Mot de passe</FormLabel>
        <TextField
          id="standard-required"
          variant="standard"
          type='password'
          required
          onChange={(e) => setPassword(e.target.value)}
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
          Créer
        </Button>

        </Box>
      </form>
    </DialogContent>
    </Dialog>
      {utilisateurCreer && (
      <div>
        <Dialog
          open={utilisateurCreer}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Succès</DialogTitle>
          <DialogContent sx={{marginTop:6}}>
            <DialogContentText id="alert-dialog-description">
              Utilisateur créé avec succès
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => { setUtilisateurCreer(false); navigate('/listerUtilisateur') }} autoFocus sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
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
          <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#f44336', color: 'white' }}>Erreur</DialogTitle>
          <DialogContent sx={{marginTop:6}}>
            <DialogContentText id="alert-dialog-description">
              Il y a une erreur pendant la création de l'utilisateur
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => {setErreur(false);navigate('/listerUtilisateur')}} autoFocus autoFocus sx={{ backgroundColor: '#f44336', color: 'white' }}>
            OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}

  </>
  )
}
