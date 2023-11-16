import React, { useState, useEffect } from "react";
import {
  Button,
} from "@mui/material";
import SeConnecter from "./SeConnecter";

export default function Acceuil() {
  const [page, setPage] = useState(0);
  return (
    <div id="acceuil">
      {page === 0 && (
        <div id="first">
            <Button
              size="large"
              onClick={() => {
                setPage(1);
              }}
            >
              Se connecter
            </Button>
        </div>
      )}
      {page === 1 && (
        <div id="second">
          <SeConnecter></SeConnecter>
          <Button
            onClick={() => {
              setPage(0);
            }}
          >
            retour
          </Button>
        </div>
      )}
    </div>
  )
}
