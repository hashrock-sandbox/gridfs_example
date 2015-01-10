var GridFs = require('grid-fs');
var fs = require("fs");
var express = require('express');
var multer  = require('multer');
var router = express.Router();

router.get('/', function(req, res) {
    var gridFs = new GridFs(req.db);
    gridFs.list(function(err, list){
        if(err){
            console.log(err);
        }else{
            list.forEach(function(filename){
                console.log(filename);
            });
            res.json(list);
        }
    });
});

router.post('/',[ multer({ dest: './uploads/'}), function(req, res){
    var gridFs = new GridFs(req.db);
    var stream = gridFs.createWriteStream(req.files.filefield.originalname);
    var r = fs.createReadStream(req.files.filefield.path);
    r.pipe(stream);
    stream.on('close', function(){
        fs.unlink(req.files.filefield.path, function (err) {
            if (err) throw err;
            console.log('successfully deleted ' + req.files.filefield.path);
        });
        //res.json({file: req.files.filefield.originalname, status:"succeed"});
        res.render('upload', { title: 'Uploader' });
    });
}]);

module.exports = router;
