import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import "../style/NavBarUtilisateur.scss";

const drawerWidth = 240;

export default function NavBarAdmin() {
    const navigate = useNavigate();
    const toAcceuil = () => {
      navigate("/");
    };
    const seDeconnecter = async (e) => {
      e.preventDefault();
  
      sessionStorage.setItem("isLogged", "false");
      sessionStorage.setItem("isAdmin", "false");
      navigate("/");
    };
    const goNouveau = async (e) => {
        navigate("/importerListe");
    };
    const goRecapitulatif = async (e) => {
        navigate("/recapitulatif");
    };
    const goEvolution = async (e) => {
        navigate("/evolution");
    };
    const goUtilisateur = async (e) => {
        navigate("/listerUtilisateur");
    };
    const goMateriel = async (e) => {
        navigate("/listerMateriel");
    };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,bgcolor: "common.white" }}
      >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2, color: "primary.main", fontWeight: "bold" }}>
        Ministère du Travail, de l'Emploi, de la Fonction Publique et des Lois Sociales
        </Typography>
      </Toolbar>
        {/*<Toolbar>
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
        </Toolbar>*/}
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
            <ListItem disablePadding>
              <ListItemButton onClick={goNouveau}>
                <ListItemIcon>
                   <MailIcon />
                </ListItemIcon>
                <ListItemText primary={'Nouveau recensement'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
            <ListItemButton onClick={goRecapitulatif}>
              <ListItemIcon>
                 <MailIcon />
              </ListItemIcon>
              <ListItemText primary={'Récapitulatif'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
          <ListItemButton onClick={goEvolution}>
            <ListItemIcon>
               <MailIcon />
            </ListItemIcon>
            <ListItemText primary={'Evolution'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton onClick={goUtilisateur}>
          <ListItemIcon>
             <MailIcon />
          </ListItemIcon>
          <ListItemText primary={'Utilisateurs'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
      <ListItemButton onClick={goMateriel}>
        <ListItemIcon>
           <MailIcon />
        </ListItemIcon>
        <ListItemText primary={'Matériels'} />
      </ListItemButton>
    </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem disablePadding>
              <ListItemButton onClick={seDeconnecter}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={'Se déconnecter'} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
    </Box>
  )
}
