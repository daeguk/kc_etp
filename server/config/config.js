/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

const log4js = require('log4js');
log4js.configure({
    appenders:  { output:   { type: 'file', filename: 'D:/koscom_etp/log/etp.log' } },
    categories: { default :  { appenders: ['output'], level: 'debug' } }
});

const logger = log4js.getLogger('output');

module.exports = {
    runenv: "dev",
    //runenv: "prod",
    server_port: 8034,
    base_url: "http://127.0.0.1:8034",
    // base_url: "http://emptest.koscom.co.kr",
    // base_url: "https://emp.koscom.co.kr",
    pwd_salt: "11aabb..",
    pwd_default: "11aabb..",
    uploadFolder : "D:/koscom_etp/upload",
    sampleDownFolder : "D:/koscom_etp/kc_etp/etc/sampleDown",
    pdfmodify_nas_path: "D:/koscom_etp/kc_etp/pdfmodify/",
    logger : logger,
}