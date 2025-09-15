// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Nav";
import DataList from "./components/data/DataList";
import DataDetails from "./components/data/DataDetails";
import EditDataForm from "./components/data/EditDataForm";
import CreateData from "./components/data/CreateData";
import { useEffect } from "react";
import { initializeChunks } from "./reducer/dataReducer";
import { useAppDispatch } from "./hook";
import StreamChat from "./components/Chat/StreamChat";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
