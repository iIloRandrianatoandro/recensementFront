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
import { Box } from '@mui/system';

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
export default function ModifierRecensement() {//url du backend
    const baseUrl = "http://localhost:8000/api";
    // récupérer l'id du recensement a partir de l'url
    const { id } = useParams();
    //navigation  
    const navigate = useNavigate();
    // definition des state de l'application
    const [modifier, setModifier] = useState(true);
    const [designation, setDesignation] = useState("");
    const [existantApresEcriture, setExistantApresEcriture] = useState("");
    const [deficitPartArticle, setDeficitPartArticle] = useState(0);
    const [excedentParArticle, setExcedentParArticle] = useState(0);
    const [observation, setObservation] = useState("");
    const [modificationEffectuer, setModificationEffectuer] = useState(false);
    const [erreur, setErreur] = useState(false);
    //pour effectuer le recensement dans la base de données
  const modifierRecensement=async(e)=>{
    e.preventDefault();
    await axios.request({
      url: `${baseUrl}/modifierRecensement/${id}`,
      method:"POST",
      data: {
        deficitParArticle: deficitPartArticle,
        excedentParArticle: excedentParArticle,
        observation: observation,
      },            
    })
    .then(res=>{
      if(res.status===200){setModificationEffectuer(true);}
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
    setModifier(false);
    navigate(`/recapitulatif`);
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
    open={modifier}//la boite de dialogie s'ouvre quand recenser==true
    >
    <BootstrapDialogTitle id="customized-dialog-title" onClose={fermerFenetre} sx={{ color: 'black' }}>
    Modifier le recensement
    </BootstrapDialogTitle>
    <DialogContent dividers>
      <form onSubmit={modifierRecensement} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "500px", maxWidth: "md"}}>
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
        <Box style={{ display: "flex", flexDirection: "row", gap: "10px",marginTop:10}}>
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
    {modificationEffectuer && (
      <div>
        <Dialog
          open={modificationEffectuer}
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
            <Button onClick={() => {setModificationEffectuer(false);navigate('/recapitulatif')}} autoFocus>
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
          <DialogTitle id="alert-dialog-title" sx={{color:"red"}}>Erreur</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Il y a une erreur pendant la modification du recensement
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setErreur(false);navigate('/recapitulatif')}} autoFocus>
            OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}
    </>
  )
}
