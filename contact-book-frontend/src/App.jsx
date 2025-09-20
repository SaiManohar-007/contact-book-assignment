import React, { useState, useEffect } from "react";
const API_URL = "http://localhost:8080/contacts";
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}?page=1&limit=100`);
      const data = await res.json();
      setContacts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setContacts([]);
      console.error("Failed to fetch contacts", err);
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!/.+@.+\..+/.test(form.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone must be 10 digits");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newContact = await res.json();
        setContacts([newContact, ...contacts]);
        setForm({ name: "", email: "", phone: "" });
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to add contact");
      }
    } catch {
      setError("Server error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
      }
    } catch {}
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Contact Book</h1>
        <div className="layout">
          <div className="contacts">
            {(contacts ?? []).length === 0 ? (
              <p>No contacts, click <strong>Add</strong> to add one.</p>
            ) : (
              <ul className="contact-list">
                {(contacts ?? []).map((contact) => (
                  <li key={contact._id} className="contact-card">
                    <div>
                      <strong>{contact.name}</strong>
                      <br />
                      <small>{contact.email}</small>
                      <br />
                      <small>{contact.phone}</small>
                    </div>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-wrapper">
            <h2>Add New Contact</h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone (10 digits)"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="\d{10}"
                title="Phone must be exactly 10 digits"
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="add-btn">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
