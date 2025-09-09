import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// --- FAKE DATA (Same as before) ---
const mockItems = [
  {
    id: 1,
    title: "Laptop Charger",
    description:
      "Dell 90W charger left near the library charging station. It has a slightly frayed cable near the connector but otherwise works perfectly. My name is written on the power brick in silver marker.",
    status: "lost",
    category: "Electronics",
    location: "Library",
    date: "2025-09-08",
    contactInfo: "user1@example.com",
    imageURL: null,
  },
  {
    id: 2,
    title: "Blue Water Bottle",
    description:
      "HydroFlask, 32oz, has a small dent on the side and a sticker of a mountain range. It was found near the weightlifting area in the main gym.",
    status: "found",
    category: "Accessories",
    location: "Gym",
    date: "2025-09-07",
    contactInfo: "admin@example.com",
    imageURL: "https://example.com/image.jpg",
  },
  {
    id: 3,
    title: "Physics Textbook",
    description:
      '"Fundamentals of Physics" by Halliday & Resnick, 10th edition. It has yellow highlighting in chapters 5 through 8. Found on a desk in the back row.',
    status: "lost",
    category: "Books",
    location: "Lecture Hall 3",
    date: "2025-09-06",
    contactInfo: "user2@example.com",
    imageURL: null,
  },
  {
    id: 4,
    title: "Set of Keys",
    description:
      "A set of three keys on a silver ring. One is a car key (Toyota), one is a standard house key, and the third is a small mailbox key. The keychain is a miniature metal Eiffel Tower.",
    status: "found",
    category: "Personal",
    location: "Cafeteria",
    date: "2025-09-08",
    contactInfo: "finder@example.com",
    imageURL: null,
  },
  {
    id: 5,
    title: "Wireless Mouse",
    description:
      "Logitech MX Master 3. Black color. The scroll wheel is a bit loose. Last seen on one of the circular tables in the main student hub area.",
    status: "lost",
    category: "Electronics",
    location: "Student Hub",
    date: "2025-09-05",
    contactInfo: "user3@example.com",
    imageURL: null,
  },
  {
    id: 6,
    title: "Student ID Card",
    description:
      "ID for student Jane Doe, ID #123456. Found on the floor near the registrar's office window.",
    status: "found",
    category: "IDs",
    location: "Admin Office",
    date: "2025-09-09",
    contactInfo: "admin@example.com",
    imageURL: null,
  },
  {
    id: 7,
    title: "Black Umbrella",
    description:
      "A standard-sized black umbrella with a wooden handle. It has no specific brand markings or logos. It was left leaning against the wall just inside the main campus entrance.",
    status: "found",
    category: "Accessories",
    location: "Main Entrance",
    date: "2025-09-07",
    contactInfo: "security@example.com",
    imageURL: null,
  },
  {
    id: 8,
    title: "Airpods Pro Case",
    description:
      "This is just the empty charging case for a pair of Airpods Pro. It's white and has several minor scratches on the front. It was found in the grass near the large oak tree on the campus green.",
    status: "lost",
    category: "Electronics",
    location: "Campus Green",
    date: "2025-09-08",
    contactInfo: "user4@example.com",
    imageURL: null,
  },
];
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
const SearchableDropdown = ({ options, placeholder, value, onChange }) => {
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
const ItemFilters = ({ categories, locations }) => {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    location: "",
    date: "",
  });

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
            type="text"
            placeholder="DD/MM/YYYY"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
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
    </motion.div>
  );
};

const ItemDetailsModal = ({ item, onClose }) => {
  // A small component to render each detail row
  const DetailRow = ({ label, value, isBadge = false, isPreWrap = false }) => (
    <div className="py-2 border-b border-border/50">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      {isBadge ? (
        <span
          className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            value === "lost"
              ? "bg-destructive/20 text-destructive-foreground"
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
        </header>
        <main className="p-4 max-h-[70vh] overflow-y-auto">
          <DetailRow label="ID" value={item.id} />
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
                  ? "bg-destructive/20 text-destructive-foreground"
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
  const userRole = "admin";

  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentTable, setCurrentTable] = useState("items");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // State now holds the entire item object

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems(mockItems);
      if (userRole === "admin") {
        setUsers(mockUsers);
      }
      setIsLoading(false);
    }, 1000);
  }, [userRole]);
  const categories = [...new Set(mockItems.map((item) => item.category))];
  const locations = [...new Set(mockItems.map((item) => item.location))];
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
  if (isLogin && isLogin.startsWith("Bearer")) {
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
              <ItemFilters categories={categories} locations={locations} />
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

        <AnimatePresence>
          {selectedItem && (
            <ItemDetailsModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
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
