import './App.css';
import ArtworksTable from "./components/ArtworksTable";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center fixed top-0 left-0 w-full bg-white z-50 shadow py-3 sm:py-4">
        Artworks
      </h1>

      {/* Content */}
      <div className="pt-16 sm:pt-20 p-4 sm:p-6 overflow-x-auto">
        <ArtworksTable />
      </div>
    </div>
  );
}

export default App;



