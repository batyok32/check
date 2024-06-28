"use client";

import makeStore from "./store";
import { Provider } from "react-redux";
import { useRef } from "react";
import { PersistGate } from "redux-persist/integration/react";
import LoadingScreen from "@/components/Loading/LoadingScreen";

const { store, persistor } = makeStore();

export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
