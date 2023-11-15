import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";

//composant
import PageUtilisateur from "./components/PageUtilisateur";
import RecenserMateriel from "./components/RecenserMateriel";
import ImporterListe from "./components/ImporterListe";
import SuivreFlux from "./components/SuivreFlux";
import Recapitulatif from "./components/Recapitulatif";
import ModifierRecensement from "./components/ModifierRecensement";
import ListeUtilisateur from "./components/ListeUtilisateur";
import CreerUtilisateur from "./components/CreerUtilisateur";
import ModifierUtilisateur from "./components/ModifierUtilisateur";
import ListeMateriel from "./components/ListeMateriel";
import ModifierMateriel from "./components/ModifierMateriel";
import Evolution from "./components/Evolution";
import SeConnecter from "./components/SeConnecter";
import Acceuil from "./components/Acceuil";

import "./style/index.css";
import AdminRouteProtege from "./components/AdminRouteProtege";
import UtilisateurRouteProtege from "./components/UtilisateurRouteProtege";
import NavBarAdmin from "./components/NavBarAdmin";

function App() {
  const location = useLocation();
  return (
    <ThemeProvider theme={theme}>

      <Routes location={location} key={location.pathname}>
        <Route element={<AdminRouteProtege />}>
          <Route path="/importerListe/" element={<ImporterListe/>}></Route>
          <Route path="/suivreFlux/" element={<SuivreFlux/>}></Route>
          <Route path="/recapitulatif/" element={<Recapitulatif/>}></Route>
          <Route path="/modifierRecensement/:id" element={<ModifierRecensement/>}></Route>
          <Route path="/evolution/" element={<Evolution/>}></Route>
          <Route path="/listerUtilisateur/" element={<ListeUtilisateur/>}></Route>
          <Route path="/creerUtilisateur/" element={<CreerUtilisateur/>}></Route>
          <Route path="/modifierUtilisateur/:id" element={<ModifierUtilisateur/>}></Route>
          <Route path="/listerMateriel/" element={<ListeMateriel/>}></Route>
          <Route path="/modifierMateriel/:id" element={<ModifierMateriel/>}></Route>
        </Route>
        <Route element={<UtilisateurRouteProtege/>}>
          <Route path="/pageUtilisateur" element={<PageUtilisateur/>}></Route>
          <Route path="/recenserMateriel/:id" element={<RecenserMateriel/>}></Route>
        </Route>
      <Route path="/seConnecter/" element={<SeConnecter/>}></Route>
      <Route path="/" element={<Acceuil/>}></Route>
      <Route path="/nav" element={<NavBarAdmin/>}></Route>
        
      </Routes>
    </ThemeProvider>
  );
}
const styles = ({ fontFamily }) => ({
  fontFamily: "Roboto",
});
export default App;
