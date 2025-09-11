import User from "./user.js";
import Item from "./item.js";

console.log("Setting up model associations..."); // Add a log for debugging

// A User can have many Items
User.hasMany(Item, {
  foreignKey: "userId",
  onDelete: "CASCADE", // If a user is deleted, their items are also deleted
});

// An Item belongs to a single User
Item.belongsTo(User, {
  foreignKey: "userId",
});

const mockItems = [
  {
    title: "Laptop Charger",
    description:
      "Dell 90W charger left near the library charging station. It has a slightly frayed cable near the connector but otherwise works perfectly. My name is written on the power brick in silver marker.",
    status: "lost",
    category: "Electronics",
    location: "Library",
    date: "08-09-2025",
    contactInfo: "user1@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Blue Water Bottle",
    description:
      "HydroFlask, 32oz, has a small dent on the side and a sticker of a mountain range. It was found near the weightlifting area in the main gym.",
    status: "found",
    category: "Accessories",
    location: "Gym",
    date: "07-09-2025",
    contactInfo: "admin@example.com",
    imageURL: "https://example.com/image.jpg",
    userId: "2",
  },
  {
    title: "Physics Textbook",
    description:
      '"Fundamentals of Physics" by Halliday & Resnick, 10th edition. It has yellow highlighting in chapters 5 through 8. Found on a desk in the back row.',
    status: "lost",
    category: "Books",
    location: "Lecture Hall 3",
    date: "06-09-2025",
    contactInfo: "user2@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Set of Keys",
    description:
      "A set of three keys on a silver ring. One is a car key (Toyota), one is a standard house key, and the third is a small mailbox key. The keychain is a miniature metal Eiffel Tower.",
    status: "found",
    category: "Personal",
    location: "Cafeteria",
    date: "08-09-2025",
    contactInfo: "finder@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Wireless Mouse",
    description:
      "Logitech MX Master 3. Black color. The scroll wheel is a bit loose. Last seen on one of the circular tables in the main student hub area.",
    status: "lost",
    category: "Electronics",
    location: "Student Hub",
    date: "05-09-2025",
    contactInfo: "user3@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Student ID Card",
    description:
      "ID for student Jane Doe, ID #123456. Found on the floor near the registrar's office window.",
    status: "found",
    category: "IDs",
    location: "Admin Office",
    date: "09-09-2025",
    contactInfo: "admin@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Black Umbrella",
    description:
      "A standard-sized black umbrella with a wooden handle. It has no specific brand markings or logos. It was left leaning against the wall just inside the main campus entrance.",
    status: "found",
    category: "Accessories",
    location: "Main Entrance",
    date: "07-09-2025",
    contactInfo: "security@example.com",
    imageURL: null,
    userId: "2",
  },
  {
    title: "Airpods Pro Case",
    description:
      "This is just the empty charging case for a pair of Airpods Pro. It's white and has several minor scratches on the front. It was found in the grass near the large oak tree on the campus green.",
    status: "lost",
    category: "Electronics",
    location: "Campus Green",
    date: "08-09-2025",
    contactInfo: "user4@example.com",
    imageURL: null,
    userId: "2",
  },
];
const mockUsers = [
  {
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    password: "adminpassword123",
  },
  {
    username: "john_doe",
    email: "john.d@example.com",
    role: "user",
    password: "#stupidpassword",
  },
];

async function populateItems() {
  try {
    console.log("Populating items with mock data ...");
    await Item.bulkCreate(mockItems);
    console.log("📙 Items database is ready ...");
  } catch (err) {
    console.log("Error while creating items db: ", err);
  }
}

async function populateUsers() {
  try {
    console.log("Populating Users with mock data ...");
    await User.bulkCreate(mockUsers);
    console.log("👤 Users database is ready ...");
  } catch (err) {
    console.log("Error while creating user db: ", err);
  }
}

// Export all models from this file
export { User, Item, populateItems, populateUsers };
