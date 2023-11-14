import React from 'react'
import {Box, FormLabel} from "@mui/material";
import { FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import axios from "axios";
import NavBarAdmin from './NavBarAdmin';


  //composant pour la recherche
  //div
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.75),
    },
  }));
  //icone
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  //zone de texte
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    " & .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
  })); 

export default function SuivreFlux() {
    //titre des colonnes du tableau
  const columns = [
    { field: 'recense', headerName: 'Recense',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'nomenclature', headerName: 'Nomenclature',  sortable: false, filterable: true, hideable: false, columnManageable: false },
    { field: 'designation', headerName: 'Désignation',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'existantApresEcriture', headerName: 'Existant apres écriture',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'deficitParArticle', headerName: 'Déficit par article',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'excedentParArticle', headerName: 'Excedent apres écriture',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'prixUnite', headerName: 'Prix unitaire',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'observation', headerName: 'Observation',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    
  ];
    //url du backend
  const baseUrl = "http://localhost:8000/api";
  //navigation  
  const navigate = useNavigate();
  // definition des state de l'application
  const [nbTotalMateriels, setNbTotalMateriels] = useState(0);
  const [nbMaterielsRecenses, setNbMaterielsRecenses] = useState(0);
  const [nbMaterielsARecenser, setNbMaterielsARecenser] = useState(0);
  const [listeMateriel, setListeMateriel] = useState([]);
  const [listeMaterielRecense, setListeMaterielRecense] = useState([]);
  const [listeMaterielARecense, setListeMaterielARecense] = useState([]);
  const [typeListe, setTypeListe] = useState('listeMateriel');
  const [rows , setRows ] = useState([]);
  //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
  const changerTypeListe = (event) => {
    setTypeListe(event.target.value);
    
  };
  //recuperer les flux venant de la base de donnees
  const getFlux=async()=>{
    const response = await axios.get(`${baseUrl}/suivreFluxRecensement`);
    //console.log(response.data.nbTotalMateriels[0][Object.keys(response.data.nbTotalMateriels[0])[0]])
    setNbTotalMateriels(response.data.nbTotalMateriels[0][Object.keys(response.data.nbTotalMateriels[0])[0]])
    setNbMaterielsRecenses(response.data.nbMaterielsRecenses[0][Object.keys(response.data.nbMaterielsRecenses[0])[0]])
    setNbMaterielsARecenser(response.data.nbMaterielsARecenser[0][Object.keys(response.data.nbMaterielsARecenser[0])[0]])
    //console.log(response.data.listeMateriel)
    setListeMateriel(response.data.listeMateriel)
    setListeMaterielRecense(response.data.listeMaterielRecense)
    setListeMaterielARecense(response.data.listeMaterielARecense)
  };
  //lors du montage initial du composant
  useEffect(()=>{
    getFlux()
    setRows(listeMateriel)
  },[]); //[] vide pour dire que le code est exécuter lors du premier montage

  useEffect(()=>{
    //getFlux();
    //console.log(typeListe)
    if(typeListe==="listeMateriel"){
        setRows(listeMateriel)
    }
    else if(typeListe==="listeMaterielRecense"){
        setRows(listeMaterielRecense)
    }
    else if(typeListe==="listeMaterielARecense"){
        setRows(listeMaterielARecense)
    }
  },[typeListe,listeMateriel,listeMaterielARecense,listeMaterielRecense])
  // recuperer les materiel ayant les caractere saisis dans la zone de recherche
  const filterMateriel = (texte) => {
    const donneesFiltrees = rows.filter((row) =>
      row.designation.toLowerCase().includes(texte.toLowerCase())
    );
    //setMaterielFilter(donneesFiltrees);
    setRows(donneesFiltrees)
  };

  const handleSearchInputChange = (e) => {
    if(e.target.value===""){
      if(typeListe==="listeMateriel"){
        setRows(listeMateriel)
      }
      else if(typeListe==="listeMaterielRecense"){
        setRows(listeMaterielRecense)
      }
      else if(typeListe==="listeMaterielARecense"){
        setRows(listeMaterielARecense)
      }
    }
    else{
      filterMateriel(e.target.value);
    }
    
  };
  return (
    <>
    <NavBarAdmin></NavBarAdmin>
      <Box  style={{ marginLeft: 250,marginTop: 115 }} >{/* body */}
    <FormControl style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <FormLabel>Nombre total des matériels</FormLabel>
      <TextField
        id="standard-required"
        variant="standard"
        value={nbTotalMateriels}
        disabled={true}
      />
    </Box>
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <FormLabel>Nombre des matériels déjà recensés</FormLabel>
      <TextField
        id="standard-required"
        variant="standard"
        value={nbMaterielsRecenses}
        disabled={true}
      />
    </Box>
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <FormLabel>Nombre des matériels qui restent à recenser</FormLabel>
      <TextField
        id="standard-required"
        variant="standard"
        value={nbMaterielsARecenser}
        disabled={true}
      />
    </Box>
  </FormControl>
  
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={typeListe}
        onChange={changerTypeListe}
      >
        <FormControlLabel value="listeMateriel" control={<Radio />} label="Tous les matériels " />
        <FormControlLabel value="listeMaterielRecense" control={<Radio />} label="Materiels recensés" />
        <FormControlLabel value="listeMaterielARecense" control={<Radio />} label="Matériels à recenser" />
      </RadioGroup>
      <div id="search" style={{ marginBottom: 20 }}>
        <Search sx={{ width: 300, }} >
          <SearchIconWrapper>
            <SearchIcon sx={{ color: "common.white" }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Recherche…"
            inputProps={{ "aria-label": "recherche" }}
            sx={{ color: "common.white" }}
            onKeyDown={async(e)=>{
              if (e.key==="Enter"){
                handleSearchInputChange(e)
              }
            }}
          />
        </Search>
      </div>
      <DataGrid  sx={{ height: 500, width: '100%' }}
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
      </Box>
    </>
  )
}
