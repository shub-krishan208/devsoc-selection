import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";

/**
 * @dev setting up the data for the table:
 *  user table
 * items table
 */

// --- FAKE DATA (Same as before) ---
const mockUsers = [
  {
    id: 1,
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    password: "$2a$10$abcdefghijklmnopqrstuv",
  },
  {
    id: 2,
    username: "john_doe",
    email: "john.d@example.com",
    role: "user",
    password: "$2a$10$wxyzabcdefghijklmnopqr",
  },
];
// --- END FAKE DATA ---

// --- NEW COMPONENT: Searchable Dropdown ---
const SearchableDropdown = ({ options = [], placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none flex justify-between items-center"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-muted-foreground">No results</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- NEW COMPONENT: Main Filters Form ---
const ItemFilters = ({
  categories,
  locations,
  filters,
  setFilters,
  setIsCreateModalOpen,
}) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: "", category: "", location: "", date: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: 0.3 }}
      //   className="overflow-hidden" //commmented this out as it waws clipping the dropdown menu
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 py-4">
        {/* Status */}
        <div className="lg:col-span-1">
          <label className="block text-sm mb-1 text-muted-foreground">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Category */}
        <div className="lg:col-span-2">
          <label className="block text-sm mb-1 text-muted-foreground">
            Category
          </label>
          <SearchableDropdown
            options={categories}
            placeholder="Select a category"
            value={filters.category}
            onChange={(val) => handleFilterChange("category", val)}
          />
        </div>

        {/* Location */}
        <div className="lg:col-span-2">
          <label className="block text-sm mb-1 text-muted-foreground">
            Location
          </label>
          <SearchableDropdown
            options={locations}
            placeholder="Select a location"
            value={filters.location}
            onChange={(val) => handleFilterChange("location", val)}
          />
        </div>

        {/* Date */}
        <div className="lg:col-span-1">
          <label className="block text-sm mb-1 text-muted-foreground">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
      <div className="justify-between flex">
        <div className="flex gap-2 pb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-medium hover:brightness-125 transition"
          >
            +New
          </button>
          <form className="w-full max-w-md">
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Search Using ID ..."
                  className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* Search Button */}
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:brightness-110"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 pb-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground font-medium hover:brightness-125 transition"
          >
            Clear
          </button>
          <button className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition">
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ItemDetailsModal = ({ item, onClose }) => {
  // A small component to render each detail row
  const [testInput, setTestInput] = useState("");
  const DetailRow = ({ label, value, isBadge = false, isPreWrap = false }) => (
    <div className="py-2 border-b border-border/50">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      {isBadge ? (
        <span
          className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === "lost"
              ? "bg-red-700/20 text-red-500"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {value}
        </span>
      ) : (
        <p
          className={`text-sm text-foreground ${
            isPreWrap ? "whitespace-pre-wrap" : ""
          }`}
        >
          {value || "N/A"}
        </p>
      )}
    </div>
  );
  return (
    <div
      onClick={onClose}
      className="fixed text-left inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-lg flex flex-col"
      >
        <header className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Item Details
          </h3>
          <input
            type="text"
            name="title"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </header>
        +
        <main className="p-4 max-h-[70vh] overflow-y-auto">
          <DetailRow label="Item ID" value={item.id} />
          <DetailRow label="Title" value={item.title} />
          <DetailRow
            label="Description"
            value={item.description}
            isPreWrap={true}
          />
          <DetailRow label="Status" value={item.status} isBadge={true} />
          <DetailRow label="Category" value={item.category} />
          <DetailRow label="Location" value={item.location} />
          <DetailRow label="Date" value={item.date} />
          <DetailRow label="Reporter ID" value={item.User.id} />
          <DetailRow label="Reporter" value={item.User.username} />
          <DetailRow label="Reporter contact" value={item.User.email} />
          <DetailRow label="Contact Info" value={item.contactInfo} />
          <DetailRow label="Image URL" value={item.imageURL} />
        </main>
        <footer className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition"
          >
            Close
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

const CreateItemModal = ({ onClose, onSubmit }) => {
  // State to hold all form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "lost", // Default status
    category: "",
    location: "",
    date: "",
    contactInfo: "",
    imageURL: "",
  });

  // A generic handler to update state for any input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass form data to the parent's handler
    onClose(); // Close the modal after submission
  };

  // A reusable component for each form row to reduce boilerplate
  const FormRow = ({ label, children }) => (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed text-left inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-lg flex flex-col"
      >
        <header className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Create New Item
          </h3>
        </header>

        <form onSubmit={handleSubmit}>
          <main className="p-4 max-h-[70vh] overflow-y-auto">
            <FormRow label="Title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
            <FormRow label="Description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormRow label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </FormRow>
              <FormRow label="Category">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </FormRow>
            </div>
            <FormRow label="Location">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
            <FormRow label="Date">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
            <FormRow label="Contact Info (Phone or Email)">
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
            <FormRow label="Image URL (Optional)">
              <input
                type="text"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </FormRow>
          </main>

          <footer className="p-4 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground font-medium hover:brightness-125 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition"
            >
              Create Item
            </button>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};

const ItemsTable = ({ items, onSelectItem }) => (
  <table className="w-full text-sm text-left border-collapse">
    <thead className="sticky top-0 bg-card z-10">
      <tr>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          ID
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Title
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Status
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Category
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Date
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border text-center">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id} className="even:bg-accent/50 hover:bg-accent">
          <td className="p-3 border-b border-border">{item.id}</td>
          <td className="p-3 border-b border-border font-medium text-foreground max-w-xs truncate">
            {item.title}
          </td>
          <td className="p-3 border-b border-border">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.status === "lost"
                  ? "bg-red-700/20 text-red-500"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {item.status}
            </span>
          </td>
          <td className="p-3 border-b border-border">{item.category}</td>
          <td className="p-3 border-b border-border text-muted-foreground">
            {item.date}
          </td>
          <td className="p-3 border-b border-border text-center">
            <button
              onClick={() => onSelectItem(item)}
              className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const UsersTable = ({ users }) => (
  <table className="w-full text-sm text-left border-collapse">
    <thead className="sticky top-0 bg-card z-10">
      <tr>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          ID
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Username
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Email
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Role
        </th>
        <th className="p-3 font-medium text-muted-foreground border-b border-border">
          Password Hash
        </th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id} className="even:bg-accent/50 hover:bg-accent">
          <td className="p-3 border-b border-border">{user.id}</td>
          <td className="p-3 border-b border-border font-medium text-foreground">
            {user.username}
          </td>
          <td className="p-3 border-b border-border text-primary">
            {user.email}
          </td>
          <td className="p-3 border-b border-border">
            <span
              className={`font-medium ${
                user.role === "admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {user.role}
            </span>
          </td>
          <td className="p-3 border-b border-border text-muted-foreground max-w-sm truncate font-mono text-xs">
            {user.password}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function Database() {
  const userRole = localStorage.getItem("authToken")?.split(" ")[2];

  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentTable, setCurrentTable] = useState("items");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // State now holds the entire item object
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    location: "",
    date: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // getting items table ...
  const getItems = async () => {
    const baseUrl = `http://localhost:5000/api/items`;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.append(key, value);
      }
    }

    const queryString = params.toString();

    const itemsUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("Fetching from URL:", itemsUrl); // For debugging
    try {
      console.log("Fetching Items ...");
      const res = await fetch(itemsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken"),
        },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Server response", data);
      setItems(data);
    } catch (err) {
      console.error("Error getting data:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      // Define an async function inside the effect
      const fetchData = async () => {
        setIsLoading(true);
        await getItems(); // Correctly await the async fetch function
        if (userRole === "admin") {
          setUsers(mockUsers);
        }
        setIsLoading(false);
      };

      fetchData(); // Call the async function

      // Add 'filters' to the dependency array
    }
  }, [userRole, filters]);
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  );

  const locations = useMemo(
    () => [...new Set(items.map((item) => item.location))],
    [items]
  );
  const TabButton = ({ table, children }) => (
    <button
      onClick={() => setCurrentTable(table)}
      className={`py-2 px-4 text-sm font-medium transition-colors duration-200 
        ${
          currentTable === table
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
    >
      {children}
    </button>
  );
  const isLogin = localStorage.getItem("authToken");

  const handleCreateSubmit = async (newItemData) => {
    console.log("Submitting new item:", newItemData);
    // --- Your API call logic will go here ---
    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authToken"),
        },
        body: JSON.stringify(newItemData),
      });
      if (res.ok) {
        await getItems(); // Re-fetch items to show the new one
      } else {
        console.error("Failed to create item.");
      }
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  // const handleCreateNew = () => setIsCreateModalOpen(true);
  if (isLogin && isLogin.startsWith("Bearer")) {
    // getItems();
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-7xl h-[90vh] bg-card text-foreground rounded-2xl shadow-lg flex flex-col p-6"
        >
          <header className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Database Dashboard</h1>
            {currentTable === "items" && (
              <ItemFilters
                categories={categories}
                locations={locations}
                filters={filters}
                setFilters={setFilters}
                setIsCreateModalOpen={setIsCreateModalOpen}
              />
            )}

            {userRole === "admin" && (
              <nav className="mt-4 border-b border-border">
                <TabButton table="items">Items</TabButton>
                <TabButton table="users">Users</TabButton>
              </nav>
            )}
          </header>

          <main className="flex-grow mt-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <>
                {currentTable === "items" && (
                  <ItemsTable items={items} onSelectItem={setSelectedItem} />
                )}
                {userRole === "admin" && currentTable === "users" && (
                  <UsersTable users={users} />
                )}
              </>
            )}
          </main>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedItem && (
            <ItemDetailsModal
              key="details-prop"
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}

          {isCreateModalOpen && (
            <CreateItemModal
              key="create-prop"
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-8">
            You must be logged in to view the database.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition-transform hover:scale-105"
          >
            Return to Login
          </Link>
        </motion.div>
      </div>
    );
  }
}
