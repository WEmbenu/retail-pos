import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  FileQuestion,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Tooltip from "../Tooltip";
import { AiOutlineDeleteColumn } from "react-icons/ai";
import { TbMoodEmpty } from "react-icons/tb";
import ReusableLoader from "../ReusableLoader";
import { Input } from "../ui/input";

// TruncatedText component with Tooltip
const TruncatedText = ({
  text,
  maxLength = 50,
  className = "",
  wrapText = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = String(text).length > maxLength;
  if (!shouldTruncate) {
    return (
      <span
        className={`${className} ${
          wrapText ? "whitespace-normal break-words" : "whitespace-nowrap"
        }`}
      >
        {text}
      </span>
    );
  }

  return (
    <Tooltip text={isExpanded ? "Click to collapse" : "Click to expand"}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer hover:text-gray-500 rounded p-1 -m-1 transition-colors ${className} ${
          wrapText ? "whitespace-normal break-words" : "whitespace-nowrap"
        }`}
      >
        {isExpanded ? String(text) : `${String(text).slice(0, maxLength)}...`}
      </div>
    </Tooltip>
  );
};

// CellContent component with vertical wrapping
const CellContent = ({ field, value, row }) => {
  if (field.render) {
    const renderedContent = field.render(value, row);
    if (typeof renderedContent === "string" && !field.noTruncate) {
      return (
        <TruncatedText
          text={renderedContent}
          maxLength={field.maxLength || 50}
          className={field.className || ""}
          wrapText={!field.noWrap}
        />
      );
    }
    return renderedContent;
  }

  if (
    field.noTruncate ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    field.name === "actions" ||
    !value
  ) {
    return (
      <div
        className={`${
          field.noWrap ? "whitespace-nowrap" : "whitespace-normal break-words"
        }`}
      >
        {value}
      </div>
    );
  }

  return (
    <TruncatedText
      text={String(value)}
      maxLength={field.maxLength || 50}
      className={field.className || ""}
      wrapText={!field.noWrap}
    />
  );
};

// TableHeader component with column selector
const TableHeader = ({
  title,
  searchTerm,
  setSearchTerm,
  totalCount,
  filteredCount,
  children,
  fields,
  visibleColumns,
  setVisibleColumns,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b pb-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="w-full sm:w-64">
              <Input
                type="text"
                variant="icon"
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Filter ${title.toLowerCase()}...`}
                className="w-full"
              />
            </div>
            <div className="flex-grow">{children}</div>
          </div>
          <div className="flex justify-between sm:justify-end items-center gap-1">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <Tooltip text="View columns">
                <DropdownMenuTrigger className="p-1 cursor-pointer text-cyan-700 hover:text-cyan-500 hover:bg-cyan-200 rounded outline-none">
                  <Settings size={13} />
                </DropdownMenuTrigger>
              </Tooltip>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white erase-effect-show p-0"
              >
                <div className="bg-cyan-100 p-1 flex justify-between items-center text-cyan-500">
                  <span className="text-sm font-semibold">Columns</span>
                  <AiOutlineDeleteColumn />
                </div>
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className="flex items-center px-1 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (visibleColumns.includes(field.name)) {
                        setVisibleColumns(
                          visibleColumns.filter((col) => col !== field.name)
                        );
                      } else {
                        setVisibleColumns([...visibleColumns, field.name]);
                      }
                    }}
                  >
                    <span className="flex-grow text-xs">{field.title}</span>
                    {visibleColumns.includes(field.name) ? (
                      <Eye className="text-gray-600" size={14} />
                    ) : (
                      <EyeOff className="text-gray-400" size={14} />
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs sm:text-sm text-gray-600">
              {searchTerm
                ? `Found ${filteredCount} of ${totalCount} records`
                : `${totalCount} Results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// TablePagination component
const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-4 py-3 bg-white border-t gap-2">
      <div className="flex items-center text-xs sm:text-sm text-gray-700 space-x-2 order-2 sm:order-1">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border rounded px-1 sm:px-2 py-1"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-700 order-3 w-full sm:w-auto text-center sm:text-right mt-2 sm:mt-0">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
      </div>
    </div>
  );
};

// EmptyState component for no data
const EmptyState = ({ searchTerm, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <TbMoodEmpty size={48} className="text-orange-300 mb-3" />
      <p className="text-base font-medium text-txt_body_prim_col mb-2">
        {searchTerm ? "No matching records found" : "No records available"}
      </p>
      <p className="text-xs text-txt_body_sec_col text-center max-w-md">
        {searchTerm
          ? "Try adjusting your search terms or clearing filters to see more results."
          : message || "There are no entries to display at this time."}
      </p>
    </div>
  );
};

// LoadingState component
const LoadingState = ({ columnsCount }) => {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center py-8">
      <ReusableLoader title={"Loading data in the table, please wait..."} />
      <p className="text-sm text-gray-600">Loading data, please wait...</p>
    </div>
  );
};

// Main JTable component
const JTable = ({
  title = "Records",
  data = [],
  fields = [],
  childTable = null,
  childDataKey = "children",
  pageSize: initialPageSize = 10,
  children,
  headerComponent: HeaderComponent = null,
  loading = false,
  emptyStateMessage = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [childPages, setChildPages] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    fields.map((field) => field.name)
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== childDataKey &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, childDataKey]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Apply sorting
  useEffect(() => {
    if (sortConfig.key) {
      const sortedData = [...filteredData].sort((a, b) => {
        // Skip sorting if value is undefined or null
        if (a[sortConfig.key] == null) return 1;
        if (b[sortConfig.key] == null) return -1;

        // Handle different data types
        if (
          typeof a[sortConfig.key] === "number" &&
          typeof b[sortConfig.key] === "number"
        ) {
          return sortConfig.direction === "asc"
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        } else {
          const valueA = String(a[sortConfig.key]).toLowerCase();
          const valueB = String(b[sortConfig.key]).toLowerCase();
          return sortConfig.direction === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig]);

  const handleSort = (fieldName) => {
    // Skip sorting for actions column
    if (fieldName === "actions") return;

    let direction = "asc";
    if (sortConfig.key === fieldName && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: fieldName, direction });
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    if (!childPages[id]) {
      setChildPages((prev) => ({
        ...prev,
        [id]: { page: 1, pageSize: 5 },
      }));
    }
  };

  const getColumnWidth = (field) => {
    if (field.width) return field.width;
    if (field.name === "actions") return "w-auto";
    return "w-auto max-w-[30%]";
  };

  const visibleFields = fields.filter((field) =>
    visibleColumns.includes(field.name)
  );

  return (
    <div className="w-full rounded overflow-hidden bg-white p-2">
      <TableHeader
        title={title}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalCount={data.length}
        filteredCount={filteredData.length}
        fields={fields}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      >
        {HeaderComponent ? <HeaderComponent /> : children}
      </TableHeader>

      <div className="w-full overflow-x-auto">
        <table className="w-full border table-default text-txt_body_prim_col min-w-[640px]">
          <thead className="sticky top-0 bg-btn_col z-10">
            <tr className="table-header">
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-700 w-12 sm:w-16">
                <span className="text-xs sm:text-sm">No.</span>
              </th>
              {visibleFields.map((field) => (
                <th
                  key={field.name}
                  className={`px-2 sm:px-4 py-2 text-left font-medium text-gray-700 ${getColumnWidth(
                    field
                  )}`}
                  style={field.minWidth ? { minWidth: field.minWidth } : {}}
                >
                  <div
                    className={`flex items-center ${
                      field.name !== "actions" ? "cursor-pointer " : ""
                    }`}
                    onClick={() =>
                      field.name !== "actions" && handleSort(field.name)
                    }
                  >
                    <span className="text-xs sm:text-sm">{field.title}</span>
                    {field.name !== "actions" && (
                      <div className="ml-1 flex flex-col">
                        {sortConfig.key === field.name ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )
                        ) : (
                          <div className="flex flex-col opacity-30">
                            <ArrowUp className="w-2 h-2" />
                            <ArrowDown className="w-2 h-2 -mt-1" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white table-body">
            {loading ? (
              <tr>
                <td colSpan={visibleFields.length + 1}>
                  <LoadingState columnsCount={visibleFields.length + 1} />
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <React.Fragment key={row.id || index}>
                  <tr
                    className={`${
                      expandedRow === row.id ? "!bg-blue-50" : ""
                    } hover:bg-gray-50 text-xs sm:text-sm`}
                  >
                    <td className="px-2 sm:px-4 py-2 align-top">
                      <div className="flex items-start">
                        <div className="w-3 sm:w-4 mr-1 sm:mr-2">
                          {childTable && row[childDataKey]?.length > 0 && (
                            <button
                              onClick={() => toggleRow(row.id)}
                              className="hover:bg-gray-200 rounded"
                            >
                              <ChevronRight
                                className={`w-3 h-3 sm:w-4 sm:h-4 transform transition-transform ${
                                  expandedRow === row.id ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        <div>{(currentPage - 1) * pageSize + index + 1}</div>
                      </div>
                    </td>
                    {visibleFields.map((field) => (
                      <td
                        key={field.name}
                        className={`px-2 sm:px-4 py-2 align-top ${getColumnWidth(
                          field
                        )} ${field.tdClassName || ""}`}
                      >
                        <CellContent
                          field={field}
                          value={row[field.name]}
                          row={row}
                        />
                      </td>
                    ))}
                  </tr>
                  {childTable &&
                    expandedRow === row.id &&
                    row[childDataKey]?.length > 0 && (
                      <tr>
                        <td
                          colSpan={visibleFields.length + 1}
                          className="bg-blue-50 p-2 sm:p-4"
                        >
                          <div className="bg-blue-50 rounded p-2 sm:p-4">
                            <JTable
                              {...childTable}
                              data={row[childDataKey] || []}
                              pageSize={5}
                            >
                              {childTable.headerComponent &&
                                childTable.headerComponent(row)}
                            </JTable>
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={visibleFields.length + 1}>
                  <EmptyState
                    searchTerm={searchTerm}
                    message={emptyStateMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && !loading && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredData.length}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default JTable;
