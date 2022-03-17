const express = require("express");
const app = express();
const routes = require("./routes/routes");

app.set("port", process.env.PORT || 9000);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use("/api", routes());
app.listen(app.get("port"), () => {
  console.log("Server is listening on port ", app.get("port"));
});
