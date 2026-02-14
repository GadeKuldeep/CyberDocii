const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
    'https://cyberdocii.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is allowed or if it's a Netlify subdomain
        const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
            (origin.endsWith('.netlify.app'));

        if (!isAllowed) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Serve static uploads - allow CORS for images to prevent blocking and allow PDF generation
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/journey', require('./routes/journeyRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
