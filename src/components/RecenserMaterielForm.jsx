import React from 'react'
import { Button,FormControl, FormLabel } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function RecenserMaterielForm() {
  return (
    <FormControl method="post" >
       <FormLabel>Déficit par article</FormLabel>
        <TextField
                id="standard-required"
                variant="standard"
                type='number'
                InputProps={{inputProps:{min: 0,max: 10} }}//max tkn existant par recensement
        />
        <FormLabel>Excédent par article</FormLabel>
        <TextField
                id="standard-required"
                defaultValue="Chabmbre 222"
                variant="standard"
                type='number'
                InputProps={{inputProps:{min: 0,max: 10} }}
        />
        <FormLabel>Observation</FormLabel>
        <TextField
                id="standard-required"
                defaultValue="Chabmbre 222"
                variant="standard"
        />
          <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{ color:'black'}}
            >
              Recenser
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{bgcolor:'yellow', color:'black'}}
            >
              Annuler
            </Button>
    </FormControl>
  )
}
