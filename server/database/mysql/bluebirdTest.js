const util = require("util");
const Pormise = require("bluebird");

const Pool = require("../pool");

const sql1 = "select * from user";
const sql2 = "select * from user";

const pool = new Pool();

// auto commit;
Promise.using(pool.connect(), conn => {
    conn.queryAsync(sql1)
        .then(console.log)
        .cathc(err => {
            util.log("err", err);
        });

    pool.end();
});

// auto commit;
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

