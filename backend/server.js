require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const mongoDb = require('./connection');
const signin_upRoute = require('./routes/signin_up');
const adminRoutes = require("./routes/admin.route");
const candidateRoutes = require("./routes/candidate.route");
const examinerRoutes = require("./routes/examiner.route");
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
const port = process.env.PORT || 8081;
const mongo_url = process.env.MONGO_URI || 'mongodb://localhost:27017/skill_grid';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(helmet());

app.use('/auth', signin_upRoute);
app.use('/admin', adminRoutes);
app.use('/candidate', candidateRoutes);
app.use('/examiner', examinerRoutes);
app.use('/api', certificateRoutes);

app.get('/', (req, res) => {
    res.send("Skill-Grid API Server is running...");
});

mongoDb(mongo_url)
    .then(() => console.log(`Database is connected to ${mongo_url}`))
    .catch((err) => console.log("Database connection error:", err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});