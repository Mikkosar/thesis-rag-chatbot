// src/main.tsx
// Sovelluksen pääsyöte, joka alustaa React-sovelluksen ja Redux-storen

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";

// Luodaan React-sovellus DOM-elementtiin ja kääritään se Redux Provider:illa
// Provider mahdollistaa Redux-storen käytön koko sovelluksessa
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
