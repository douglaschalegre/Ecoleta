import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item{
  id: number;
  title: string;
  url: string;
}
interface IBGEresponse{
  sigla:string;
}
interface IBGECityresponse{
  nome:string;
}

const CreateCollectPoint = () =>{
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUF, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(()=>{
    api.get('items').then(response =>{
      setItems(response.data)
    })
  },[]);

  useEffect(()=>{
    axios.get<IBGEresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
      const UFinitials = response.data.map(uf => uf.sigla);
      setUfs(UFinitials);
      UFinitials.sort();
    })
  },[]);
  
  useEffect(()=>{
    axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(response =>{
      const CityNames = response.data.map(city => city.nome);
      setCities(CityNames);
    })
  },[selectedUF]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    setSelectedCity(city);
  }

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
      
        <Link to="/">
          <FiArrowLeft/>
          Voltar para Home
        </Link>
      </header>

      <form>
        <h1>Cadastro do<br/> ponto de coleta</h1>

        <fieldset>

          <legend><h2>Dados</h2></legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name"/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email"/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp"/>
            </div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-9.6354976,-35.7078628]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-9.6354976,-35.7078628]}/>
          </Map>

          <div className="field-group">
            <div className="field">
                <label htmlFor="uf">Estado</label>
                <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUf}>
                  <option value="0">Selecione um Estado</option>
                  {ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                  <option value="0">Selecione uma cidade</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
            <li key={item.id}>
              <img src={item.url} alt={item.title}/>
            <span>{item.title}</span>
            </li>
            ))}
            
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreateCollectPoint;