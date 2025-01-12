import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    revenueMin: "",
    revenueMax: "",
    netIncomeMin: "",
    netIncomeMax: "",
  });
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=8K0sjicOBOQ8JiDnnN1XWndotLGHQQc5"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    let filteredData = [...data];

    // Date Range Filter
    if (filters.startDate && filters.endDate) {
      filteredData = filteredData.filter(
        (item) => item.date >= filters.startDate && item.date <= filters.endDate
      );
    }

    // Revenue Range Filter
    if (filters.revenueMin || filters.revenueMax) {
      filteredData = filteredData.filter(
        (item) =>
          item.revenue >= (filters.revenueMin || 0) &&
          item.revenue <= (filters.revenueMax || Infinity)
      );
    }

    // Net Income Range Filter
    if (filters.netIncomeMin || filters.netIncomeMax) {
      filteredData = filteredData.filter(
        (item) =>
          item.netIncome >= (filters.netIncomeMin || 0) &&
          item.netIncome <= (filters.netIncomeMax || Infinity)
      );
    }

    return filteredData;
  };

  const sortedData = applyFilters().sort((a, b) => {
    if (!sortKey) return 0;
    const isAsc = sortOrder === "asc";
    if (a[sortKey] < b[sortKey]) return isAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return isAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Apple Financial Data</h1>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <input
          type="date"
          className="p-2 border rounded"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          className="p-2 border rounded"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Revenue Min"
          value={filters.revenueMin}
          onChange={(e) =>
            setFilters({ ...filters, revenueMin: e.target.value })
          }
        />
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Revenue Max"
          value={filters.revenueMax}
          onChange={(e) =>
            setFilters({ ...filters, revenueMax: e.target.value })
          }
        />
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Net Income Min"
          value={filters.netIncomeMin}
          onChange={(e) =>
            setFilters({ ...filters, netIncomeMin: e.target.value })
          }
        />
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Net Income Max"
          value={filters.netIncomeMax}
          onChange={(e) =>
            setFilters({ ...filters, netIncomeMax: e.target.value })
          }
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date {sortKey === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("revenue")}
              >
                Revenue {sortKey === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("netIncome")}
              >
                Net Income{" "}
                {sortKey === "netIncome" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-2 border">Gross Profit</th>
              <th className="p-2 border">EPS</th>
              <th className="p-2 border">Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 border">{row.date}</td>
                <td className="p-2 border">${row.revenue.toLocaleString()}</td>
                <td className="p-2 border">${row.netIncome.toLocaleString()}</td>
                <td className="p-2 border">${row.grossProfit.toLocaleString()}</td>
                <td className="p-2 border">{row.eps}</td>
                <td className="p-2 border">
                  ${row.operatingIncome.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
