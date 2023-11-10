import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import {FormLabel} from "@mui/material";
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid } from '@mui/x-data-grid';

export default function Recapitulatif() {
    // base url backend
    const baseUrl = 'http://localhost:8000/api';
    const now = new Date();
    const anneeactuelle = now.getFullYear();
    const [annee, setAnnee] = useState(anneeactuelle);
    const [anneeExistante, setAnneeExistante] = useState([]);
    const [nbTotalMateriels, setNbTotalMateriels] = useState(0);
    const [valeurTotaleMateriels, setValeurTotaleMateriels] = useState(0);
    const [nbArticleExcedent, setNbArticleExcedent] = useState(0);
    const [nbArticleDeficit, setNbArticleDeficit] = useState();
    const [nomenclature, setNomenclature] = useState([]);
    const [nomenclatureSelectionne, setNomenclatureSelectionne] = useState(3);
    const [listeRecensementsTab, setListeRecensementsTab] = useState([]);

    //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 
  const [rows , setRows ] = useState([]);

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
  //titre des colonnes du tableau
  const columns = [
    { field: 'designation', headerName: 'Désignation',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'especeUnite', headerName: 'Espèce unite',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'prixUnite', headerName: 'Prix unitaire',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'existantApresEcriture', headerName: 'Existant apres écriture',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'deficitParArticle', headerName: 'Déficit par article',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurDeficit', headerName: 'Valeur des déficits',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'excedentParArticle', headerName: 'Excedent apres écriture',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExcedent', headerName: 'Valeur des excédents',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'constateesParRecensement', headerName: 'Constatés par recensement',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExistant', headerName: 'Valeur des existants',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'observation', headerName: 'Observation',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    
  ];

    const handleChange = (event) => {
        setAnnee(event.target.value);
    };
    const changerNomenclature=(e)=>{
        //console.log(e.target.value)
        setNomenclatureSelectionne(e.target.value)
    }
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
    //recuperer donnees recapitulatif
    const getRecapitulatif = async () => {
        await axios.request({
          url: `${baseUrl}/genererRecapitulatif`,
          method:"POST",
          data: {
            annee: annee,
          },            
        })
        .then(res => { 
          console.log(res.data); 
          setNbTotalMateriels(res.data.nbArticleTotal["totalArticles"]);
          setValeurTotaleMateriels(res.data.valeurTotaleExistant["totalExistant"])
          setNbArticleDeficit(res.data.nbArticleAvecDeficit) 
          setNbArticleExcedent(res.data.nbArticleAvecExcedent) 
          //console.log(res.data.nomenclatures)
          const nomenclatures = res.data.nomenclatures.map(element => element["nomenclature"]);
          setNomenclature(nomenclatures);
          setListeRecensementsTab(res.data.listeRecensementsTab); 
          setRows(res.data.recensementParNomenclature["3"]);
        })
        .catch(err => console.log(err));
      }
    useEffect(()=>{
          getRecapitulatif()
        },[])
        useEffect(()=>{
              getRecapitulatif()
            },[annee])
  useEffect(()=>{
    //console.log(nomenclatureSelectionne)
    // recuperer les materiel ayant le nomenclature selectionnee
    const donneesFiltrees = listeRecensementsTab.filter((row) =>
        row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)
    );
    //console.log(donneesFiltrees)
    setRows(donneesFiltrees)
  },[nomenclatureSelectionne])
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
        </FormControl>{nomenclature.length > 0 && (
       <RadioGroup
       row
       aria-labelledby="demo-row-radio-buttons-group-label"
       name="row-radio-buttons-group"
       value={nomenclatureSelectionne}
       onChange={changerNomenclature}
     >
       {nomenclature.map((nomenclatureItem) => (
         <FormControlLabel
           value={nomenclatureItem}
           key={nomenclatureItem}
           control={<Radio />}
           label={nomenclatureItem}
         />
       ))}
     </RadioGroup>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.idRecensement}
        page={page}
        pageSize={nombreLigneParPage}
        onPageChange={(newPage) => setPage(newPage)}
        pageSizeOptions={[30, 60, 100]}
        onPageSizeChange={changerNombreLigneParPage}
        locale="fr" // Correction ici
      />
    </>
  )
}
