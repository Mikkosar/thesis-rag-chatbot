// src/App.tsx
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

  useEffect(() => {
    dispatch(initializeChunks());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<DataList />} />
          <Route path="/data/:id" element={<DataDetails />} />
          <Route path="/edit/:id" element={<EditDataForm />} />
          <Route path="/create" element={<CreateData />} />
          <Route path="/chat" element={<StreamChat />} />
          <Route path="/create-multiple" element={<CreateMultipleChunks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
