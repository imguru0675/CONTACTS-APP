const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();

app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});
const userService = require("./user_service");

app.get("/signup", async (req, res) => {
  const { email, password } = req.query;
  try {
    const user = await userService.addUser(email, password, (out) => {
      res.send({ auth: out });
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/signin", async (req, res) => {
  const { email, password } = req.query;
  try {
    const user = await userService.signInUser(email, password, (out, us) => {
      res.send({ auth: out, user: us });
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/addcontact", async (req, res) => {
  const { email, id, name, phone } = req.query;
  try {
    const user = await userService.addContact(id, email, name, phone, (out) => {
      res.send({ auth: out });
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/getcontact", async (req, res) => {
  const { id } = req.query;
  try {
    const user = await userService.getContact(id, (out, cons) => {
      res.send({ auth: out, contacts: cons });
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));
