import React from 'react'
import {
    Dialog,
    DialogContent,
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

//axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');




  //composant pour mettre le titre de la boite de dialogue
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
    const baseUrl = "http://localhost:8000/api";
    // récupérer l'id du recensement a partir de l'url
    const { id } = useParams();
    
    const navigate = useNavigate();
    const [recenser, setRecenser] = useState(true);
    const [designation, setDesignation] = useState("");
    const [existantApresEcriture, setExistantApresEcriture] = useState("");
    const [deficitPartArticle, setDeficitPartArticle] = useState(0);
    const [excedentParArticle, setExcedentParArticle] = useState(0);
    const [observation, setObservation] = useState("");

    const recenserMateriel=async(e)=>{
        e.preventDefault();
        console.log(deficitPartArticle)
        console.log(excedentParArticle)
        console.log(observation)
        await axios.request({
            //const response = await axios.get();
            url: `${baseUrl}/recenserMateriel/${id}`,
            method:"POST",
            data: {
                deficitParArticle: deficitPartArticle,
                excedentParArticle: excedentParArticle,
                observation: observation,
            },
            
          })
          .then(res=>{alert(res)})//,navigate('/liste')
          .catch(err=>alert(err))
    }
    const remplirDeficit = (event) => {
        const value = event.target.value;
        setDeficitPartArticle(value);
    
        // Désactive le Field2 si Field1 a une valeur
        if (value) {
          setExcedentParArticle(0);
        }
      };
    
      const remplirExcedent = (event) => {
        const value = event.target.value;
        setExcedentParArticle(value);
    
        // Désactive le Field1 si Field2 a une valeur
        if (value) {
            setDeficitPartArticle(0);
        }
      };
    const fermerFenetre=()=>{
        setRecenser(false);
        navigate(`/`);
    }
    useEffect(()=>{
        const getRecensementById=async()=>{
            const response = await axios.get(`${baseUrl}/voirRecensement/${id}`);
            const recensement= response.data[0]
            console.log(recensement)
            setDesignation(recensement.designation);
            setExistantApresEcriture(recensement.existantApresEcriture)
        };
        getRecensementById();
    },[id])
  return (
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
                //onChange={(e) => setDeficitPartArticle(e.target.value)}
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
                //onChange={(e) => setExcedentParArticle(e.target.value)}
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
  )
}
