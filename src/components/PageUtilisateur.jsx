import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

const columns = [
  { field: 'nomenclature', headerName: 'Nomenclature', width: 150, sortable: false, filterable: true, hideable: false, columnManageable: false },
  { field: 'designation', headerName: 'Désignation', width: 150, sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
  { field: 'existantApresEcriture', headerName: 'Existant apres écriture', width: 150, filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
  { field: 'Column 2', headerName: 'recenser', width: 150, filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
];

export default function App() {
  const baseUrl = 'http://localhost:8000/api';
  const [listematerielsARecenser, setListeMaterielsARecenser] = useState([]);
  const [filteredMateriel, setFilteredMateriel] = useState([]);
  const [searchText, setSearchText] = useState(""); // État pour la valeur de recherche
  

  useEffect(() => {
    getListeMaterielsARecenser();
    console.log(listematerielsARecenser);
  }, []);

  const getListeMaterielsARecenser = async () => {
    const annee = 2023;
    await axios.get(`${baseUrl}/listeMaterielARecense/${annee}`)
      .then(res => { setListeMaterielsARecenser(res.data); setListeMaterielsARecenser(res.data);
        setFilteredMateriel(res.data);})
      .catch(err => console.log(err));
  }
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30); // Set the default page size to 30

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset the page to 1 when changing page size
  };
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.75),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
})); 
// Fonction pour mettre à jour les données filtrées en fonction de la recherche
const filterMateriel = (searchText) => {
  const filteredData = listematerielsARecenser.filter((row) =>
    row.designation.toLowerCase().includes(searchText.toLowerCase())
  );
  setFilteredMateriel(filteredData);
};

const handleSearchInputChange = (e) => {
  console.log(e.target.value)
  //console.log(e.target.value)
  //setSearchText(e.target.value);
  filterMateriel(e.target.value);
};
  return (
    <div style={{ height: 300, width: '100%' }}>
      <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "common.white" }} />
            </SearchIconWrapper>
            <StyledInputBase
          placeholder="Recherche…"
          inputProps={{ "aria-label": "recherche" }}
          sx={{ color: "common.white" }}
          //onChange={(e)=>console.log(e.target.value)}
          //value={searchText}
          //onChange={handleSearchInputChange}
          onKeyDown={async(e)=>{
            if (e.key==="Enter"){
              handleSearchInputChange(e)
            }
          }}
            />
          </Search>
          <DataGrid
  rows={filteredMateriel}
  columns={columns}
  getRowId={(row) => row.idRecensement}
  page={page}
  pageSize={pageSize}
  onPageChange={(newPage) => setPage(newPage)}
  pageSizeOptions={[30, 60, 100]}
  onPageSizeChange={handlePageSizeChange}
  locale="fr" // Correction ici
/>

    </div>
  );
}
