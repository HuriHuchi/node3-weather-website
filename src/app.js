const path = require("path");
const express = require("express");
const hbs = require("hbs");

const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Heeuk",
  }); //view 폴더의 파일명과 일치하면 됨
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Heeuk",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "This is help page. Please contact us!",
    title: "Help",
    name: "Heeuk",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  // address가 들어오지 않으면,
  if (!address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      return res.send({
        forecast: forecastData,
        location,
        address,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Heeuk",
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    // 2번의 respond를 send하면 에러가 뜬다
    products: [],
  });
});

// 제일 마지막에 나와야 한다.
app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMessage: "Page not found",
    name: "Heeuk",
  });
});

// server
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
