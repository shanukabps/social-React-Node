
import React, { createContext, useContext, useReducer } from 'react';

//create data layer
export const StateContext = createContext();

//use this for rap
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)
export const useStateValue = () => useContext(StateContext) //pull data to data layer