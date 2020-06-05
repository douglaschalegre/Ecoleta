import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import CreateCollectPoint from './pages/CreateCollectPoint'


const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={LandingPage} path="/" exact />
      <Route component={CreateCollectPoint} path="/create-collect"/>
    </BrowserRouter>
  );
}

export default Routes;