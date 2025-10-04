// src/components/ArtworksTable.tsx
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworksPage } from "../api/artworks";
import type { Artwork } from "../api/artworks";
import { BsChevronDown } from "react-icons/bs";
import RowSelectDropdown from "./RowSelectDropdownProps";

const ROWS_PER_PAGE = 12;

const ArtworksTable: React.FC = () => {
  // Array of artworks fetched from API
  const [artworks, setArtworks] = useState<Artwork[]>([]);
   // Loading state for API requests
  const [loading, setLoading] = useState(false);
   // Total records from server (for pagination)
  const [totalRecords, setTotalRecords] = useState(0);
  // Current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Controls visibility of custom row selection dropdown
  const [showDropdown, setShowDropdown] = useState(false);
    // Set of selected artwork IDs (persist across pages)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
   // Currently selected artwork objects on this page
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);


  // Function to fetch and load artworks for a given page
  const loadPage = async (page: number) => {
    // show loading indicator
    setLoading(true);
    try {
      // fetch artworks from API for this page
      const res = await fetchArtworksPage(page);
       // update state with artworks of this page
      setArtworks(res.artworks);
      // update total records (for pagination)
      setTotalRecords(res.pagination.total || 0);
       
       // Restore any previously selected rows for this page
      const restoredSelection = res.artworks.filter((a) =>
        selectedIds.has(a.id)
      );
      setSelectedRows(restoredSelection);
    } catch (err) {
      // log errors
      console.error("Failed to fetch data:", err);
    }

    // hide loading indicator
    setLoading(false);
  };

  // Whenever currentPage changes, fetch artworks for that page
  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage]);


  // Handle page change event from PrimeReact paginator
// PrimeReact uses 0-based pages, so we add +1 to match our API (1-based)
  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };


  // Handle selection changes in the table
  const onSelectionChange = (event: { value: Artwork[] }) => {

     // Update currently selected rows on this page
    setSelectedRows(event.value);

    // Clone the global set of selected IDs
    const newSelectedIds = new Set(selectedIds);

     // Add IDs of newly selected rows from this page
    event.value.forEach((art) => newSelectedIds.add(art.id));

     // Remove IDs of rows that were deselected on this page
    artworks.forEach((art) => {
      if (!event.value.includes(art)) newSelectedIds.delete(art.id);
    });

     // Save the updated global selection
    setSelectedIds(newSelectedIds);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectedRows([]);
  };


  // Preselect a specific number of rows across multiple pages
// Called when user submits a number from the dropdown
  const handleRowsSubmit = async (rows: number) => {
    let needed = rows;
    let page = 1;
    const newSelectedIds = new Set<number>();

    try {
      while (needed > 0) {
        const res = await fetchArtworksPage(page);
        for (let art of res.artworks) {
          if (newSelectedIds.size < rows) newSelectedIds.add(art.id);
        }
        needed = rows - newSelectedIds.size;
        page++;
        if (res.artworks.length === 0) break;
      }

      setSelectedIds(newSelectedIds);
      const restoredSelection = artworks.filter((a) =>
        newSelectedIds.has(a.id)
      );
      setSelectedRows(restoredSelection);
    } catch (err) {
      console.error("Failed to preselect rows:", err);
    }
  };

  // Custom header for "Title" column with a dropdown
// The dropdown allows user to choose how many rows to auto-select

  const TitleHeader: React.FC = () => (
    <span className="relative flex items-center gap-1 font-medium text-gray-700">
      Title
      <BsChevronDown
        className="text-gray-900 text-sm cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      />
      {showDropdown && (
        <RowSelectDropdown
          onSubmit={handleRowsSubmit}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </span>
  );

  return (
    <div className="flex justify-center mt-6 px-2 sm:px-4">
      <div className="w-full max-w-6xl">
        <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="text-sm sm:text-base">Selected Rows: {selectedIds.size}</div>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={clearSelection}
          >
            Clear Selection
          </button>
        </div>

       
        <div className="overflow-x-auto">
          <DataTable
           // current page data
            value={artworks}
             // allow multi-row selection
            selectionMode="multiple"
             // selected rows for this page
            selection={selectedRows}
             // update selection when user clicks checkboxes
            onSelectionChange={onSelectionChange}
             // enable pagination controls
            paginator
             // rows per page
            rows={ROWS_PER_PAGE}
             // total records (from API)
            totalRecords={totalRecords}
            // starting index for current page
            first={(currentPage - 1) * ROWS_PER_PAGE}
            // load new data on page change
            onPage={onPageChange}
             // unique key for each row
            dataKey="id"
             // server-side pagination
            lazy
            // show loading spinner when fetching
            loading={loading}
            className="min-w-[700px]" 
            pt={{ thead: { className: "thead-fix" } }}
          >

             {/* Checkbox selection column */}
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            {/* Title column with custom dropdown header */}
            <Column field="title" header={<TitleHeader />} />

            {/* Other fields (responsive visibility) */}
            <Column
              field="place_of_origin"
              header="Origin"
              className="hidden sm:table-cell"
            />
            <Column
              field="artist_display"
              header="Artist"
              className="hidden md:table-cell"
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              className="hidden lg:table-cell"
            />
            <Column
              field="date_start"
              header="Start Date"
              className="hidden sm:table-cell"
            />
            <Column
              field="date_end"
              header="End Date"
              className="hidden md:table-cell"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ArtworksTable;








