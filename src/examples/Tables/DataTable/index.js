import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useAsyncDebounce,
} from "react-table";

// Material-UI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

import "./tables.css";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  searchButtonClickEventHandler,
}) {
  const [loadedData, setLoadedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const chunkSize = 30; // Number of rows to load per chunk

  // Lazy load data chunks
  useEffect(() => {
    if (table.rows.length) {
      const chunkedData = [];
      for (let i = 0; i < table.rows.length; i += chunkSize) {
        chunkedData.push(table.rows.slice(i, i + chunkSize));
      }
      setLoadedData(chunkedData.flat());
      setLoading(false);
    }
  }, [table.rows]);

  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => loadedData, [loadedData]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  useEffect(() => {
    setPageSize(entriesPerPage.defaultValue || 10);
  }, [entriesPerPage.defaultValue]);

  const setEntriesPerPage = (value) => setPageSize(value);

  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  const customizedPageOptions = pageOptions.map((option) => option + 1);
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["10", "50", "100", "150", "200", "500"];

  const [search, setSearch] = useState(globalFilter);

  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asc";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;
  let entriesEnd;
  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {entriesPerPage || canSearch ? (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue));
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary">
                &nbsp;&nbsp;entries per page
              </MDTypography>
            </MDBox>
          )}
          <div className="searchBox_1Doo search-navbar-input-button" id="__docusaurus">
            <button
              style={{ width: "15rem" }}
              type="button"
              onClick={searchButtonClickEventHandler}
              className="DocSearch DocSearch-Button button responsiveDiv"
              aria-label="Search"
            >
              <span className="DocSearch-Button-Container">
                <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20">
                  <path
                    d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                    stroke="currentColor"
                    fill="none"
                    fillRule="evenodd"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="DocSearch-Button-Placeholder">Search</span>
              </span>
            </button>
          </div>
        </MDBox>
      ) : null}

      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width || "auto"}
                  align={column.align || "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>

        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row.cells.map((cell, idx) => (
                  <DataTableBodyCell key={idx} align={cell.column.align}>
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
                {/* Ensure subRows exist and are properly handled */}
                {row.subRows && row.subRows.length > 0 && (
                  <TableRow>
                    {row.subRows.map((subRow, subIdx) => {
                      prepareRow(subRow);
                      return (
                        <TableRow key={subIdx} {...subRow.getRowProps()}>
                          {subRow.cells.map((cell, subIdx2) => (
                            <DataTableBodyCell key={subIdx2} align={cell.column.align}>
                              {cell.render("Cell")}
                            </DataTableBodyCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableRow>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {rows.length} entries
            </MDTypography>
          </MDBox>
        )}
        <div className="responsiveDiv">
            {pageOptions.length > 1 && (
              <MDPagination
                variant={pagination.variant ? pagination.variant : "gradient"}
                color={pagination.color ? pagination.color : "info"}
              >
                {canPreviousPage && (
                  <MDPagination item onClick={() => previousPage()}>
                    <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                  </MDPagination>
                )}
                {renderPagination.length > 6 ? (
                  <MDBox width="5rem" mx={1}>
                    <MDInput
                      inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                      value={customizedPageOptions[pageIndex]}
                      onChange={(handleInputPagination, handleInputPaginationValue)}
                    />
                  </MDBox>
                ) : (
                  renderPagination
                )}
                {canNextPage && (
                  <MDPagination item onClick={() => nextPage()}>
                    <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                  </MDPagination>
                ) }
              </MDPagination>
            )}
        </div>  
      </MDBox>
    </TableContainer>
  );
}

DataTable.propTypes = {
  entriesPerPage: PropTypes.shape({
    entries: PropTypes.arrayOf(PropTypes.number),
    defaultValue: PropTypes.number,
  }),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  }),
  pagination: PropTypes.bool,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  searchButtonClickEventHandler: PropTypes.func,
};

DataTable.defaultProps = {
  entriesPerPage: {
    entries: ["10", "50", "100", "150", "200", "500"],
    defaultValue: 10,
  },
  canSearch: true,
  showTotalEntries: true,
  table: {
    columns: [],
    rows: [],
  },
  pagination: true,
  isSorted: false,
  noEndBorder: true,
  searchButtonClickEventHandler: null,
};

export default DataTable;
