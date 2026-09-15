const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const { UserModel } = require('./model/UserModel');
const { BookModel } = require('./model/BookModel');
const users = require('./routes/user.js');
const books = require('./routes/books.js');
const admin = require('./routes/admin.js');
const librarian = require('./routes/librarian.js');
const home = require('./routes/home.js');

const allowedOrigins = [
  'http://localhost:5173',
  'https://library-management-app-karan.vercel.app',
];

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use('/users', users);
app.use('/books', books);
app.use('/admin', admin);
app.use('/librarian', librarian);
app.use('/home', home);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const DEFAULT_PORT = Number(process.env.PORT) || 5001;

async function seedDemoData() {
  const userCount = await UserModel.countDocuments();

  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      stream: 'General',
      year: 2025,
    });

    const librarianUser = await UserModel.create({
      name: 'Librarian User',
      email: 'librarian@example.com',
      password: await bcrypt.hash('lib123', 10),
      role: 'librarian',
      stream: 'General',
      year: 2025,
    });

    const studentUser = await UserModel.create({
      name: 'Student User',
      email: 'student@example.com',
      password: await bcrypt.hash('student123', 10),
      role: 'user',
      stream: 'Computer Science',
      year: 2,
    });

    await BookModel.create([
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Programming',
        isbn: '9780132350884',
        description: 'A handbook of agile software craftsmanship that helps developers write clean, maintainable code.',
        availableCopies: 5,
        totalCopies: 5,
        addedBy: adminUser._id,
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        cloudinaryId: 'demo-clean-code',
        price: 299,
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        category: 'Programming',
        isbn: '9780201616224',
        description: 'A classic guide to practical software engineering and smart development habits.',
        availableCopies: 4,
        totalCopies: 4,
        addedBy: librarianUser._id,
        coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        cloudinaryId: 'demo-pragmatic-programmer',
        price: 349,
      },
      {
        title: 'Data Structures and Algorithms',
        author: 'Mark Allen Weiss',
        category: 'Computer Science',
        isbn: '9780201308796',
        description: 'A comprehensive look at fundamental algorithms and data structures used in computer science.',
        availableCopies: 3,
        totalCopies: 3,
        addedBy: adminUser._id,
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        cloudinaryId: 'demo-dsa',
        price: 399,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Self Development',
        isbn: '9780735211292',
        description: 'A practical guide to building small habits that create remarkable results over time.',
        availableCopies: 6,
        totalCopies: 6,
        addedBy: librarianUser._id,
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
        cloudinaryId: 'demo-atomic-habits',
        price: 259,
      },
    ]);

    console.log('Seeded demo admin and books');
  }
}

function startServer(port = DEFAULT_PORT) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', async (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

async function initializeServer() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('Using in-memory MongoDB for local development');
  }

  await mongoose.connect(uri);
  console.log('DB Connected');

  await seedDemoData();
  startServer();
}

initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});