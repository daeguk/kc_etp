var config = require('../../config/config');
var util = require("util");
var multer = require('multer');

/* logging 추가함.  2019-06-10 */
var log = config.logger;



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

            log.debug("file" + JSON.stringify(file));

            file.uploadedFile = {
                name: file.originalname
            };

            log.debug("filename=" + file.uploadedFile.name);
            cb(null, file.uploadedFile.name);
        }
    });



    var upload = multer({ storage: storage }).single('files');

    upload(req, res, function (err) {
        if (err) {
            log.debug("File Upload Err" + err);
        }
        /*if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
        */

        //log.debug(req.file.uploadedFile);

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

            log.debug("file" + JSON.stringify(file));

            file.uploadedFile = {
                name: file.originalname
            };

            log.debug("filename=" + file.uploadedFile.name);
            cb(null, file.uploadedFile.name);
        }
    });



    var upload = multer({ storage: storage }).array('files', 3);

    upload(req, res, function (err) {
        if (err) {
            log.debug("File Upload Err" + err);
        }
        /*if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
        */

        //log.debug(req.file.uploadedFile);

        res.end();
    });

    //return deferred.promise;

};

module.exports.fileuploadSingle = fileuploadSingle;
module.exports.fileuploadMulti = fileuploadMulti;

