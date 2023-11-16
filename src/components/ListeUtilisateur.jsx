import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button, FormLabel
  } from "@mui/material";
import NavBarAdmin from './NavBarAdmin';
import { Box } from '@mui/material';


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
export default function ListeUtilisateur() {
  //navigation
  const navigate = useNavigate();
  //titre des colonnes du tableau
  const columns = [
    { field: 'name', headerName: 'Nom',  sortable: false, filterable: false, disableColumnMenu: true,hideable: false, columnManageable: false },
    { field: 'email', headerName: 'Mail',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
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
          onClick={() => modifierUtilisateur(params.row.id)}
        >
          Modifier
        </Button>
      ),
    },
    {
      field: 'supprimer',
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
          onClick={() => demanderConfirmation(params.row.id)}
        >
          Supprimer
        </Button>
      ),
    },
  ];
  // base url backend
  const baseUrl = 'http://localhost:8000/api';
  //state à utiliser
  const [listeUtilisateur, setListeUtilisateur] = useState([]);
  const [utilisateurFilter, setUtilisateurFilter] = useState([]);
  const [erreur, setErreur] = useState(false);
  const [suppressionEffectuee, setSuppressionEffectue] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [id, setID] = useState();

  
  //modifier un utilisateur
  const modifierUtilisateur = (id) => {
    navigate(`/modifierUtilisateur/${id}`);
  };
  //supprimer un utilisateur
  const supprimerUtilisateur = async() => {
    //console.log(id)
    await axios.request({
     // url: `${baseUrl}/supprimerUtilisateur/${id}`,
      url: `${baseUrl}/supprimerUtilisateur/${id}`,
      method:"POST",
    })
    .then(res=>{
      if(res.status===200){setSuppressionEffectue(true);}
    })
    .catch(err=>{setErreur(true);console.log(err)})
  };
  //demander confirmation suppresion utilisateur
  const demanderConfirmation = (id) => {
    setConfirme(true)
    //console.log(id)
      setID(id)
  };
  //annuler suppression 
  const annulerSuppression =async(e)=>{
    e.preventDefault();
    setConfirme(false)
  };
  //succes suppression
    const succes =async(e)=>{
      e.preventDefault();
      setSuppressionEffectue(false)
      setConfirme(false)
      navigate('/listerUtilisateur')
    }
  useEffect(() => {
    getListeUtilisateur();
  }, []);
  useEffect(() => {
    getListeUtilisateur();
  }, [suppressionEffectuee]);
  // recuperer liste des materiels a recenser
  const getListeUtilisateur = async () => {
    await axios.get(`${baseUrl}/listerUtilisateur`)
    .then(res => { 
      //console.log(res.data)
      setListeUtilisateur(res.data); 
      setUtilisateurFilter(res.data);
    })
    .catch(err => console.log(err));
  }
  //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
  // recuperer les utilisateurs ayant les caractere saisis dans la zone de recherche
  const filtrerUtilisateur = (texte) => {
    const donneesFiltrees = listeUtilisateur.filter((row) =>
      (row.name.toLowerCase().includes(texte.toLowerCase()))
    );
    setUtilisateurFilter(donneesFiltrees);
  };
  const handleSearchInputChange = (e) => {
    e.preventDefault();
      filtrerUtilisateur(e.target.value);
  };
  return (
    <> 
    <NavBarAdmin titre="Liste des utilisateurs"></NavBarAdmin>
    <Box style={{marginLeft: 300,marginTop: 130 }}>
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" >
    
      <div id="search" style={{ marginBottom: 20,marginRight: 'auto'  }}>
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
      <Button
    style={{ marginBottom: 20,marginRight: 'auto'  }}
      variant="contained"
      color="primary"
      onClick={() => navigate('/creerUtilisateur')}
    >
      Créer un nouvel Utilisateur
    </Button>
      </Box>
      <DataGrid sx={{ height: 500, width: '80%' }}
        rows={utilisateurFilter}
        columns={columns}
        getRowId={(row) => row.id}
        page={page}
        pageSize={nombreLigneParPage}
        onPageChange={(newPage) => setPage(newPage)}
        pageSizeOptions={[30, 60, 100]}
        onPageSizeChange={changerNombreLigneParPage}
        locale="fr" // Correction ici
      />
      {suppressionEffectuee && (
      <div>
        <Dialog
          open={suppressionEffectuee}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Succès</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Suppression effectuée avec succès
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={succes} autoFocus>
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
          <DialogTitle id="alert-dialog-title">Erreur</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Il y a une erreur pendant la suppression'
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setErreur(false);setConfirme(false);navigate('/listerUtilisateur')}} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}
      {confirme && ( //boite de dialogue confirmation suppression
      <div>
        <Dialog
          open={confirme}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Voulez vous vraiment supprimer l'utilisateur
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={supprimerUtilisateur} autoFocus>
              OK
            </Button>
            <Button onClick={annulerSuppression} autoFocus>
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      )}
      </Box>
    </>
  )
}
