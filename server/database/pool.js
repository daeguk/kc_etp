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
    waitForConnections:false
}

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
}



/*
Promise.using(pool.connect(), conn => {
    conn.queryAsync(sql1, (err, ret) => {
        util.log("sql1=", ret.affectedRows);

        conn.queryAsync(sql2, (err, ret2) => {
            util.log("sql2=", ret2.affectedRows);
        })
    });
});

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
*/
