import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from "@mui/material/Button";
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
const now = new Date();
const annee5 = now.getFullYear();
const annee4=annee5-1;
const annee3=annee5-2;
const annee2=annee5-3;
const annee1=annee5-4;
const xLabels = [
    annee1,
    annee2,
    annee3,
    annee4,
    annee5,
  ];
export default function Evolution() {
    //state utilisee par l'application
    const [quantite, setQuantite] = useState([0,0,0,0,0]);
    const [valeur, setValeur] = useState([0,0,0,0,0]);
    const [quantiteMateriel, setQuantiteMateriel] = useState([0,0,0,0,0]);
    const [valeurMateriel, setValeurMateriel] = useState([0,0,0,0,0]);
    const [afficherListe , setAfficherListe ] = useState(false);
    const [listemateriel, setListeMateriel] = useState([]);
    const [materielFilter, setMaterielFilter] = useState([]);
    const [afficherEvolutionMateriel , setAfficherEvolutionMateriel ] = useState(false);
    //state pagination
  const [page, setPage] = useState(1);
  const [nombreLigneParPage, setNombreLigneParPage] = useState(30); 

  const changerNombreLigneParPage = (newPageSize) => {
    setNombreLigneParPage(newPageSize);
    setPage(1); 
  };
    // base url backend
    const baseUrl = 'http://localhost:8000/api';
    useEffect(()=>{
        //recuperer evolution
        const getEvolution = async () => {
          await axios.get(`${baseUrl}/consulterEvolution5Ans`)
          .then(res => { 
            //console.log(res.data)
            //console.log(res.data.annee1Quantite[0]["count(idRecensement)"])
            const qtt1=[]
            if (res.data.annee1Quantite && res.data.annee1Quantite.length > 0) {
              qtt1.push(res.data.annee1Quantite[0]["quantite"]);
            } else {
              qtt1.push(0)
            }
            if (res.data.annee2Quantite && res.data.annee2Quantite.length > 0) {
              qtt1.push(res.data.annee2Quantite[0]["quantite"]);
            } else {
              qtt1.push(0)
            }
            if (res.data.annee3Quantite && res.data.annee3Quantite.length > 0) {
              qtt1.push(res.data.annee3Quantite[0]["quantite"]);
            } else {
              qtt1.push(0)
            }
            if (res.data.annee4Quantite && res.data.annee4Quantite.length > 0) {
              qtt1.push(res.data.annee4Quantite[0]["quantite"]);
            } else {
              qtt1.push(0)
            }
            if (res.data.annee5Quantite && res.data.annee5Quantite.length > 0) {
              qtt1.push(res.data.annee5Quantite[0]["quantite"]);
            } else {
              qtt1.push(0)
            }
          //console.log(qtt1)
          setQuantite(qtt1)
            const vlr=[]
            vlr.push(res.data.annee1Valeur[0]["valeur"])
            vlr.push(res.data.annee2Valeur[0]["valeur"])
            vlr.push(res.data.annee3Valeur[0]["valeur"])
            vlr.push(res.data.annee4Valeur[0]["valeur"])
            vlr.push(res.data.annee5Valeur[0]["valeur"])
            //console.log(vlr)
            setValeur(vlr)
          })
          .catch(err => console.log(err));
        }
        getEvolution()
    },[])
    useEffect(() => {
      getListeMateriel();
    }, []);
    // recuperer liste des materiels a recenser
    const getListeMateriel = async () => {
      await axios.get(`${baseUrl}/listeMateriel`)
      .then(res => { 
        //console.log(res)
        setListeMateriel(res.data.listeMateriel); 
        setMaterielFilter(res.data.listeMateriel);
      })
      .catch(err => console.log(err));
    }
    // recuperer les materiel ayant les caractere saisis dans la zone de recherche
    const filterMateriel = (texte) => {
      const donneesFiltrees = listemateriel.filter((row) =>
        (row.designation.toLowerCase().includes(texte.toLowerCase()))
      );
      setMaterielFilter(donneesFiltrees);
    };
    const handleSearchInputChange = (e) => {
      e.preventDefault();
      if(e.target.value===""){
        setAfficherListe(false)
        setAfficherEvolutionMateriel(false)
      }
      else{
        setAfficherListe(true)
      filterMateriel(e.target.value);
      }
      
    };
    //titre des colonnes du tableau
    const columns = [,
      { field: 'nomenclature', headerName: 'Nomenclature',  sortable: false, filterable: true, hideable: false, columnManageable: false },
      { field: 'designation', headerName: 'Désignation',  sortable: false, filterable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
      { field: 'especeUnite', headerName: 'Espèce unité',  filterable: false, sortable: false, disableColumnMenu: true, hideable: false, columnManageable: false },
      {
          field: 'choisir',
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
              onClick={() => evolutionMateriel(params.row.idMateriel)}
            >
              Choisir
            </Button>
          ),
        },
      
    ];
    //recenser un matériel
    const evolutionMateriel = (id) => {
      setAfficherListe(false)
      setAfficherEvolutionMateriel(true)
      console.log(id)
      const getEvolutionMateriel = async () => {
        await axios.get(`${baseUrl}/consulterEvolutionMateriel/${id}`)
        .then(res => { 
          console.log(res.data)
          const qtt1=[]
          if (res.data.annee1Quantite && res.data.annee1Quantite.length > 0) {
            qtt1.push(res.data.annee1Quantite[0]["quantite"]);
          } else {
            qtt1.push(0)
          }
          if (res.data.annee2Quantite && res.data.annee2Quantite.length > 0) {
            qtt1.push(res.data.annee2Quantite[0]["quantite"]);
          } else {
            qtt1.push(0)
          }
          if (res.data.annee3Quantite && res.data.annee3Quantite.length > 0) {
            qtt1.push(res.data.annee3Quantite[0]["quantite"]);
          } else {
            qtt1.push(0)
          }
          if (res.data.annee4Quantite && res.data.annee4Quantite.length > 0) {
            qtt1.push(res.data.annee4Quantite[0]["quantite"]);
          } else {
            qtt1.push(0)
          }
          if (res.data.annee5Quantite && res.data.annee5Quantite.length > 0) {
            qtt1.push(res.data.annee5Quantite[0]["quantite"]);
          } else {
            qtt1.push(0)
          }
        console.log(qtt1)
        setQuantiteMateriel(qtt1)
          const vlr1=[]
          vlr1.push(res.data.annee1Valeur[0]["valeur"])
          vlr1.push(res.data.annee2Valeur[0]["valeur"])
          vlr1.push(res.data.annee3Valeur[0]["valeur"])
          vlr1.push(res.data.annee4Valeur[0]["valeur"])
          vlr1.push(res.data.annee5Valeur[0]["valeur"])
          console.log(vlr1)
          setValeurMateriel(vlr1)
        })
        .catch(err => console.log(err));
      }
      getEvolutionMateriel()
    };
  return (
    <>
    <NavBarAdmin></NavBarAdmin>
    <BarChart
      width={500}
      height={300}
      series={[
        { data: quantite, label: 'Quantité', id: 'Quantite', yAxisKey: 'leftAxisId' },
        { data: valeur, label: 'Valeur', id: 'Valeur',yAxisKey: 'rightAxisId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
      rightAxis="rightAxisId"
    />
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
      {afficherListe && (
      <DataGrid
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
      )}
      {afficherEvolutionMateriel && (
      <BarChart
      width={500}
      height={300}
      series={[
        { data: quantiteMateriel, label: 'Quantité', id: 'Quantite', yAxisKey: 'leftAxisId' },
        { data: valeurMateriel, label: 'Valeur', id: 'Valeur',yAxisKey: 'rightAxisId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
      rightAxis="rightAxisId"

    />
      )}
    </>
  )
}
