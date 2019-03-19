/*
 * 유저 리포트을 위한 라우팅 함수 정의
 *
 * @date 2018-09-03
 * @author threeon
 */

function compStringReverse(a, b) {
    if (a > b) return -1;
    if (b > a) return 1;
    return 0;
}

var dateFilter = function(topList, sdate, edate) {
    var resList = [];
    topList.forEach(function(el, idx, array) {
        if (el >= sdate && el <= edate) {
            resList.push(el);
            // console.log("el : " + el + " sdate : " + sdate + " edate : " + edate);
        }
    });

    resList.sort(compStringReverse);

    return resList;
}

var monthFilter = function(topList, sdate, edate) {
    var resList = [];
    sdate = sdate.slice(0, -3);
    edate = edate.slice(0, -3);
    topList.forEach(function(el, idx, array) {
        console.log("1....el : " + el + " sdate : " + sdate + " edate : " + edate);
        if (el >= sdate && el <= edate) {
            resList.push(el);
            console.log("2....el : " + el + " sdate : " + sdate + " edate : " + edate);
        }
    });

    resList.sort(compStringReverse);

    return resList;
}

var compFilter = function(inList, comp_no) {

    var outList = [];
    //  회원사명 필터
    if (comp_no !== "") {
        inList.forEach(function(el, idx1, arr1) {
            var tArr = el.split("_");
            // console.log("2...." + tArr[2] + "3.... " + comp_no);
            // 파일에 회원사명을 넣어서 보내는 경우가 있슴. 회원사번호 위치가 바뀜
            if(parseInt(tArr[2]) == comp_no || parseInt(tArr[3]) == comp_no) {
                // console.log("2...." + tArr[2]);
                outList.push(el);
            }
        });
    } else { //회원사 전체면
        outList = inList;
    }
    return outList;
}

var errSend = function(res, msg) {
    var resBody = {};

    resBody = {
        "success": false,
        "message": msg
    };
    console.log("msg : " + msg);
    res.json(resBody);
    res.end();
}

var succSend = function(res, resBody) {
    resBody.success = true;
    res.json(resBody);
    res.end();
}

var getUserChartListTerm = function(req, res) {
    console.log('/user/chart/getChartListTerm 호출됨.');

    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var comp_no = req.body.comp_no;

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }

    var fs = require('fs');
    var topdir = "./public/ReportDaily/";
    var rddir = "";
    var resBody = {};
    var dataList = [];
    var curDate = "";

    fs.readdir(topdir, function(err, data) {
        console.log(data);

        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            topList = dateFilter(topList, sdate, edate);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);
                // console.log("fileList : [" + fileList + "]");
                fileList = compFilter(fileList, comp_no);

                fileList.forEach(function(el1, idx1, arr1) {
                    var clist = { 'fullsrc': "", 'fname': "" };
                    clist.fullsrc = "/public/ReportDaily/" + curDate + "/" + el1;
                    clist.fname = el1;
                    dataList.push(clist);
                });
            });

            if (dataList.length > 0) {
                resBody = { "clist": dataList };
                succSend(res, resBody);
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });
}

var downloadFileTerm = function(req, res) {
    console.log('/user/chart 모듈 안에 있는 downloadFileTerm 호출됨.');

    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var comp_no = req.body.comp_no;
    var resBody = {};

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }

    var fs = require('fs');
    var JSZip = require('jszip');
    var topdir = "";

    var zip = new JSZip();
    var outFileName = "";
    var fileList = [];

    topdir = "./public/ReportDaily/";
    outFileName = "report_" + comp_no + "_" + sdate + "_" + edate + "_" + ".zip";

    fs.readdir(topdir, function(err, data) {
        console.log('/user/chart 모듈 안에 있는 downloadFileTerm 호출됨.');
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            var fileCnt = 0;
            topList = dateFilter(topList, sdate, edate);
            // console.log('\ntopList ::: ' + topList);
            fileList = compFilter(fileList, comp_no);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                var rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);

                fileList.forEach(function(el1, idx1, arr1) {
                    // console.log(rddir + el1);
                    var stream = fs.createReadStream(rddir + el1);
                    zip.folder(curDate).file(el1, stream);
                    fileCnt += 1;
                });
            });
            if (fileCnt > 0) {
                zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                    .pipe(fs.createWriteStream('./public/download/' + outFileName))
                    .on('finish', function() {
                        resBody = { "filename": outFileName };
                        succSend(res, resBody);
                    });
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });
};

var getUserChartListMonth = function(req, res) {
    console.log('/user/chart/getUserChartListMonth 호출됨.');

    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var comp_no = req.body.comp_no;

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }

    var fs = require('fs');
    var topdir = "./public/ReportMonthly/";
    var rddir = "";
    var resBody = {};
    var dataList = [];
    var curDate = "";

    fs.readdir(topdir, function(err, data) {
        console.log(data);

        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            topList = monthFilter(topList, sdate, edate);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);
                // console.log("fileList : [" + fileList + "]");
                fileList = compFilter(fileList, comp_no);

                fileList.forEach(function(el1, idx1, arr1) {
                    var clist = { 'fullsrc': "", 'fname': "" };
                    clist.fullsrc = "/public/ReportDaily/" + curDate + "/" + el1;
                    clist.fname = el1;
                    dataList.push(clist);
                });
            });

            if (dataList.length > 0) {
                resBody = { "clist": dataList };
                succSend(res, resBody);
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });
}

var downloadFileMonth = function(req, res) {
    console.log('/user/chart 모듈 안에 있는 downloadFileMonth 호출됨.');

    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var comp_no = req.body.comp_no;
    var resBody = {};

    if (sdate == "" || edate == "") {
        errSend(res, "입력날짜가 올바르지 않습니다!");
        return;
    } else if (sdate > edate) {
        errSend(res, "시작날짜는 끝날짜보다 같거나 작아야 합니다!");
        return;
    }

    var fs = require('fs');
    var JSZip = require('jszip');
    var topdir = "";

    var zip = new JSZip();
    var outFileName = "";
    var fileList = [];

    topdir = "./public/ReportMonthly/";
    outFileName = "report_" + comp_no + "_" + sdate + "_" + edate + "_" + ".zip";

    fs.readdir(topdir, function(err, data) {
        console.log('/user/chart 모듈 안에 있는 downloadFileTerm 호출됨.');
        if (err) {
            errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
        } else {
            var topList = data;
            var fileCnt = 0;
            topList = monthFilter(topList, sdate, edate);
            // console.log('\ntopList ::: ' + topList);
            fileList = compFilter(fileList, comp_no);
            topList.forEach(function(el, idx, array) {
                curDate = el;
                var rddir = topdir + el + "/";
                var fileList = fs.readdirSync(rddir);

                fileList.forEach(function(el1, idx1, arr1) {
                    // console.log(rddir + el1);
                    var stream = fs.createReadStream(rddir + el1);
                    zip.folder(curDate).file(el1, stream);
                    fileCnt += 1;
                });
            });
            if (fileCnt > 0) {
                zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                    .pipe(fs.createWriteStream('./public/download/' + outFileName))
                    .on('finish', function() {
                        resBody = { "filename": outFileName };
                        succSend(res, resBody);
                    });
            } else {
                errSend(res, "해당일자에 데이터가 존재하지 않습니다!");
            }
        }
    });
};

module.exports.getUserChartListTerm = getUserChartListTerm;
module.exports.downloadFileTerm = downloadFileTerm;
module.exports.getUserChartListMonth = getUserChartListMonth;
module.exports.downloadFileMonth = downloadFileMonth;