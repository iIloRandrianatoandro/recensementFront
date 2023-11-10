import { Route, Routes } from "react-router-dom";
import PageUtilisateur from "./components/PageUtilisateur";
import RecenserMateriel from "./components/RecenserMateriel";
import ImporterListe from "./components/ImporterListe";
import SuivreFlux from "./components/SuivreFlux";
import Recapitulatif from "./components/Recapitulatif";

import "./style/index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageUtilisateur/>}></Route>
      <Route path="/recenserMateriel/:id" element={<RecenserMateriel/>}></Route>
      <Route path="/importerListe/" element={<ImporterListe/>}></Route>
      <Route path="/suivreFlux/" element={<SuivreFlux/>}></Route>
      <Route path="/recapitulatif/" element={<Recapitulatif/>}></Route>
    </Routes>
  );
}

export default App;
