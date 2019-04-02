var util = require("util");
var multer = require('multer');



var fileuploadSingle = function (req, res) {

    //util.log("body ===", req);

    //var deferred = Q.defer();
    var storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, "d:\\test");
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {

            console.log("file" + JSON.stringify(file));

            file.uploadedFile = {
                name: file.originalname
            };

            console.log("filename=" + file.uploadedFile.name);
            cb(null, file.uploadedFile.name);
        }
    });



    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function (err) {
        if (err) {
            console.log("File Upload Err" + err);
        }
        /*if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
        */

        //console.log(req.file.uploadedFile);

        res.end();
    });

    //return deferred.promise;
};



var fileuploadMulti = function (req, res) {

    //util.log("body ===", req);

    //var deferred = Q.defer();
    var storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, "d:\\test");
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {

            console.log("file" + JSON.stringify(file));

            file.uploadedFile = {
                name: file.originalname
            };

            console.log("filename=" + file.uploadedFile.name);
            cb(null, file.uploadedFile.name);
        }
    });



    var upload = multer({ storage: storage }).array('files', 3);

    upload(req, res, function (err) {
        if (err) {
            console.log("File Upload Err" + err);
        }
        /*if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
        */

        //console.log(req.file.uploadedFile);

        res.end();
    });

    //return deferred.promise;

};

module.exports.fileuploadSingle = fileuploadSingle;
module.exports.fileuploadMulti = fileuploadMulti;

