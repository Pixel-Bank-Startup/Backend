require("dotenv").config();
require("./schedular/subscription");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/databaseConnection/db");

connectDB();
const PORT = process.env.PORT || 8181;
const app = express();

const allowedOrigins = [process.env.Frontend_URL];

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
const profileRoute = require("./routes/profileRoutes/userProfile");
const problemRoute = require("./routes/problemRoute/problemRoute");
const handleProblemtRoute = require("./routes/adminRoute/probemRoute/handleProblem");
const collectionRoute = require("./routes/adminRoute/collectionRoute/collectionRoute");
const topicRoute = require("./routes/adminRoute/topicRoute/topicRoute");
const premiumPlanRoute = require("./routes/adminRoute/premiumPlanRoute/planRoute");

app.use("/api/auth", authRoutes, googleAuthRoute);
app.use("/api/general", problemRoute);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user", "admin"]),
  profileRoute
);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  handleProblemtRoute,
  collectionRoute,
  topicRoute,
  premiumPlanRoute
);

app.get("/", (req, res) => res.send("API Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
