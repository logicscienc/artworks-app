
import './App.css'
import ArtworksTable from "./components/ArtworksTable";

function App() {
  return (
    <div>
      {/* Fixed Header */}
      <h1 className="text-2xl font-bold text-center fixed top-0 left-0 w-full bg-white z-50 shadow py-4">
        Artworks
      </h1>

     
      <div className="pt-20 p-6">
        <ArtworksTable />
      </div>
    </div>
  )
}

export default App;


