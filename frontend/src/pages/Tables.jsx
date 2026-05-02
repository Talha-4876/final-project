import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom";
import table1 from "../assets/T1.jpg";
import table2 from "../assets/T2.jpg";
import table3 from "../assets/T3.jpeg";
import table4 from "../assets/T4.jpg";
import table5 from "../assets/T5.jpg";
import table6 from "../assets/T6.jpg";

const tableImages = [table1, table2, table3, table4, table5, table6];

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/tables/status`);
      if (res.data.success) setTables(res.data.tables);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-orange-500">
        Tables Availability
      </h2>
      <p className="text-center text-gray-400 text-sm mb-8">
        Real-time table status dekhein
      </p>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mb-8 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="text-gray-300">Available</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-gray-300">Booked</span>
        </span>
      </div>

      {/* TABLES GRID */}
      {loading ? (
        <p className="text-center text-orange-400 text-lg animate-pulse">
          Loading tables...
        </p>
      ) : tables.length === 0 ? (
        <p className="text-center text-gray-400">Koi table nahi mili.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tables.map((table, index) => (
            <div
              key={table._id}
              onClick={() =>
                table.status === "Available" && navigate("/book-table")
              }
              className={`relative rounded-2xl shadow-2xl overflow-hidden h-64 transition-transform
                ${table.status === "Available"
                  ? "cursor-pointer hover:scale-[1.02]"
                  : "cursor-not-allowed opacity-80"
                }`}
            >
              <img
                src={tableImages[index % tableImages.length]}
                alt={`Table ${table.tableNumber}`}
                className="w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 flex flex-col justify-center items-center
                  ${table.status === "Booked" ? "bg-red-900/80" : "bg-black/60"}`}
              >
                <h3 className="text-white text-2xl font-bold">
                  Table {table.tableNumber}
                </h3>

                {table.label && (
                  <p className="text-yellow-300 text-sm">{table.label}</p>
                )}

                <p className="text-gray-300 text-sm">Seats: {table.seats}</p>

                <span
                  className={`px-4 py-1 mt-3 rounded-full text-sm font-bold
                    ${table.status === "Booked"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                    }`}
                >
                  {table.status === "Booked" ? "🔴 Booked" : "🟢 Available"}
                </span>

                {table.status === "Available" && (
                  <p className="text-xs text-yellow-300 mt-2 opacity-80">
                    Click karein to Book →
                  </p>
                )}

                {table.status === "Booked" && (
                  <p className="text-xs text-red-300 mt-2 opacity-80">
                    Is waqt available nahi
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Tables;