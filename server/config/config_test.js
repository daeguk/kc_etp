/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

const log4js = require('log4js');
log4js.configure({
    appenders:  { output:   { type: 'dateFile', pattern:"yyyy-MM-dd.log", alwaysIncludePattern: true, filename: 'D:/koscom_etp/log/etp' } },
    categories: { default :  { appenders: ['output'], level: 'error' } }
});

const logger = log4js.getLogger('output');

const MSG  =   {
    error01 :   "처리 중 오류가 발생하였습니다."
};

module.exports = {
    // runenv: "dev",
    runenv: "prod",
    server_port: 8034,
    // base_url: "http://127.0.0.1:8034",
    base_url: "http://emptest.koscom.co.kr",
    // base_url: "https://emp.koscom.co.kr",
    pwd_salt: "11aabb..",
    pwd_default: "11aabb..",
    uploadFolder : "/data/koscom/kc_newetp/upload",
    sampleDownFolder : "/data/koscom/kc_newetp/upload/samepleDown",
    pdfmodify_path : "/data/koscom/kc_newetp/upload/pdfmodify/",
    pdfmodify_nas_path: "/nas3/nfs_data2/checkapi/pdfmodify/",
    logger : logger,
    log_level : 'DEBUG',
    // log_level : 'INFO',
    // log_level : 'ERROR',
    python_path: '/home/sinfo/anaconda3/bin/python',
    MSG : MSG
}