var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var GridFs = require('grid-fs');
var fs = require("fs");

var url = 'mongodb://127.0.0.1:27017/gridfs_example';

router.post("/delete/", function (req, res) {
    var fileName = req.param("fileName");
    MongoClient.connect(url, function (err, db) {
        var gridFs = new GridFs(db);
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
});

/* GET home page. */
router.get('/', function (req, res) {
//  res.render('index', { title: 'Express' });
    MongoClient.connect(url, function (err, db) {
        var gridFs = new GridFs(db);
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
});


MongoClient.connect(url, function (err, db) {
    var connectGridfs = require('connect-gridfs');
    router.get("/upload/", connectGridfs({db: db}));
});

router.get("/upload/:filename", function (req, res) {
    var filename = req.param("filename");
    MongoClient.connect(url, function (err, db) {
        var gridFs = new GridFs(db);
        gridFs.createReadStream(filename).pipe(res);
    });

});

module.exports = router;
