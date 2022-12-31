/* eslint no-unused-vars: 0 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from 'router/router';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
