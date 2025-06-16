import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";

import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "AgGrid/HRExample.module.css";
import { ContactCellRenderer } from "AgGrid/cell-renderers/ContactCellRenderer";
import { EmployeeCellRenderer } from "AgGrid/cell-renderers/EmployeeCellRenderer";
import { FlagCellRenderer } from "AgGrid/cell-renderers/FlagCellRenderer";
import { StatusCellRenderer } from "AgGrid/cell-renderers/StatusCellRenderer";
import { TagCellRenderer } from "AgGrid/cell-renderers/TagCellRenderer";
import { getData } from "AgGrid/data";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
]);

const employmentType = ["Permanent", "Contract"];
const paymentMethod = ["Cash", "Check", "Bank Transfer"];
const paymentStatus = ["Paid", "Pending"];
const departments = {
  executiveManagement: "Executive Management",
  legal: "Legal",
  design: "Design",
  engineering: "Engineering",
  product: "Product",
  customerSupport: "Customer Support",
};
const departmentFormatter = ({ value }) =>
  departments[value] ?? "";

export const HRExample = ({ gridTheme = "ag-theme-quartz", isDarkMode }) => {
  const gridRef = useRef(null);

  const [colDefs] = useState([
    {
      headerName: "ID",
      field: "employeeId",
      width: 120,
    },
    {
      field: "department",
      width: 250,
      minWidth: 250,
      flex: 1,
      valueFormatter: departmentFormatter,
      cellRenderer: TagCellRenderer,
    },
    {
      field: "employmentType",
      editable: true,
      width: 180,
      minWidth: 180,
      flex: 1,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: employmentType,
      },
    },
    {
      field: "location",
      width: 200,
      minWidth: 200,
      flex: 1,
      cellRenderer: FlagCellRenderer,
      editable: true,
    },
    {
      field: "joinDate",
      editable: true,
      width: 120,
    },
    {
      headerName: "Salary",
      field: "basicMonthlySalary",
      valueFormatter: ({ value }) =>
        value == null ? "" : `$${Math.round(value).toLocaleString()}`,
    },
    {
      field: "paymentMethod",
      editable: true,
      width: 180,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: paymentMethod,
      },
    },
    {
      headerName: "Status",
      field: "paymentStatus",
      editable: true,
      width: 100,
      cellRenderer: StatusCellRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: paymentStatus,
      },
    },
    {
      field: "contact",
      pinned: "right",
      cellRenderer: ContactCellRenderer,
      width: 120,
    },
  ]);
  const [rowData] = useState(getData());
  const getDataPath = useCallback((data) => data.orgHierarchy, []);
  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Employee",
      width: 330,
      pinned: "left",
      sort: "asc",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: EmployeeCellRenderer,
      },
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`${themeClass} ${styles.grid}`}>
          <AgGridReact
            theme="inherit"
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
            groupDefaultExpanded={-1}
            getDataPath={getDataPath}
            treeData
            autoGroupColumnDef={autoGroupColumnDef}
          />
        </div>
      </div>
    </div>
  );
};
