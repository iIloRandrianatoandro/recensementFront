import { Route, Routes, useLocation } from "react-router-dom";
import PageUtilisateur from "./components/PageUtilisateur";
import "./style/index.css";
import RecenserMaterielForm from "./components/RecenserMaterielForm";
import RecenserMateriel from "./components/RecenserMateriel";

function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<PageUtilisateur/>}></Route>
      <Route path="/recenserMaterielForm/:id" element={<RecenserMaterielForm/>}></Route>
      <Route path="/recenserMateriel/:id" element={<RecenserMateriel/>}></Route>
    </Routes>
  );
}

export default App;
