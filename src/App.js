import { Route, Routes, useLocation } from "react-router-dom";
import PageUtilisateur from "./components/PageUtilisateur";
import "./style/index.css";

function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<PageUtilisateur/>}></Route>
    </Routes>
  );
}

export default App;
