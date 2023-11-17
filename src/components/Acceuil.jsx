import React, { useState, useEffect } from "react";
import {
  Button,
} from "@mui/material";
import SeConnecter from "./SeConnecter";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "../style/NavBarUtilisateur.scss";
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import { motion } from "framer-motion";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import "../style/Acceuil.scss";

export default function Acceuil() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const seConnecter = async (e) => {
    e.preventDefault();
    setPage(1)
  };
  return (
    <>
    <div id="acceuil" style={{height:"100vh"}}>
      {page === 0 && (
        <div id="first">
           <AppBar id="navbar" position="fixed" sx={{ opacity:1, bgcolor: "common.white", boxShadow: 'none',borderBottom: '2px solid #ccc'}}>
        <Toolbar>
        <div id="logo">
          <img src="/images/fop.jpg" alt="logo" />
        </div>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, ml: 2, color: "primary.main", fontWeight: "bold" }}
        >
          Ministère du Travail, de l'Emploi, de la Fonction Publique et des Lois Sociales
        </Typography>
        <Box sx={{ flexGrow: 0}}>
        <Tooltip title="Se connecter">
              <IconButton onClick={seConnecter} sx={{ p: 0 }}>
               <Typography>Se connecter</Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
    </AppBar>
    <motion.Box
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            >
            <Box _id="texte" sx={{marginTop:35, marginLeft:25,width:600,display:"flex",flexDirection:"column"}}>
            
              <Typography variant="h5" sx={{color: "primary.main",}}>
                Bienvenue, 
              </Typography>
              <Typography variant="h4">
                  Recensement et Comptabilité des Matériels du Ministère.
              </Typography>
              <Typography variant="h6">
                La platforme dédiée pour simplifier et faciliter le processus de recensement et d'améliorer l'efficacité.
              </Typography>
            <Button 
              onClick={() => {
                setPage(1);
              }}
            >
              Commencer
            </Button>

            </Box>
          </motion.Box>
        </div>
      )}
      {page === 1 && (
        <div id="second">
        <Button sx={{width:3, marginTop:3,marginLeft:3}}
          onClick={() => {
            setPage(0);
          }}
        >
          <ArrowBackIosIcon></ArrowBackIosIcon>
        </Button>
          <SeConnecter></SeConnecter>
        </div>
      )}
    </div>
    </>
  )
}
