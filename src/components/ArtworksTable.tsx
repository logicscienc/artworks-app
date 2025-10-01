// src/components/ArtworksTable.tsx
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableProps } from "primereact/datatable";

import { Column } from "primereact/column";
import { fetchArtworksPage } from "../api/artworks";
import type { Artwork } from "../api/artworks";

const ROWS_PER_PAGE = 12;

const ArtworksTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Persist selected IDs across pages
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchArtworksPage(page);
      setArtworks(res.artworks);
      setTotalRecords(res.pagination.total || 0);

      // Restore selection for current page
      const restoredSelection = res.artworks.filter(a => selectedIds.has(a.id));
      setSelectedRows(restoredSelection);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage]);

  const onPageChange: DataTableProps<Artwork[]>["onPage"] = (event) => {
  setCurrentPage(event.page! + 1); // PrimeReact pages are 0-indexed
};


// Row selection
const onSelectionChange: DataTableProps<Artwork[]>["onSelectionChange"] = (
  event: { value: Artwork[] }
) => {
  setSelectedRows(event.value);

   const newSelectedIds = new Set(selectedIds);
  event.value.forEach((art) => newSelectedIds.add(art.id));
  artworks.forEach((art) => {
    if (!event.value.includes(art)) {
      newSelectedIds.delete(art.id);
    }
  });
  setSelectedIds(newSelectedIds);
};

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectedRows([]);
  };

  // Helper for header with icon
//  const headerWithIcon = (label: string) => (
//     <span className="flex items-center gap-1 font-medium text-gray-700">
//       {label} <GrDown className="text-gray-400 text-xs" />
//     </span>
//   );
  const headerWithArrow = (label: string) => (
  <span className="flex items-center gap-1 font-medium text-gray-700">
    {label} <span className="text-gray-400 text-xs">▼</span>
  </span>
);


  return (
    <div className="flex justify-center mt-6">
       <div className="w-full max-w-4xl">
      <div className="mb-2 flex justify-between items-center">
        <div>Selected Rows: {selectedIds.size}</div>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={clearSelection}
        >
          Clear Selection
        </button>
      </div>

      <DataTable
        value={artworks}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        paginator
        rows={ROWS_PER_PAGE}
        totalRecords={totalRecords}
        first={(currentPage - 1) * ROWS_PER_PAGE}
        onPage={onPageChange}
        dataKey="id"
        lazy
        loading={loading}
        selectionMode="multiple"
      >
          {/* Checkbox column */}
  <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

  {/* Other columns */}
  <Column field="title" header={headerWithArrow("Title")} />



        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
      </div>
    </div>
  );
};

export default ArtworksTable;




