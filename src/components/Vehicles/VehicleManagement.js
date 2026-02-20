import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import carApi from "../../services/api";
import VehicleForm from "./VehicleForm";
import "./VehicleManagement.css";
import { useCurrency } from "../../contexts/CurrencyContext";

const VehicleManagement = () => {
  const { formatPrice } = useCurrency();
  const [vehicles, setVehicles] = useState([]);
  const [archivedVehicles, setArchivedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewArchived, setViewArchived] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    loadVehicles();
  }, [viewArchived]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      if (viewArchived) {
        const data = await carApi.getArchivedCars();
        setArchivedVehicles(data);
      } else {
        const data = await carApi.getCars();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (carData) => {
    try {
      await carApi.createCar(carData);
      toast.success("Vehicle added successfully");
      setShowForm(false);
      loadVehicles();
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle");
    }
  };

  const handleEditVehicle = async (carData) => {
    try {
      await carApi.updateCar(editingVehicle.id, carData);
      toast.success("Vehicle updated successfully");
      setShowForm(false);
      setEditingVehicle(null);
      loadVehicles();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  const handleArchiveVehicle = async (id) => {
    if (window.confirm("Are you sure you want to archive this vehicle? This will remove it from active fleet but preserve all data.")) {
      try {
        await carApi.archiveCar(id);
        toast.success("Vehicle archived successfully");
        loadVehicles();
      } catch (error) {
        console.error("Error archiving vehicle:", error);
        toast.error("Failed to archive vehicle");
      }
    }
  };

  const handleRestoreVehicle = async (id) => {
    if (window.confirm("Are you sure you want to restore this vehicle to active fleet?")) {
      try {
        await carApi.restoreCar(id);
        toast.success("Vehicle restored successfully");
        loadVehicles();
      } catch (error) {
        console.error("Error restoring vehicle:", error);
        toast.error("Failed to restore vehicle");
      }
    }
  };

  const handleStartEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const data = useMemo(() => viewArchived ? archivedVehicles : vehicles, [vehicles, archivedVehicles, viewArchived]);

  // Table columns
  const columns = useMemo(() => [
    {
      Header: "Vehicle",
      accessor: "brand",
      Cell: ({ row }) => (
        <div className="vehicle-cell">
          {row.original.image && (
            <div className="vehicle-image">
              <img src={row.original.image} alt={`${row.original.brand} ${row.original.model}`} />
            </div>
          )}
          <div className="vehicle-info">
            <div className="vehicle-name">{row.original.brand} {row.original.model}</div>
            <div className="vehicle-details">
              <span>{row.original.year} • {row.original.category}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Price/Day",
      accessor: "pricePerDay",
      Cell: ({ value }) => `${formatPrice(value)}/day`,
    },
    {
      Header: "Price/Week",
      accessor: "weeklyPrice",
      Cell: ({ value }) => value ? `${formatPrice(value)}/week` : "-",
    },
    {
      Header: "Seats",
      accessor: "seatingCapacity",
      Cell: ({ value }) => value ? `${value} seats` : "-",
    },
    {
      Header: "Luggage",
      accessor: "luggageCapacity",
    },
    {
      Header: "Fuel Type",
      accessor: "fuelType",
    },
    {
      Header: "Transmission",
      accessor: "transmission",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span className={`status-badge ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      Header: "Condition",
      accessor: "conditionRating",
      Cell: ({ value }) => (
        <div className="condition-rating">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`star ${i < value ? "filled" : "empty"}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
        </div>
      ),
    },
    {
      Header: "Actions",
      accessor: "id",
      Cell: ({ row }) => (
        <div className="action-buttons">
           {!viewArchived ? (
            <>
              <button 
                className="action-btn edit"
                onClick={() => handleStartEdit(row.original)}
                title="Edit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button 
                className="action-btn archive"
                onClick={() => handleArchiveVehicle(row.original.id)}
                title="Archive"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </button>
              <button 
                className="action-btn view-3d"
                onClick={() => window.location.href = `/car-3d/${row.original.id}`}
                title="View 3D"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </button>
            </>
          ) : (
            <button 
              className="action-btn restore"
              onClick={() => handleRestoreVehicle(row.original.id)}
              title="Restore"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ], [viewArchived]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="vehicle-management">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="page-header">
        <div className="header-content">
          <h1>Vehicle Management</h1>
          <p className="subtitle">Manage your entire car fleet with complete CRUD operations</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-filter"
            onClick={() => setViewArchived(!viewArchived)}
          >
            {viewArchived ? "View Active" : "View Archive"}
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {viewArchived ? "Restore Vehicle" : "Add Vehicle"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-header">
                    <div className="header-content">
                      {column.render("Header")}
                      {column.isSorted ? (
                        <span className="sort-icon">
                          {column.isSortedDesc ? "↓" : "↑"}
                        </span>
                      ) : (
                        <span className="sort-icon"></span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="table-cell">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {pageIndex * pageSize + 1} to {Math.min(pageIndex * pageSize + pageSize, data.length)} of {data.length} vehicles
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="page-btn"
          >
            First
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="page-btn"
          >
            Previous
          </button>
          {pageOptions.map(page => (
            <button
              key={page}
              onClick={() => gotoPage(page)}
              className={`page-btn ${page === pageIndex ? "active" : ""}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="page-btn"
          >
            Next
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="page-btn"
          >
            Last
          </button>
        </div>
        <div className="page-size">
          Page size:
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              gotoPage(0);
              // Note: This would require modifying the useTable initialState or using a controlled component
            }}
            className="page-size-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Vehicle Form */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default VehicleManagement;
