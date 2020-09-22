import React, { useEffect, useState } from "react";
import { StationProps } from "../interfaces/Station.interface";
import { TrainProps } from "../interfaces/Train.interface";
import Platform from "./Platform";
import "./Station.css"

function Station({station, line, JSON, toHome, refresh}: StationProps) {
  const [JSX, setJSX] = useState<Array<JSX.Element>>();

  const stationNames: {[index: string]: string} = {
    "HOK": "Hong Kong",
    "KOW": "Kowloon",
    "TSY": "Tsing Yi",
    "AIR": "Airport",
    "AWE": "AsiaWorld-Expo",
    "OLY": "Olympic",
    "NAC": "Nam Cheong",
    "LAK": "Lai King",
    "SUN": "Sunny Bay",
    "TUC": "Tung Chung",
    "HUH": "Hung Hom",
    "ETS": "East Tsim Sha Tsui",
    "AUS": "Austin",
    "MEF": "Mei Foo",
    "TWW": "Tseung Wan West",
    "KSR": "Kam Sheung Road",
    "YUL": "Yuen Long",
    "LOP": "Long Ping",
    "TIS": "Tin Shui Wai",
    "SIH": "Siu Hong",
    "TUM": "Tuen Mun",
    "NOP": "North Point",
    "QUB": "Quarry Bay",
    "YAT": "Yau Tong",
    "TIK": "Tiu Keng Leng",
    "TKO": "Tseung Kwan O",
    "LHP": "Lohas Park",
    "HAH": "Hang Hau",
    "POA": "Po Lam"
  }

  const linesNames: {[index: string]: string} = {
    "AEL": "Airport Express",
    "TCL": "Tung Chung Line",
    "WRL": "West Rail Line",
    "TKL": "Tseung Kwan O Line"
  }

  const lineColors: {[index:string] : string} = {
    "AEL": "#138889",
    "TCL": "#F59448",
    "WRL": "#B3158C",
    "TKL": "#7D4C9B"    
  }

  //Get line color
  const lineColor = lineColors[line];

  useEffect(
    ()=>{
      if (JSON.data === "NULL") {return;}
      //Check if too many requests are sent
      if (JSON.data === 429) {
        setJSX(
          [<span key="error">You may have sent too many requests</span>]
        );
        return;
      }
      
      //Check if internal server error is received
      if (JSON.data === 500) {
        setJSX(
          [<span key="error">Seems like something is wrong on MTR's server</span>]
        );
        return;
      }

      //Get key value
      const key = Object.keys(JSON.data)[0];
      //Get line and lineColor
      const line = key.split("-")[0];

      //Get a copy of the array using the key
      interface TrainsInfo {[key: string] : Array<TrainProps>};
      let data: any = JSON.data;
      const trainsInfo: TrainsInfo = data[key] as TrainsInfo;

      //Check data absenc
      if (Object.keys(trainsInfo).length === 2) {
        setJSX(
          [<span>Data is absent</span>]
        );
        return;
      }

      //Extract UP and DOWN, put them in an array with index 0 or 1
      //If both of them exist, UP should have index 0 and DOWN should have index 1
      //If trainsInfo only has 2 child, then something from the api is wrong 
      const directions: Array<string> = [];

      Object.keys(trainsInfo).forEach(
        (key)=>{if (key === "DOWN" || key === "UP") {directions.push(key);}}
      );

      //Generate destinations
      const destionationsList:any = {
        "AEL": {"UP": "AsiaWorld-Expo", "DOWN": "Hong Kong"},
        "TCL": {"UP": "Tung Chung", "DOWN": "Hong Kong"},
        "WRL": {"UP": "Tuen Mun", "DOWN": "Hung Hom"},
        "TKL": {"UP": "Po Lam/Lohas Park", "DOWN": "North Point/Tiu Keng Leng"}   
      };

      //Map UP and DOWN as JSX elements
      let map = directions.map(
        (direction: string, index: number)=>{
          let trains = trainsInfo[direction];
          return(<Platform key={`${direction}${index}`} lineColor={lineColor} trains={trains} direction={`TRAINS TOWARDS ${destionationsList[line][direction].toUpperCase()}`}/>)
        }
      )
      
      setJSX(map);
    },
    [JSON]
  );

  return(
    <div className="station">
      <header className="station-header">
        <span onClick={(e)=>toHome("HOME", "HOME")} className="station-button">BACK</span>
        <span>|</span>
        <span onClick={(e)=>{refresh(line, station)}} className="station-button">REFRESH</span>
        <span>|</span>
        <span style={{color: lineColor}}>{stationNames[station].toUpperCase()} </span>
        <span>Last Updated: {JSON.curr_time}</span>
      </header>
      <div className="platforms-list">
        {JSX}
      </div>
    </div>
  )
}

export default Station;