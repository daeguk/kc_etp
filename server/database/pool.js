/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */
const mysql = require('mysql');
const config = require('./mysql_config');
const Promise = require("bluebird");
const logg = require("../util/logg");
const ibatisMapper = require("mybatis-mapper");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const DB_INFO = {
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  multipleStatements: true,
  connectionLimit:25,
  waitForConnections:false,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: 'date'
};

module.exports = class {
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO;
    this.pool = mysql.createPool(dbinfo);
  }

  connect() {
    return this.pool.getConnectionAsync().disposer(conn => {
        return conn.release();
    });
  }

  end() {
    this.pool.end(function(err) {
      logg.info(">>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>> End of Pool!!");
      if (err) logg.error("ERR pool ending!!");
    }); 
  }

  getMapper() {
    // 사용자 로그인 처리(threeon. 2019.04.19)
    ibatisMapper.createMapper(['./database/mysql/user/member/userInfo.xml']);

    ibatisMapper.createMapper(['./database/mysql/user/index/indexSummary.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/index/indexDetail.xml']);

    ibatisMapper.createMapper(['./database/mysql/user/index/indexRegister.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/index/indexSelectList.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/index/indexModify.xml']);

    ibatisMapper.createMapper(['./database/mysql/user/etpinfo/etpinfo.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/etpinfo/etpregister.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/etpinfo/etpDetail.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/etpinfo/etpOper.xml']);

    ibatisMapper.createMapper(['./database/mysql/user/etpinfo/etpNavCalcu.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/marketInfo/marketInfo.xml']);

    // 공통으로 사용되는 종목 정보
    ibatisMapper.createMapper(['./database/mysql/user/common/itemInfo.xml']);

    ibatisMapper.createMapper(['./database/mysql/user/etc/custSupport.xml']);

    // 시뮬레이션 정보
    ibatisMapper.createMapper(['./database/mysql/user/simulation/simulation.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/simulation/simulationGroup.xml']);
    ibatisMapper.createMapper(['./database/mysql/user/simulation/simulationBacktest.xml']);

    // 운용지원
    ibatisMapper.createMapper(['./database/mysql/user/operSupport/operSupport.xml']);        

    // API
    ibatisMapper.createMapper(['./database/mysql/api/fnguideApi.xml']);        
    ibatisMapper.createMapper(['./database/mysql/api/fnguideApiLog.xml']);        
    ibatisMapper.createMapper(['./database/mysql/api/fnguideApiMember.xml']);        

    return ibatisMapper;
  }
};





/*
//auto commit
Promise.using(pool.connect(), conn => {
    conn.queryAsync(sql1, (err, ret) => {
        util.log("sql1=", ret.affectedRows);

        conn.queryAsync(sql2, (err, ret2) => {
            util.log("sql2=", ret2.affectedRows);
        })
    });
});

//auto commit
Promise.using(pool.connect(), conn => {
    Promise.all([
        conn.queryAsync(sql1),
        conn.queryAsync(sql2)
    ]).then( r => {
        util.log("End of Then!!!!!!!!!");
        util.log("sql1=", r[0].affectedRows);
        util.log("sql1=", r[1].affectedRows);
    })
});

// transaction
Promise.using(pool.connect(), conn => {
    conn.beginTransaction(txerr => {
        Promise.all([
            conn.queryAsync(sql1),
            conn.queryAsync(sql2),
            conn.queryAsync(sql3)
        ]).then( r => {
            util.log("End of Then!!!!!!!!!");
            util.log("sql1=", r[0].affectedRows);
            util.log("sql1=", r[1].affectedRows);
            util.log("sql1=", r[2].affectedRows);

            conn.commit();
            pool.end();
        }).catch(e => {
            conn.rollback();
            pool.end();
        });
    })
})


connection.beginTransaction(function(err) {
    if (err) { throw err; }
    connection.query('INSERT INTO names SET name=?', "sameer", function(err, result) {
      if (err) { 
        connection.rollback(function() {
          throw err;
        });
      }
   
      var log = result.insertId;
   
      connection.query('INSERT INTO log SET logid=?', log, function(err, result) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }  
        connection.commit(function(err) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
          console.log('Transaction Complete.');
          connection.end();
        });
      });
    });
  });

*/
