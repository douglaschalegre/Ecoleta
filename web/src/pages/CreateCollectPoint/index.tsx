import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import CreateCollectPointSucess from '../../components/CreateCollectPointSucess';
import Dropzone from '../../components/Dropzone';


import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  url: string;
}
interface IBGEresponse {
  sigla: string;
}
interface IBGECityresponse {
  nome: string;
}

const CreateCollectPoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUF, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const UFinitials = response.data.map(uf => uf.sigla);
      setUfs(UFinitials);
      UFinitials.sort();
    })
  }, []);

  useEffect(() => {
    axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const CityNames = response.data.map(city => city.nome);
        setCities(CityNames);
      })
  }, [selectedUF]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])

  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }

  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    if (selectedFile) {
      data.append('image', selectedFile);
    }
  
    await api.post('collectPoints', data);

    alert('Cadastro concluído!')
    history.push('/');
  }
  return (

    <div>
      <CreateCollectPointSucess />
      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta" />

          <Link to="/">
            <FiArrowLeft />
            Voltar para Home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Cadastro do<br /> ponto de coleta</h1>

          <Dropzone onFileUpload={setSelectedFile} />

          <fieldset>
            <legend><h2>Dados</h2></legend>
            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" onChange={handleInputChange} />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" onChange={handleInputChange} />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço clicando no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />
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
                <li key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}

            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>

    </div>
  );
}

export default CreateCollectPoint;