import { Route, Routes } from "react-router-dom";
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

import "./style/index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageUtilisateur/>}></Route>
      <Route path="/recenserMateriel/:id" element={<RecenserMateriel/>}></Route>
      <Route path="/importerListe/" element={<ImporterListe/>}></Route>
      <Route path="/suivreFlux/" element={<SuivreFlux/>}></Route>
      <Route path="/recapitulatif/" element={<Recapitulatif/>}></Route>
      <Route path="/modifierRecensement/:id" element={<ModifierRecensement/>}></Route>
      <Route path="/listerUtilisateur/" element={<ListeUtilisateur/>}></Route>
      <Route path="/creerUtilisateur/" element={<CreerUtilisateur/>}></Route>
      <Route path="/modifierUtilisateur/" element={<ModifierUtilisateur/>}></Route>
      <Route path="/listerMateriel/" element={<ListeMateriel/>}></Route>
      <Route path="/modifierMateriel/:id" element={<ModifierMateriel/>}></Route>
      <Route path="/evolution/" element={<Evolution/>}></Route>
    </Routes>
  );
}

export default App;
