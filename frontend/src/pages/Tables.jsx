import React, { useContext, useEffect, useState } from "react";
import { BookingContext } from "../context/BookingContext";
import table1 from "../assets/T1.jpg";
import table2 from "../assets/T2.jpg";
import table3 from "../assets/T3.jpeg";
import table4 from "../assets/T4.jpg";
import table5 from "../assets/T5.jpg";
import table6 from "../assets/T6.jpg";

const tableImages = [table1, table2, table3, table4, table5, table6];

const Tables = () => {
  const { bookings } = useContext(BookingContext);

  const initialTables = [
    { id: 1, seats: 2 },
    { id: 2, seats: 4 },
    { id: 3, seats: 6 },
    { id: 4, seats: 8 },
    { id: 5, seats: 10 },
    { id: 6, seats: 12 },
  ];

  const [tables, setTables] = useState([]);

  useEffect(() => {
    let updatedTables = initialTables.map((t) => ({
      ...t,
      status: "Available",
      bookingName: null,
    }));

    bookings.forEach((b) => {
      const index = updatedTables.findIndex(
        (t) =>
          t.seats >= b.table.seats &&
          t.status === "Available"
      );

      if (index !== -1) {
        updatedTables[index] = {
          ...updatedTables[index],
          status: "Booked",
          bookingName: b.user.name,
        };
      }
    });

    setTables(updatedTables);
  }, [bookings]);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto  cursor-pointer" >
      <h2 className="text-4xl font-extrabold text-center mb-12 text-orange-500">
        Tables Availability
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tables.map((table, index) => (
          <div
            key={table.id}
            className="relative rounded-2xl shadow-2xl overflow-hidden h-64"
          >
            <img
              src={tableImages[index]}
              alt={`Table ${table.id}`}
              className="w-full h-full object-cover"
            />

            <div
              className={`absolute inset-0 flex flex-col justify-center items-center ${
                table.status === "Booked"
                  ? "bg-red-600/70"
                  : "bg-black/60"
              }`}
            >
              <h3 className="text-white text-2xl font-bold">
                Table {table.id}
              </h3>

              <p className="text-white">Seats: {table.seats}</p>

              <span
                className={`px-3 py-1 mt-2 rounded ${
                  table.status === "Booked"
                    ? "bg-yellow-300 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                {table.status}
              </span>

              {table.status === "Booked" && (
                <p className="text-white mt-2 text-sm">
                  {table.bookingName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tables;


