import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import NavBarUtilisateur from "./NavBarUtilisateur";
import {Box} from "@mui/material";


export default function App() {
  //navigation
  const navigate = useNavigate();
  //titre des colonnes du tableau
  const columns = [
    { field: 'nomenclature', headerName: 'Nomenclature',  sortable: false, filterable: true, hideable: false, columnManageable: false },
    { field: 'designation', headerName: 'Désignation',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'existantApresEcriture', headerName: 'Existant apres écriture',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    {
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
          onClick={() => RecenserMateriel(params.row.idRecensement)}
        >
          Recenser
        </Button>
      ),
    },
  ];
  //recenser un matériel
  const RecenserMateriel = (id) => {
    navigate(`/recenserMateriel/${id}`);
  };
  // base url backend
  const baseUrl = 'http://localhost:8000/api';

  //state à utiliser
  const [listematerielsARecenser, setListeMaterielsARecenser] = useState([]);
  const [materielFilter, setMaterielFilter] = useState([]);
  const [nomenclature, setNomenclature] = useState([]);
  const [nomenclatureSelectionne, setNomenclatureSelectionne] = useState(3);
  

    const changerNomenclature=(e)=>{
      //console.log(e.target.value)
      setNomenclatureSelectionne(e.target.value)
  }
  useEffect(() => {
    getListeMaterielsARecenser();
  }, []);
  // recuperer liste des materiels a recenser
  const getListeMaterielsARecenser = async () => {
    const now = new Date();
    const annee = now.getFullYear();
    await axios.get(`${baseUrl}/listeMaterielARecense/${annee}`)
    .then(res => { 
      setListeMaterielsARecenser(res.data.listeMaterielARecense); 
      //setMaterielFilter(res.data.listeMaterielARecense);
      const nomenclatures = res.data.nomenclatures.map(element => element["nomenclature"]);
      setNomenclature(nomenclatures);
      setMaterielFilter(res.data.recensementParNomenclature["3"]);
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    //console.log(nomenclatureSelectionne)
    // recuperer les materiel ayant le nomenclature selectionnee
    const donneesFiltrees = listematerielsARecenser.filter((row) =>
        row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)
    );
    //console.log(donneesFiltrees)
    setMaterielFilter(donneesFiltrees)
  },[nomenclatureSelectionne])
  //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
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
  // recuperer les materiel ayant les caractere saisis dans la zone de recherche
  const filterMateriel = (texte) => {
    const donneesFiltrees = listematerielsARecenser.filter((row) =>
      ((row.designation.toLowerCase().includes(texte.toLowerCase()))&&(row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)))
    );
    setMaterielFilter(donneesFiltrees);
  };

  const handleSearchInputChange = (e) => {
    e.preventDefault();
    if(e.target.value===""){
      setMaterielFilter(listematerielsARecenser)
    }
    else{
      filterMateriel(e.target.value);
    }
  };

  return (<>
    <NavBarUtilisateur></NavBarUtilisateur>
      <Box  style={{ marginLeft: 100,marginTop: 180 }} >{/* body */}
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around">{/* recherche et radiogroup */}
      <div id="search" style={{ marginBottom: 20, width:200 }} >
        <Search sx={{ width: 20, }} ></Search>
      <Search>
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
      <DataGrid sx={{ height: 450, width: '80%' }}
        rows={materielFilter}
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
  );
}
