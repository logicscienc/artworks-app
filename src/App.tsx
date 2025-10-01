import React from "react";
import './App.css'
import ArtworksTable from "./components/ArtworksTable";

function App() {
  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artworks</h1>
      <ArtworksTable />
    </div>
  )
}

export default App

