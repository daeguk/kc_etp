const util = require("util");
const Promise = require("bluebird");
/*
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

*/

var getBlueList = function(req, res) {

    pool = req.app.get("pool");

    console.log('indexmanage 모듈 안에 있는 getBlueList 호출됨.');
  
    var etpStmts = req.app.get("stmt");
    
    var options = {id:'admin'};
    var options = {};
    var stmt = etpStmts.IndexManage.selectIndexInfoOpenReqList(options);

    console.log(stmt);
    

    Promise.using(pool.connect(), conn => {
        conn.queryAsync(stmt).then(ret => {
                util.log("sql1" == ret.affectedRows)
                res.json({ success: true, results: ret });
                res.end();
            }).catch(err => {
                util.log("err", err);
                console.log('Error while performing Query.', err);
                res.json({ success: false, message: {code:999} });
                res.end();
            });
    
       
    });

};

module.exports.getBlueList = getBlueList;

