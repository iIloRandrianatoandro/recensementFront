import React from 'react'
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "../style/NavBarUtilisateur.scss";
import InputTwoToneIcon from "@mui/icons-material/InputTwoTone";
import {Button} from "@mui/material";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBarUtilisateur() {
    const navigate = useNavigate();
    const toAcceuil = () => {
      navigate("/");
    };
    const seDeconnecter = async (e) => {
      e.preventDefault();
  
      sessionStorage.setItem("isLogged", "false");
      sessionStorage.setItem("isUser", "false");
      navigate("/");
    };
  return (
    <AppBar position="fixed" sx={{ bgcolor: "common.white" }}>
        <Toolbar>
        <div id="logo" onClick={toAcceuil}>
          <img src="/images/LogoONN.jpeg" alt="logo" />
        </div>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, ml: 2, color: "primary.main", fontWeight: "bold" }}
        >
          Ministère du Travail, de l'Emploi, de la Fonction Publique et des Lois Sociales
        </Typography>
        <Box sx={{ flexGrow: 0}}>
        <Tooltip title="Se déconnecter">
              <IconButton onClick={seDeconnecter} sx={{ p: 0 }}>
              <LogoutIcon /> <Typography>Se déconnecter</Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
    </AppBar>
  )
}
