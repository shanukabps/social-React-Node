import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserReducer, { initialState } from './components/cotexApi/reducers/userReducers';
import { StateProvider } from './components/cotexApi/StateProvider';



ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={UserReducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
