import React, { useState } from "react"
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import './App.css';
import { useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]); //initial value is empty array
  const [country, setCountry] = useState(["Worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  // STATE = how to write a variable in React
  //https://disease.sh/v3/covid-19/countries

  // USEEFFECT = Runs a piece of code based on a given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, []);

  useEffect(() => {     // The code inside here will run once when the component loads and not again after
    // async => send a request to a server, wait for it, do something with info

    const getCountriesData = async () => {   //async function (inside hhim we have something call promises)
      await fetch("https://disease.sh/v3/covid-19/countries")  //fetching
      .then((response) => response.json()) // when the come back with response, first gegt the response and put in form of json
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United State 
            value: country.countryInfo.iso2 // ex. UK, USA, FR
          }
        ));

        let sortedData = sortData(data); //sorted data
        setTableData(sortedData);
        setMapCountries(data); //all the countries
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    //console.log("country code >>>", countryCode);

    setCountry(countryCode);

    const url = countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);

      // All of the date from the country response
      setCountryInfo(data);        
      const {
        countryInfo: { lat, long }
      } = data;
      setMapCenter({ lat, lng: long });
      setMapZoom(4);
    })
  }

  console.log("Country INFO >>>", countryInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="Worldwide">WorldWide</MenuItem>

              {/* loop through all the countries and show a dropdown list of the option */}
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed 
            active={casesType === "deaths"}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />
        </div> 

        <Map 
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right">
        <Card>
          <CardContent>
            <div className="app__info">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} /> 
              <h3 className="app_graphTitle">Worldwide new cases {casesType}</h3>
              {/* Graph */}
              <LineGraph casesType={casesType} className="app__graph" />
              
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}

export default App;
