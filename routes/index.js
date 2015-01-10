var express = require('express');
var router = express.Router();
var GridFs = require('grid-fs');
var fs = require("fs");

router.post("/delete/", function (req, res) {
    var fileName = req.param("fileName");
    var gridFs = new GridFs(req.db);
    gridFs.unlink(fileName, function (err) {
        if (err) {
            res.render("delete", {
                title: "Err"
            });
            return;
        }
        res.render("delete", {
            title: "Uploader"
        });
    });
});

/* GET home page. */
router.get('/', function (req, res) {
    var gridFs = new GridFs(req.db);
    gridFs.list(function (err, list) {
        if (err) {
            console.log(err);
        } else {
            list.forEach(function (filename) {
                console.log(filename);
            });
            res.render('index', {title: 'Uploader', files: list});
        }
    });
});

router.get("/upload/:filename", function (req, res) {
    var filename = req.param("filename");
    var gridFs = new GridFs(req.db);
    gridFs.createReadStream(filename).pipe(res);
});

module.exports = router;
