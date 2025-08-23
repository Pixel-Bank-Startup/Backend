require("dotenv").config();
require("./schedular/subscription");
require("./schedular/rankingLeaderBoard");
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
const handleCollectionRoute = require("./routes/adminRoute/collectionRoute/collectionRoute");
const handleTopicRoute = require("./routes/adminRoute/topicRoute/topicRoute");
const premiumPlanRoute = require("./routes/adminRoute/premiumPlanRoute/planRoute");
const userCollectionRoute = require('./routes/collectionRoute/collectionRoute');
const topicRoute = require('./routes/topicRoute/topicRoute');
const problemSubmissionRoute = require('./routes/submissionRoute/submitCode');
const userStats = require('./routes/statistics/userStats');
const leaderboardRoute = require("./routes/statistics/rankingLeaderBoard");
const handleDailyQuestionRoute = require('./routes/adminRoute/dailyQuestion/question');
const dailyQuestionRoute = require('./routes/dailyQuestionRoute/dailyQuestion');
const handleBadgeRoute = require('./routes/adminRoute/badgeRoute/badgeRoute')

app.use("/api/auth", authRoutes, googleAuthRoute);
app.use("/api/general", problemRoute, userCollectionRoute,topicRoute,leaderboardRoute,dailyQuestionRoute);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["user", "admin"]),
  profileRoute,
  problemSubmissionRoute,
  userStats
);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  handleProblemtRoute,
  handleCollectionRoute,
  handleTopicRoute,
  premiumPlanRoute,
  handleDailyQuestionRoute,
  handleBadgeRoute
);

app.get("/", (req, res) => res.send("API Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
