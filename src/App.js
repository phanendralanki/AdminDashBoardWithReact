import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

//importing required icons
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
// import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editedRowId, setEditedRowId] = useState(null); // New state for edited row
  const [editedValues, setEditedValues] = useState({}); // New state for edited values
  const [selectAll, setSelectAll] = useState(false); //for selecting and deselecting all the checkboxes
  const rowsPerPage = 10;

  //Using useEffect to fetch the data from api.
  useEffect(() => {
    //Fetching the data from the API
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  //Handling Searching and filtering
  useEffect(() => {
    const filteredResults = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchItem.toLowerCase())
      )
    );
    setFilteredData(filteredResults);
    setCurrentPage(1); //To Reset to first page after filtering
  }, [searchItem, data]);

  //pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Handling page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Select All Checkbox handler
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? currentRows.map((row) => row.id) : []);
  };

  // Reset selectAll state when filteredData changes
  useEffect(() => {
    setSelectAll(false);
  }, [filteredData]);

  // Handling row selection
  const handleCheckboxChange = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Input change handler for edited values
  const handleInputChange = (id, field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  //Handling row edit
  const handleRowEdit = (id) => {
    setEditedRowId(id);
  };

  // Handling row save
  const handleRowSave = (id) => {
    // Implement logic to save the changes
    const updatedData = data.map((row) =>
      row.id === id
        ? {
            ...row,
            name: editedValues[id]?.name || row.name,
            email: editedValues[id]?.email || row.email,
            role: editedValues[id]?.role || row.role,
          }
        : row
    );
    setData(updatedData);
    setFilteredData(updatedData);
    setEditedValues((prev) => ({ ...prev, [id]: {} })); // Reset edited values
    setEditedRowId(null);
  };

  // Handling row delete
  const handleRowDelete = (id) => {
    // Implement logic to delete the row
    const updatedData = data.filter((row) => row.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  };

  // Handling bulk delete
  const handleBulkDelete = () => {
    //Implementing lofic to delete selected rows in memory
    const updatedData = data.filter((row) => !selectedRows.includes(row.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <h2 className="text-danger">Admin DashBoard</h2>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-6 d-flex justify-content-start">
            <input
              type="text"
              className="search-box"
              id=""
              placeholder="Search"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
          <div className="col-6 d-flex justify-content-end">
            <MdDelete className="delete-icon" onClick={handleBulkDelete} />
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-center">
              {/* Search bar */}

              {/* Table Code */}
              <table className="table table-hover table-md table-sm table-lg">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        name=""
                        id=""
                        style={{ fontSize: "10px", fontWeight: "bold" }}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                {/* body code starts */}

                <tbody>
                  {currentRows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        background: selectedRows.includes(row.id)
                          ? "#ccc"
                          : "none",
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleCheckboxChange(row.id)}
                        />
                      </td>
                      <td>
                        {editedRowId === row.id ? (
                          <input
                            type="text"
                            value={editedValues[row.id]?.name || row.name}
                            onChange={(e) =>
                              handleInputChange(row.id, "name", e.target.value)
                            }
                          />
                        ) : (
                          row.name
                        )}
                      </td>
                      <td>
                        {editedRowId === row.id ? (
                          <input
                            type="text"
                            value={editedValues[row.id]?.email || row.email}
                            onChange={(e) =>
                              handleInputChange(row.id, "email", e.target.value)
                            }
                          />
                        ) : (
                          row.email
                        )}
                      </td>
                      <td>
                        {editedRowId === row.id ? (
                          <input
                            type="text"
                            value={editedValues[row.id]?.role || row.role}
                            onChange={(e) =>
                              handleInputChange(row.id, "role", e.target.value)
                            }
                          />
                        ) : (
                          row.role
                        )}
                      </td>
                      <td>
                        {editedRowId === row.id ? (
                          <button
                            className="save"
                            onClick={() => handleRowSave(row.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <FaEdit
                            className="edit"
                            onClick={() => handleRowEdit(row.id)}
                            style={{ cursor: "pointer" }}
                          ></FaEdit>
                        )}
                        <AiFillDelete
                          className="delete text-secondary"
                          style={{ cursor: "pointer", marginLeft: "8px" }}
                          onClick={() => handleRowDelete(row.id)}
                        ></AiFillDelete>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Table body code ends */}
            </div>
          </div>
        </div>
      </div>

      {/* pagination component */}
      {/* Pagination code */}
      <div className="container">
        <div className="row">
        {/* <div className="col-6">
            <p> 0 of 45 row(s) selected</p>
        </div> */}
          <div className="col-12 d-flex justify-content-end">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span aria-hidden="true">&lsaquo;</span>
                  </button>
                </li>
                {[
                  ...Array(Math.ceil(filteredData.length / rowsPerPage)).keys(),
                ].map((pageNumber) => (
                  <li
                    key={pageNumber + 1}
                    className={`page-item ${
                      pageNumber + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredData.length / rowsPerPage)
                    }
                  >
                    <span aria-hidden="true">&rsaquo;</span>
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() =>
                      handlePageChange(
                        Math.ceil(filteredData.length / rowsPerPage)
                      )
                    }
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* Pagination end */}

      {/* pagination component */}
    </>
  );
};

export default App;
