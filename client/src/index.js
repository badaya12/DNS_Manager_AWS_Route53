// index.js (or wherever you create your Redux store)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {store} from './components/redux/store'; // Import your Redux store
import App from './App';
import { persistor } from './components/redux/store';
import { PersistGate } from 'redux-persist/integration/react'
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={"Loading..."} persistor={persistor}>
      <App />
  </PersistGate>
   
  </Provider>,
  document.getElementById('root')
);
