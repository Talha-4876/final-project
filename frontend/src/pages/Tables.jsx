import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../context/BookingContext';
import table1 from '../assets/T1.jpg';
import table2 from '../assets/T2.jpg';
import table3 from '../assets/T3.jpeg';
import table4 from '../assets/T4.jpg';
import table5 from '../assets/T5.jpg';
import table6 from '../assets/T6.jpg';

const tableImages = [table1, table2, table3, table4, table5, table6];

const Tables = () => {
  const { bookings } = useContext(BookingContext);

  const initialTables = [
    { id: 1, seats: 2, status: 'Available' },
    { id: 2, seats: 4, status: 'Available' },
    { id: 3, seats: 6, status: 'Available' },
    { id: 4, seats: 8, status: 'Available' },
    { id: 5, seats: 10, status: 'Available' },
    { id: 6, seats: 12, status: 'Available' },
   
  ];

  const [tables, setTables] = useState(initialTables);

  useEffect(() => {
    let updatedTables = initialTables.map(t => ({ ...t, status: 'Available', bookingName: null }));

    bookings.forEach((b) => {
      // Find first table with enough seats
      const tableIndex = updatedTables.findIndex(
        (t) => t.seats >= b.table.seats && t.status === 'Available'
      );
      if (tableIndex !== -1) {
        updatedTables[tableIndex] = {
          ...updatedTables[tableIndex],
          status: 'Booked',
          bookingName: b.user.name,
        };
      }
    });

    setTables(updatedTables);
  }, [bookings]);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-orange-500">
        Tables Availability
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tables.map((table, index) => (
          <div
            key={table.id}
            className="relative rounded-2xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-3xl h-64"
          >
            <img
              src={tableImages[index]}
              alt={`Table ${table.id}`}
              className="w-full h-full object-cover"
            />

            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                table.status === 'Booked'
                  ? 'from-red-700/70 to-red-400/40'
                  : 'from-black/70 to-black/30'
              } flex flex-col justify-center items-center text-center px-4`}
            >
              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                Table {table.id}
              </h3>
              <p className="text-white font-medium drop-shadow-md mb-1">
                Seats: {table.seats}
              </p>
              <span
                className={`px-4 py-1 rounded-full font-semibold text-sm ${
                  table.status === 'Booked'
                    ? 'bg-yellow-300 text-red-800'
                    : 'bg-green-500 text-white'
                } drop-shadow-md`}
              >
                {table.status}
              </span>

              {table.status === 'Booked' && table.bookingName && (
                <p className="text-white text-sm mt-2 drop-shadow-md">
                  Booked by: {table.bookingName}
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




