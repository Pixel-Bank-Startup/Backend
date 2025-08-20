require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/databaseConnection/db");

connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  process.env.Frontend_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const checkForAuthenticationCookie = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/roleMiddleware");

const authRoutes = require("./routes/authRoutes/userAuth");
const googleAuthRoute = require("./routes/authRoutes/loginWithGoogle");
const profileRoute = require('./routes/profileRoutes/userProfile');


app.use("/api/auth", authRoutes,googleAuthRoute);
app.use("/api/user",checkForAuthenticationCookie('token'),authorizeRoles(['user','admin']),profileRoute);

app.get("/", (req, res) => res.send("API Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
