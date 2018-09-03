import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';

import App from './App';
import oktaConfig from './config/oktaConfig';
import firebaseConfig from './config/firebaseConfig';

// initialize firebase connection.-
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <Security {...oktaConfig}>
      <App />
    </Security>
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();

if (module.hot) module.hot.accept();
