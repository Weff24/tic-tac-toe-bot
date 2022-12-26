let express = require("express");
let path = require("path");
let ejs = require("ejs");

let app = express();
app.use(express.static(path.join(__dirname)));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index", { failed: req.params.failed });
});

app.listen(process.env.PORT || 8080);