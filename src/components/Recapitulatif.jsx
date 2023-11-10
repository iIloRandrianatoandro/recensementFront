import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import {FormLabel} from "@mui/material";
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';

export default function Recapitulatif() {
    // base url backend
    const baseUrl = 'http://localhost:8000/api';
    const [annee, setAnnee] = useState();
    const [anneeExistante, setAnneeExistante] = useState([]);
    const [nbTotalMateriels, setNbTotalMateriels] = useState(0);
    const [valeurTotaleMateriels, setValeurTotaleMateriels] = useState(0);
    const [nbArticleExcedent, setNbArticleExcedent] = useState(0);
    const [nbArticleDeficit, setNbArticleDeficit] = useState();


    const handleChange = (event) => {
        setAnnee(event.target.value);
    };
    useEffect(()=>{
        //recuperer liste des annees avec recensement
        const getAnneeExistante = async () => {
          await axios.get(`${baseUrl}/listerAnneeAvecRecensement`)
          .then(res => { 
            setAnneeExistante(res.data); 
            const longueur=res.data.length-1;
            //console.log(longueur)
            setAnnee(res.data[longueur])
          })
          .catch(err => console.log(err));
        }
        getAnneeExistante()
    },[])
    useEffect(()=>{
          //recuperer donnees recapitulatif
          const getRecapitulatif = async () => {
              await axios.get(`${baseUrl}/genererRecapitulatif`)
              .then(res => { 
                console.log(res.data); 
                setNbTotalMateriels(res.data.nbArticleTotal["totalArticles"]);
                setValeurTotaleMateriels(res.data.valeurTotaleExistant["totalExistant"])
                setNbArticleDeficit(res.data.nbArticleAvecDeficit) 
                setNbArticleDeficit(res.data.nbArticleAvecExcedent) 
              })
              .catch(err => console.log(err));
            }
          getRecapitulatif()
        },[])
  return (
    <>
      <InputLabel id="demo-simple-select-label">Annee</InputLabel>
        {anneeExistante.length > 0 && (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={annee}
            label="Age"
            onChange={handleChange}
          >
            {anneeExistante.map((anneeItem) => (
              <MenuItem value={anneeItem} key={anneeItem}>
                {anneeItem}
              </MenuItem>
            ))}
          </Select>
        )}
        <FormControl>
          <FormLabel>Nombre total des matériels</FormLabel>
          <TextField
            id="standard-required"
            variant="standard"
            value={nbTotalMateriels}
            disabled={true}
          />
          <FormLabel>Valeur totale des matériels</FormLabel>
          <TextField
            id="standard-required"
            variant="standard"
            value={valeurTotaleMateriels}
            disabled={true}
          />
          <FormLabel>Nombre de matériels ayant de excedent</FormLabel>
          <TextField
            id="standard-required"
            variant="standard"
            value={nbArticleExcedent}
            disabled={true}
          />
          <FormLabel>Nombre de matériels ayant de déficit</FormLabel>
          <TextField
            id="standard-required"
            variant="standard"
            value={nbArticleDeficit}
            disabled={true}
          />
        </FormControl>
    </>
  )
}
