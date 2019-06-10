/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */


const log4js = require('log4js');
log4js.configure({
    appenders:  { output:   { type: 'dateFile', pattern:"yyyy-MM-dd.log", alwaysIncludePattern: true, filename: 'D:/koscom_etp/log/etp' } },
    categories: { default :  { appenders: ['output'], level: 'debug' } }
});

const logger = log4js.getLogger('output');

module.exports = {
    runenv: "dev",
    //runenv: "prod",
    server_port: 8034,
    base_url: "http://127.0.0.1:8034",
    // base_url: "http://etptest.koscom.co.kr",
    // base_url: "https://etp.koscom.co.kr",
    pwd_salt: "11aabb..",
    pwd_default: "11aabb..",

    logger : logger
}