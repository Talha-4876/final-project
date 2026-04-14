import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3200/api/contact");
      setContacts(res.data.contacts);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      <div className="grid gap-4">
        {contacts.map((c) => (
          <div key={c._id} className="bg-white p-4 shadow rounded">
            <p><b>Name:</b> {c.name}</p>
            <p><b>Email:</b> {c.email}</p>
            <p><b>Phone:</b> {c.phone}</p>
            <p><b>Message:</b> {c.message}</p>
            <p><b>Location:</b> {c.location}</p>
            <p><b>IP:</b> {c.ip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;