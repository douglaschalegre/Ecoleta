import React from 'react';
import { FiCheckCircle } from 'react-icons/fi'

import './styles.css'

const Sucess = () => {
  return(
    <div className='overlay'>
      <div className='message'> 
          <FiCheckCircle size={48}/><br/>
          <span>Cadastro Concluído</span>
      </div>
    </div>
  );
}

export default Sucess;