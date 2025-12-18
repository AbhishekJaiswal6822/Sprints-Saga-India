

// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\server.js - DEFINITIVE CORRECT CODE

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path'); // Essential for robust file serving

dotenv.config(); 

// --- 1. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI; 

const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://ssi-testing-frontend-phase-1.onrender.com' // Add your Render URL here
];

// --- CRITICAL MIDDLEWARE ORDER ---

// 1. Universal CORS 
// app.use(cors()); 

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 2. JSON Body Parser (for parsing incoming JSON data)
app.use(express.json());

// 3. URL Encoded Body Parser 
app.use(express.urlencoded({ extended: true }));

// 4. File serving for Multer uploads (CRITICAL for images/ID files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Database Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message)); 

// --- 2. MOUNT ALL ROUTES (FIXED) ---

// a. Authentication (MISSING in your provided code, now correctly added)
app.use("/api/auth", require("./routes/authRoutes"));


// b. Registration (Prefix: /api/register)
app.use('/api/register', registrationRoutes); 

// c. Payment (Prefix: /api/payment - Removed the duplicate entry)
app.use('/api/payment', paymentRoutes); 


// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Marathon Project Backend Running!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});