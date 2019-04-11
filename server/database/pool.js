/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */
const mysql = require('mysql');
const config = require('./mysql_config');
const Promise = require("bluebird");
const util = require("util");
const ibatisMapper = require("mybatis-mapper");

var etpStmts = [];

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
    waitForConnections:false
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
            util.log(">>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>> End of Pool!!");
            if (err)
                util.log("ERR pool ending!!");
        }); 
    }

    getStmts() {
        console.log('getStmts() 호출됨.');
        
        var modelLen = config.db_model.length;
        console.log('설정에 정의된 모델의 수 : %d', modelLen);
        
        for (var i = 0; i < modelLen; i++) {
            var curItem = config.db_model[i];
            
            // database 객체에 속성으로 추가
            etpStmts[curItem.modelName] = require(curItem.file);
            console.log('[MYSQL] 모델 이름 [%s] 이 mydb 객체의 속성으로 추가됨.', curItem.modelName);
        }
        
        console.log('[MYSQL]mydb 객체가 app 객체의 속성으로 추가됨.');

        return etpStmts;
    };

    getMapper() {
        ibatisMapper.createMapper(['./database/mysql/user/index/indexSummary.xml']);
        ibatisMapper.createMapper(['./database/mysql/user/index/indexRegister.xml']);
        ibatisMapper.createMapper(['./database/mysql/user/index/indexSelectList.xml']);
        ibatisMapper.createMapper(['./database/mysql/user/index/indexModify.xml']);
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
