const express = require("express");
const routes = express.Router();
const multer = require("multer");
const compressing = require("compressing");
const { execFile } = require("child_process");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "upload/",
  filename: function (req, file, cb) {
    cb("", file.originalname);
  },
});
const upload = multer({
  storage: storage,
});
module.exports = function () {
  routes.get("/", (req, res) => {return res.status(200).send("THE SERVER WORKS!!");});
  routes.post("/runOryza", upload.single("fileZip"), (req, res) => {
    compressing.zip
      .uncompress("./upload/" + req.file.filename, "./oryza_API")
      .then(() => {
        execFile("executeModel.bat", (err, stdout, stderr) => {
          if (err) {
            console.log(`error1 : ${err.message}`);

            return res.status(400).send("FAILED READ ORYZA");
          }
          const files = fs.readdirSync("/oryza_API/outputs/");
          if (files) {
            files.forEach((file) => {
              if (file.slice(-4) === ".csv") {
                return res.status(200).download(`/oryza_API/outputs/${file}`);
              }
            });
          }else{
            return res.status(400).send("THERE'S NO OUTPUT'S FOLDER");
          }
        });
      })
      .catch((err) => {
        console.log(`error2 : ${err}`);
        res.status(400).send("FAILED UNZIP");
      });
  });

  return routes;
};
