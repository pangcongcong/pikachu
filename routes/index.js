var express = require('express');
var multer = require('multer');
//var unzip = require('unzip'); //有坑
var adm_zip = require('adm-zip');
var fs = require('fs'); //读取文件
var file_path = require('path'); //读取文件路径
var router = express.Router();

var fileList = [];
var pageList = [];

//var upload = multer({dest:"public/upload"}).single('resource');
//  解压到views/works
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/works', function(req, res) {
//    var path = req.query.path;
    var path = req.query.path
    res.render('works/' + path + '/index');
});
router.get('/error', function(req, res) {
    res.render('error')
});
router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        var unzip = new adm_zip(req.file.path);
        var fileFormat =(req.file.filename).split(".");
        unzip.extractAllTo('public/works/' + fileFormat[0], /*overwrite*/false);
        if (err) {
            console.log(req.body);   //打印请求体
            console.log(req.file);
            return
        }
    })
    res.send('success');
})
router.post('/download', function (req, res, next) {
    res.download(req.file.path);
})
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walk(path + '/' + item);
        }else{
//            console.log("item:" + path + '/' + item)
            if (file_path.basename(path + '/' + item) == 'index.html'){
                pageList.push(file_path.dirname(path + '/' + item).replace('public', ''));
            }
            if (file_path.extname(path + '/' + item) == '.json'){
                fileList.push(path + '/' + item);
            }
            return
        }
    });
}

router.get('/worksInfo', function(req, res, next) {
    var data = {};
    var data_arr = [];
    var page_arr = [];
    fileList.forEach(function(item) {
        var content = fs.readFileSync(item,'utf-8');
        data_arr.push(content);
    });
    page_arr.push(pageList);

    data.data_arr = data_arr;
    data.page_arr = page_arr;
    res.send(data);
});

var upload = multer({ storage: storage }).single('resource');

walk('public/works');
module.exports = router;
