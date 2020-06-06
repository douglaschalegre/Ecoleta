import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import CreateCollectPoint from './pages/CreateCollectPoint';
import CreateCollectPointSucess from './pages/CreateCollectPointSucess';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={LandingPage} path="/" exact />
      <Route component={CreateCollectPoint} path="/create-collect"/>
      <Route component={CreateCollectPointSucess} path="/sucess"/>
      
    </BrowserRouter>
  );
}

export default Routes;