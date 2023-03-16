require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const carouselRoutes = require("./routes/carousel.routes");
const productRoutes = require("./routes/product.routes");
const path = require("path");
const { checkUser, getToken } = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

//vérif token
app.get("/jwtid", checkUser, getToken, (req, res) => {
  res.status(200).send({ userId: res.locals.user._id });
});

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carousel", carouselRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/mnt/myuploads", express.static("/mnt/myuploads"));

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
