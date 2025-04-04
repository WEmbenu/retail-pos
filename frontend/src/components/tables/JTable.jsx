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
  Filter,
  Download,
  Columns,
  AlertTriangle,
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
import { motion, AnimatePresence } from "framer-motion";

// TruncatedText component with Tooltip and animations
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
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer rounded p-1 -m-1 transition-all ${className} ${
          wrapText ? "whitespace-normal break-words" : "whitespace-nowrap"
        } hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-700 dark:text-gray-300 hover:text-cyan-700 dark:hover:text-cyan-400`}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.span
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {String(text)}
            </motion.span>
          ) : (
            <motion.span
              key="truncated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {`${String(text).slice(0, maxLength)}...`}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Tooltip>
  );
};

// Enhanced CellContent component
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
        } text-gray-700 dark:text-gray-300`}
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

// Enhanced TableHeader component
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
  exportData,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center">
          {title}
          {searchTerm && filteredCount < totalCount && (
            <span className="ml-2 text-xs font-normal bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-full">
              Filtered
            </span>
          )}
        </h2>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="w-full sm:w-64 relative">
              <Input
                type="text"
                variant="icon"
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full  py-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 focus:border-cyan-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:focus:ring-cyan-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex-grow flex flex-wrap gap-2">{children}</div>
          </div>
          <div className="flex justify-between sm:justify-end items-center gap-3">
            <div className="flex items-center space-x-2">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <Tooltip text="Manage columns">
                  <DropdownMenuTrigger className="p-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors flex items-center gap-1.5">
                    <Columns size={14} />
                    <span className="text-xs hidden sm:inline">Columns</span>
                  </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-md overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Toggle Columns</span>
                    <Columns size={14} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto py-1">
                    {fields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-gray-700 dark:text-gray-300"
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
                        <span className="flex-grow text-sm">{field.title}</span>
                        <div
                          className={`ml-2 rounded-full p-0.5 ${
                            visibleColumns.includes(field.name)
                              ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {visibleColumns.includes(field.name) ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {exportData && (
                <Tooltip text="Export data">
                  <button
                    onClick={exportData}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span className="text-xs hidden sm:inline">Export</span>
                  </button>
                </Tooltip>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? `${filteredCount} of ${totalCount} records`
                : `${totalCount} ${totalCount === 1 ? "record" : "records"}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced TablePagination component
const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizeOptions = [5, 10, 20, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 sm:px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 gap-2">
      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-x-2 order-2 sm:order-1">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:focus:ring-cyan-400"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>per page</span>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <div className="px-2 sm:px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <span className="hidden sm:inline">Page </span>
          {currentPage}{" "}
          <span className="text-gray-500 dark:text-gray-400">of</span>{" "}
          {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-3 w-full sm:w-auto text-center sm:text-right mt-2 sm:mt-0">
        {totalItems > 0 ? (
          <>
            Showing{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {totalItems}
            </span>{" "}
            entries
          </>
        ) : (
          <span>No entries</span>
        )}
      </div>
    </div>
  );
};

// Enhanced EmptyState component
const EmptyState = ({ searchTerm, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
      {searchTerm ? (
        <>
          <Filter
            size={48}
            className="text-orange-300 dark:text-orange-500 mb-3 opacity-70"
          />
          <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            No matching records found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            Try adjusting your search terms or clearing filters to see more
            results.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm flex items-center gap-2 transition-colors"
          >
            <AlertTriangle size={14} />
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <TbMoodEmpty
            size={48}
            className="text-gray-300 dark:text-gray-600 mb-3"
          />
          <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            No records available
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            {message || "There are no entries to display at this time."}
          </p>
        </>
      )}
    </div>
  );
};

// Enhanced LoadingState component
const LoadingState = ({ columnsCount, title }) => {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center py-8 bg-white dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-cyan-500 dark:border-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2
              size={24}
              className="text-cyan-600 dark:text-cyan-400 animate-pulse"
            />
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          {title || "Loading data..."}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Please wait while we retrieve your data
        </p>
      </div>
    </div>
  );
};

// Enhanced JTable component
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
  exportData = null,
  loadingMessage = null,
  tableClassName = "",
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

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
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
    <div
      className={`w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${tableClassName}`}
    >
      <div className="p-4">
        <TableHeader
          title={title}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalCount={data.length}
          filteredCount={filteredData.length}
          fields={fields}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          exportData={exportData}
        >
          {HeaderComponent ? <HeaderComponent /> : children}
        </TableHeader>

        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full text-gray-700 dark:text-gray-300 min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-12 sm:w-16 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs sm:text-sm">#</span>
                </th>
                {visibleFields.map((field) => (
                  <th
                    key={field.name}
                    className={`px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 ${getColumnWidth(
                      field
                    )}`}
                    style={field.minWidth ? { minWidth: field.minWidth } : {}}
                  >
                    <div
                      className={`flex items-center ${
                        field.name !== "actions" ? "cursor-pointer group" : ""
                      }`}
                      onClick={() =>
                        field.name !== "actions" && handleSort(field.name)
                      }
                    >
                      <span className="text-xs sm:text-sm">{field.title}</span>
                      {field.name !== "actions" && (
                        <div className="ml-1 flex items-center text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                          {sortConfig.key === field.name ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                            )
                          ) : (
                            <div className="flex flex-col">
                              <ArrowUp className="w-2.5 h-2.5 -mb-1" />
                              <ArrowDown className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleFields.length + 1}>
                    <LoadingState
                      columnsCount={visibleFields.length + 1}
                      title={loadingMessage}
                    />
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <React.Fragment key={row.id || index}>
                    <tr
                      className={`
                        border-b border-gray-100 dark:border-gray-700/50 last:border-0
                        ${
                          expandedRow === row.id
                            ? "bg-cyan-50/50 dark:bg-cyan-900/10"
                            : ""
                        }
                        hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors
                      `}
                    >
                      <td className="px-3 py-2.5 align-top">
                        <div className="flex items-start">
                          <div className="w-5 mr-2">
                            {childTable && row[childDataKey]?.length > 0 && (
                              <button
                                onClick={() => toggleRow(row.id)}
                                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                              >
                                <ChevronRight
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    expandedRow === row.id
                                      ? "rotate-90 text-cyan-600 dark:text-cyan-400"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                          <div className="font-medium text-gray-600 dark:text-gray-400">
                            {(currentPage - 1) * pageSize + index + 1}
                          </div>
                        </div>
                      </td>
                      {visibleFields.map((field) => (
                        <td
                          key={field.name}
                          className={`px-3 py-2.5 align-top ${getColumnWidth(
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
                            className="bg-cyan-50/30 dark:bg-cyan-900/5 p-0"
                          >
                            <div className="mx-4 my-3 border-l-2 border-cyan-400 dark:border-cyan-700 pl-3">
                              <JTable
                                {...childTable}
                                data={row[childDataKey] || []}
                                pageSize={5}
                                tableClassName="border-none shadow-none"
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
