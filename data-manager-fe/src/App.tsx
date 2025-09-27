// src/App.tsx
// Sovelluksen pääkomponentti, joka määrittelee reitit ja navigaation

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import DataList from "./components/data/data-list";
import DataDetails from "./components/data/data-details";
import EditDataForm from "./components/data/edit-data-form";
import CreateData from "./components/data/create-data";
import { useEffect } from "react";
import { initializeChunks } from "./reducer/data-reducer";
import { useAppDispatch } from "./hook";
import StreamChat from "./components/chat/stream-chat";
import CreateMultipleChunks from "./components/data/create-multiple-chunks";

function App() {
  const dispatch = useAppDispatch();

  // Sovelluksen alustus: haetaan chunk-tiedot palvelimelta
  useEffect(() => {
    dispatch(initializeChunks());
  }, [dispatch]);

  return (
    <Router>
      {/* Navigaatiopalkki joka näkyy kaikilla sivuilla */}
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto w-full">
        {/* Reittien määrittely */}
        <Routes>
          <Route path="/" element={<DataList />} /> {/* Pääsivu: chunk-lista */}
          <Route path="/data/:id" element={<DataDetails />} /> {/* Chunk-tiedot */}
          <Route path="/edit/:id" element={<EditDataForm />} /> {/* Chunk-muokkaus */}
          <Route path="/create" element={<CreateData />} /> {/* Uuden chunkin luonti */}
          <Route path="/chat" element={<StreamChat />} /> {/* Chat-ominaisuus */}
          <Route path="/create-multiple" element={<CreateMultipleChunks />} /> {/* Usean chunkin luonti AI:lla */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
