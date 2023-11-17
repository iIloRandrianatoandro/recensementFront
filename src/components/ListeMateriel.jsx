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
import NavBarAdmin from './NavBarAdmin';
import { Box, InputLabel } from '@mui/material';


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
export default function ListeMateriel() {
  //navigation
  const navigate = useNavigate();
  //titre des colonnes du tableau
  const columns = [
    { field: 'nomenclature', headerName: 'Nomenclature', width:112, sortable: false, filterable: false,disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'designation', headerName: 'Désignation',width:600,renderCell: (params) => ( <div style={{ whiteSpace: 'pre-line' }}> {params.value}</div>),  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    { field: 'especeUnite', headerName: 'Espèce unite', width:120,renderHeader: () => ( <div style={{ whiteSpace: 'pre-line', lineHeight: '1.3em'  }}> {'Espèce unite'}</div>), sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
    {
      field: 'modifier',
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
          onClick={() => modifierMateriel(params.row.idMateriel)}
        >
          Modifier
        </Button>
      ),
    },
  ];
  // base url backend
  const baseUrl = 'http://localhost:8000/api';

  //state à utiliser
  const [listemateriel, setListeMateriel] = useState([]);
  const [materielFilter, setMaterielFilter] = useState([]);
  const [nomenclature, setNomenclature] = useState([]);
  const [nomenclatureSelectionne, setNomenclatureSelectionne] = useState(3);
  

  const changerNomenclature=(e)=>{
    //console.log(e.target.value)
    setNomenclatureSelectionne(e.target.value)
  }
  useEffect(() => {
    getListeMateriel();
  }, []);
  // recuperer liste des materiels a recenser
  const getListeMateriel = async () => {
    await axios.get(`${baseUrl}/listeMateriel`)
    .then(res => { 
      console.log(res)
      setListeMateriel(res.data.listeMateriel); 
      setMaterielFilter(res.data.MaterielParNomenclature["3"]);
      const nomenclatures = res.data.nomenclatures.map(element => element["nomenclature"]);
      //console.log(nomenclatures)
      setNomenclature(nomenclatures);
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    //console.log(nomenclatureSelectionne)
    // recuperer les materiel ayant le nomenclature selectionnee
    const donneesFiltrees = listemateriel.filter((row) =>
        row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)
    );
    //console.log(donneesFiltrees)
    setMaterielFilter(donneesFiltrees)
  },[nomenclatureSelectionne])
  //modifier un matériel
  const modifierMateriel = (id) => {
    navigate(`/modifierMateriel/${id}`);
  };
  //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
  // recuperer les materiel ayant les caractere saisis dans la zone de recherche
  const filterMateriel = (texte) => {
    const donneesFiltrees = listemateriel.filter((row) =>
      ((row.designation.toLowerCase().includes(texte.toLowerCase()))&&(row.nomenclature.toLowerCase().includes(nomenclatureSelectionne)))
    );
    setMaterielFilter(donneesFiltrees);
  };
  const handleSearchInputChange = (e) => {
    e.preventDefault();
      filterMateriel(e.target.value);
  };
  return (
    <>
    <NavBarAdmin titre="Liste des matériels"></NavBarAdmin>
    <Box style={{ marginLeft: 300,marginTop: 130 }}>
    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around">{/* recherche et radiogroup */}
      <div id="search" style={{ marginBottom: 20, width:"300px" }}>
      <Search sx={{ width: 300, }}>
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
       <RadioGroup style={{ marginBottom: 20, width:"300px" }}
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
      <DataGrid sx={{ height: 500, width: '90%' }}
        rows={materielFilter}
        columns={columns}
        getRowId={(row) => row.idMateriel}
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
