import {
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Avatar,
    Button,
    Grid,
  } from "@mui/material";
  import React, { useState,useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import "../style/Login.scss";
  import axios from "axios";
  import LockPersonIcon from "@mui/icons-material/LockPerson";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
  import LockOpenIcon from "@mui/icons-material/LockOpen";
  
  const baseUrl = "http://localhost:8000/api";

export default function SeConnecter() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notLogged, setNotLogged] = useState(false);

  
    const handleClose = () => {
      setNotLogged(false);
    }; 
      const login = async(e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(`${baseUrl}/seConnecter`, {
              email: email,
              password: password,
            });
          
            if (res.data["isAdmin"] === true) {
              sessionStorage.setItem("isLogged", "true");
              sessionStorage.setItem("isAdmin", "true");
              sessionStorage.setItem("id", res.data["id"]);
              navigate("/suivreFlux");
            } else if (res.data["isAdmin"] === false) {
              sessionStorage.setItem("isLogged", "true");
              sessionStorage.setItem("isUser", "true");
              sessionStorage.setItem("id", res.data["id"]);
              navigate("/pageUtilisateur");
            }
            else{
                setNotLogged(true);
            }
          } catch (error) {
            console.error('Error during login:', error);
            // Handle the error, e.g., set an error state or display a message
            setNotLogged(true);
          }
      };
    
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPass: false,
  });

  const handlePassVisibility = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };

  const paperStyle = { height: "60vh", width: 300 };
  const avatarStyle = { backgroundColor: "black" };
  return (
    <div id="login">
      <div id="formLogin">
        <Grid>
          <Paper elevation={10} sx={{ width: 500 }} style={paperStyle}>
            <div id="lock">
              <Avatar style={avatarStyle}>
                <LockPersonIcon />
              </Avatar>

              <h2>Se connecter</h2>
            </div>

            <form onSubmit={login}>
              <div id="label0">
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="vérifier bien votre adresse email!"
                  type="email"
                  label="Email"
                  placeholder="entrer votre email"
                  required
                  sx={{ width: 250 }}
                />
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="vérifier bien votre mot de passe!"
                  type={values.showPass ? "text" : "password"}
                  label="Mot de passe"
                  placeholder="entrer votre mot de passe"
                  required
                  sx={{ width: 250 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePassVisibility}
                          aria-label="toggle"
                          edge="end"
                        >
                          {values.showPass ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {notLogged === true && (
                  <div>
                    <Dialog
                      open={notLogged}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title" sx={{color:"red"}}>
                        {"Echec de connexion"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Il y a une erreur pendant la connexion
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                          OK
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}

                <Button
                  variant="contained"
                  sx={{ width: 250 }}
                  startIcon={<LockOpenIcon />}
                  type="submit"
                >
                  se connecter
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </div>
    </div>
  )
}
