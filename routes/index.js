var express = require('express');
var multer = require('multer');
//var unzip = require('unzip'); //有坑
var adm_zip = require('adm-zip');
var fs = require('fs'); //读取文件
var file_path = require('path'); //读取文件路径
var router = express.Router();

var fileList = [];
var pageList = [];

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

var upload = multer({ storage: storage }).single('resource');

//  解压到views/works
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/works', function(req, res) {
    var path = req.query.path
    res.render('works/' + path + '/index');
});
router.get('/show', function(req, res) {
    var path = req.query.path?req.query.path:""
    var onlineUrl = req.query.onlineUrl?req.query.onlineUrl:""
    res.render('show', { url: path ,onlineUrl:onlineUrl})
});
//上传作品页面
router.get('/add', function(req, res) {
    res.render('add');
});
router.post('/upload', upload,function (req, res) {
    var unzip = new adm_zip(req.file.path);
    var fileFormat =(req.file.filename).split(".");
    unzip.extractAllTo('public/works/' + fileFormat[0], /*overwrite*/false);
    uploadcheck('public/works/' + fileFormat[0],req.body);
    res.send('success');
})
router.post('/download', function (req, res, next) {
    res.download(req.file.path);
})

router.get('/worksInfo', function(req, res, next) {
    pageList = [];
    fileList = [];
    walk('public/works')
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

function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(item == '__MACOSX'){
            return
        }
        if(fs.statSync(path + '/' + item).isDirectory()){
            walk(path + '/' + item);
        } else {
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

function uploadcheck (path,object) {
    var dirList = fs.readdirSync(path);
    // var object = {
    //     "author": "lpk",
    //     "name": "favorNow",
    //     "description": "场景动画新高度",
    //     "logo": "https://s4.wandougongzhu.cn/s/cb/logo_fbd468.jpg",
    //     "url": "https://s4.wandougongzhu.cn/s/cb/logo_fbd468.jpg"
    // }
    dirList.forEach(function(item){
        if(item == '__MACOSX'){
            return
        }
        if (fs.statSync(path + '/' + item).isDirectory()) {
            uploadcheck(path + '/' + item,object);
        } else {
            fs.open(path + '/package.json', 'w+', function (e) {
                if (e) {
                    console.log("出错啦");
                } else {
                    fs.writeFile( path + '/package.json', JSON.stringify(object), function (err) {
                        if(err)
                            return console.error(err);
                    });
                    console.log("创建成功");
                }
            })
            return
        }
    });

}

//来自司徒大神的mkdirp的封装
function mkdirSync(url,mode,cb){
    var arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!file_path.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode);
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}

module.exports = router;
