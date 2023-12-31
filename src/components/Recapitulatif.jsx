import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import {Box, FormLabel} from "@mui/material";
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
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

export default function Recapitulatif() {
    // base url backend
    const baseUrl = 'http://localhost:8000/api';
    //navigation
    const navigate = useNavigate();

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
    const [valeurTotaleExcedent, setValeurTotaleExcedent] = useState(0);
    const [valeurTotaleDeficit, setValeurTotaleDeficit] = useState(0);

    //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 
  const [rows , setRows ] = useState([]);
  
  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
  //deuxieme tableau
  const [rows2 , setRows2 ] = useState([]);

  //titre des colonnes du premie tableau des recensements
  const columns = [
    { field: 'designation', headerName: 'Désignation',width:350,renderCell: (params) => ( <div style={{ whiteSpace: 'pre-line',height:'auto' }}> {params.value}</div>),  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'especeUnite', headerName: 'Espèce unite', width:70,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Espèce unite'}</div>), sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'prixUnite', headerName: 'Prix unitaire', width:120, filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'existantApresEcriture', headerName: 'Existant apres écriture', width:70,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Existant apres écriture'}</div>),  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'deficitParArticle', headerName: 'Déficit par article',width:60,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Déficit par article'}</div>),  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurDeficit', headerName: 'Valeur des déficits',width:120,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Valeur des déficits'}</div>),  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'excedentParArticle', headerName: 'Excedent apres écriture', width:78,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Excédent par article'}</div>), filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExcedent', headerName: 'Valeur des excédents', width:120,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Valeur des excédents'}</div>), filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'constateesParRecensement', headerName: 'Constatés par recensement',  width:110,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Constatés par recensement'}</div>), filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExistant', headerName: 'Valeur des existants', width:120,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Valeur des existants'}</div>),  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'observation', headerName: 'Observation',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },{
      field: 'recenser',
      headerName: '',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      hideable: false,
      columnManageable: false,
      renderCell: (params) => ( 
        <Button
          variant="contained"
          color="primary"
          onClick={() => modifierRecensement(params.row.idRecensement)}
        >
          Modifier
        </Button>
      ),
    },
    
  ];
  //recenser un matériel
  const modifierRecensement = (id) => {
    navigate(`/modifierRecensement/${id}`);
  };
  //titre des colonnes du premie tableau des recensements
  const columns2 = [
    { field: 'nomenclature', headerName: 'Nomenclature',width:112,  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExcedent', headerName: 'Excedent',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurDeficit', headerName: 'Deficit',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'valeurExistant', headerName: 'Existant',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'nbArticle', headerName: 'Article',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
        
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
          //console.log(res.data); 
          setNbTotalMateriels(res.data.nbArticleTotal["totalArticles"]);
          setValeurTotaleMateriels(res.data.valeurTotaleExistant["totalExistant"])
          setValeurTotaleDeficit(res.data.valeurTotaleDeficit["totalDeficit"]) 
          setValeurTotaleExcedent(res.data.valeurTotaleExcedent["totalExcedent"]) 
          setNbArticleDeficit(res.data.nbArticleAvecDeficit) 
          setNbArticleExcedent(res.data.nbArticleAvecExcedent) 
          //console.log(res.data.nomenclatures)
          const nomenclatures = res.data.nomenclatures.map(element => element["nomenclature"]);
          setNomenclature(nomenclatures);
          setListeRecensementsTab(res.data.listeRecensementsTab); 
          setRows(res.data.recensementParNomenclature["3"]);
          //console.log(res.data.recapParNomenclature)
          //console.log(annee)
          setRows2(res.data.recapParNomenclature)
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
  // recuperer les materiel ayant les caractere saisis dans la zone de recherche
  const filterMateriel = (texte) => {
    const donneesFiltrees = listeRecensementsTab.filter((row) =>
      ((row.designation.toLowerCase().includes(texte.toLowerCase()))&&(row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)))
    );
    setRows(donneesFiltrees);
  };

  const handleSearchInputChange = (e) => {
    e.preventDefault();
      filterMateriel(e.target.value);
  };
  const genererExcel = async () => {
    try {
      const response = await axios.get(`${baseUrl}/export/${annee}`, {
        responseType: 'blob', // Indique à Axios de traiter la réponse comme un Blob (fichier)
      });

      // Créez un lien de téléchargement pour le fichier Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'recensement.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de la génération du fichier Excel', error);
    }
  };
  return (
    <>
      <NavBarAdmin titre="Récapitulatif annuel"></NavBarAdmin>
      <Box  style={{ marginLeft: 250,marginTop: 115 }} >{/* body */}
        <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" style={{ marginBottom: 20, marginTop:100 }}>
          <Box>{/* recap */}
            <Box  >{/* annee */}
              <InputLabel id="demo-simple-select-label">Annee</InputLabel>{/* annee */}
                <Box>
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
                </Box>
            </Box>
            <Box>{/* formulaire */}
              <FormControl>
                <FormLabel>Nombre total des matériels</FormLabel>
                <TextField
                  id="standard-required"
                  variant="standard"
                  value={nbTotalMateriels}
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
                <FormLabel>Valeur totale des excédents</FormLabel>
                <TextField
                  id="standard-required"
                  variant="standard"
                  value={valeurTotaleExcedent}
                  disabled={true}
                />
                <FormLabel>Valeur totale des déficits</FormLabel>
                <TextField
                  id="standard-required"
                  variant="standard"
                  value={valeurTotaleDeficit}
                  disabled={true}
                />
              </FormControl>
            </Box>
          </Box>
          <Box>{/* tableau par nomenclature et bouton generer excel*/}
                <Box  style={{ marginBottom: 20}}>{/* generer excel */}
                  <Button
                    variant="contained"
                    color="primary" 
                    onClick={() => genererExcel(annee)}
                  >
                      Générer un fichier Excel
                  </Button>    
                </Box>
            <DataGrid sx={{ height: 'auto', width: '100%' }}
              rows={rows2}
              columns={columns2}
              getRowId={(row) => row.nomenclature}
              hideFooter
            />
          </Box>
        </Box>
        <Box>{/* liste tous les materiels*/}
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" >{/* recherche et radiogroup */}
            <div id="search" style={{ marginBottom: 20 }}>{/* recherche */}
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
            <Box>{/*radiogroup */}
              {nomenclature.length > 0 && (
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
            </Box>
          </Box>
          <Box>{/* datagrid*/}
            <DataGrid  sx={{ height: 600, width: '100%' }}
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
        </Box>
      </Box>
    </>
  )
}
