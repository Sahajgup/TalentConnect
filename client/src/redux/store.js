import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage

import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import { rootReducer } from "./rootReducer";


const persistConfig = {
  key: "root", 
  storage,
  whitelist: ["userInfo"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});
const persistor = persistStore(store); 

const { dispatch } = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

export { store,persistor, dispatch, useDispatch, useSelector };
