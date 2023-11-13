import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const now = new Date();
const annee5 = now.getFullYear();
const annee4=annee5-1;
const annee3=annee5-2;
const annee2=annee5-3;
const annee1=annee5-4;
const xLabels = [
    annee1,
    annee2,
    annee3,
    annee4,
    annee5,
  ];
export default function Evolution() {
    //state utilisee par l'application
    const [quantite, setQuantite] = useState([1,0,0,0,0]);
    const [valeur, setValeur] = useState([0,0,0,0,0]);
    // base url backend
    const baseUrl = 'http://localhost:8000/api';
    useEffect(()=>{
        //recuperer liste des annees avec recensement
        const getEvolution = async () => {
          await axios.get(`${baseUrl}/consulterEvolution5Ans`)
          .then(res => { 
            console.log(res.data)
            //console.log(res.data.annee1Quantite[0]["count(idRecensement)"])
            const qtt=[]
            qtt.push(res.data.annee1Quantite[0]["count(idRecensement)"])
            qtt.push(res.data.annee2Quantite[0]["count(idRecensement)"])
            qtt.push(res.data.annee3Quantite[0]["count(idRecensement)"])
            qtt.push(res.data.annee4Quantite[0]["count(idRecensement)"])
            qtt.push(res.data.annee5Quantite[0]["count(idRecensement)"])
            console.log(qtt)
            setQuantite(qtt)
            const vlr=[]
            vlr.push(res.data.annee1Valeur[0]["valeur"])
            vlr.push(res.data.annee2Valeur[0]["valeur"])
            vlr.push(res.data.annee3Valeur[0]["valeur"])
            vlr.push(res.data.annee4Valeur[0]["valeur"])
            vlr.push(res.data.annee5Valeur[0]["valeur"])
            console.log(vlr)
            setValeur(vlr)
          })
          .catch(err => console.log(err));
        }
        getEvolution()
    },[])
  return (
    <BarChart
      width={500}
      height={300}
      series={[
        { data: quantite, label: 'Quantité', id: 'Quantite', yAxisKey: 'leftAxisId' },
        { data: valeur, label: 'Valeur', id: 'Valeur',yAxisKey: 'rightAxisId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
      rightAxis="rightAxisId"

    />
  )
}
