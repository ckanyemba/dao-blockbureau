const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/users");
const ethers = require("ethers");

const app = express();
require("dotenv").config();

// Increase the JSON payload size limit
app.use(express.json({ limit: "10mb" }));
// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify the methods you want to allow
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // Specify the headers you want to allow
    credentials: true // Allow cookies to be sent with requests
  })
);

// Set up provider
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load ABIs
const govTokenABI = require("./abi/out/GovToken.sol/GovToken.json").abi;
const timeLockABI = require("./abi/out/TimeLock.sol/TimeLock.json").abi;
const myGovernorABI = require("./abi/out/MyGovernor.sol/MyGovernor.json").abi;

// Initialize contract instances
const govToken = new ethers.Contract(
  process.env.GOV_TOKEN_ADDRESS,
  govTokenABI,
  wallet
);

const timeLock = new ethers.Contract(
  process.env.TIME_LOCK_ADDRESS,
  timeLockABI,
  wallet
);

const myGovernor = new ethers.Contract(
  process.env.MY_GOVERNOR_ADDRESS,
  myGovernorABI,
  wallet
);
app.options("*", cors());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/proposals", require("./routes/proposals"));
app.use("/api/votes", require("./routes/votes"));
app.use("/api/activityLogs", require("./routes/activityLogs"));
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.send("DAO Backend is running!...");
});

app.post("/propose", async (req, res) => {
  try {
    const { description, proposal } = req.body;
    const tx = await myGovernor.propose(...proposal, description);
    await tx.wait();
    res.json({ success: true, tx });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
