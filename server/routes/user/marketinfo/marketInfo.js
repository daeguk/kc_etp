/*
 * 시장 정보
 *
 * @date 2019-04-19
 * @author ThreeOn
 */
var config = require('../../../config/config');
var Promise = require("bluebird");
var async = require('async');
/* logging 추가함.  2019-06-10 */
var log = require('../../../util/logg');

/*
 * INDEX MAST 조회
 */
var getIndexMast = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexMast 호출됨.');
  var options = {};
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexMast', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX BASIC 조회
 */
var getIndexBasic = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexBasic 호출됨.');
  var options = {
    F16013: req.query.F16013,
    market_id: req.query.market_id,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexBasic', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX 분석정보 조회
 */
var getIndexAnal = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexAnal 호출됨.');
  log.debug(req.query);
  var options = req.query;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexAnal', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.debug("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX LIST 조회 (By Type)
 */
var getIndexListByType = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getKrxIndexListByType 호출됨.');
  if(req.query.selIndexType == "TOTAL") req.query.selIndexType = "";
  var options = {
    large_type: req.query.large_type,
    middle_type: req.query.middle_type,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexListByType', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX LIST 조회 (By Type & 분석정보)
 */
var getIndexListAnalByType = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexListAnalByType 호출됨.');
  if(req.query.middle_type == "TOTAL") req.query.middle_type = "";
  var options = {
    large_type: req.query.large_type,
    middle_type: req.query.middle_type,
    bef1Week: req.query.bef1Week,
    bef1Month: req.query.bef1Month,
    befYtd: req.query.befYtd,
    bef1Year: req.query.bef1Year,
    bef3Year: req.query.bef3Year,
    bef5Year: req.query.bef5Year,
    bef10Year: req.query.bef10Year,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexListAnalByType', options, {
      language: 'sql',
      indent: '  '
    });
    // console.log(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX INTRA 조회
 */
var getIndexIntra = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexIntra 호출됨.');
  var options = {
    F16013: req.query.F16013,
    market_id: req.query.market_id,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexIntra', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX INTRA TERM 조회
 */
var getIndexIntra1 = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getIndexIntra1 호출됨.');
  var options = {
    F16013: req.query.F16013,
    market_id: req.query.market_id,
  };
  if(req.query.term == '1D') options.limit = 100;
  else options.limit = 300;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexIntra1', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * INDEX HIST TERM 조회
 */
var getIndexHist1 = function(req, res) {
  console.log('marketInfo 모듈 안에 있는 getIndexHist1 호출됨.');
  console.log(req.query);
  var options = {
    F16013: req.query.F16013,
    market_id: req.query.market_id,
  };
  console.log(options);
  if(req.query.term == '1M') options.limit = 30;
  else if(req.query.term == '3M') options.limit = 90;
  else if(req.query.term == '6M') options.limit = 180;
  else if(req.query.term == '1Y') options.limit = 300;
  else options.limit = 10000;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getIndexHist1', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    console.log(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP MAST 조회
 */
var getEtpMast = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpMast 호출됨.');
  var options = {};
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpMast', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP BASIC 조회
 */
var getEtpBasic = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpBasic 호출됨.');
  var options = {
    F16013: req.query.F16013,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpBasic', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP 분석정보 조회
 */
var getEtpAnal = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpAnal 호출됨.');
  log.debug(req.query);
  /*
  var options = {
    F16013 : req.query.F16013,
    market_id: req.query.market_id,
  };
  */
  var options = req.query;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpAnal', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.debug("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP 분석정보 조회(NAV)
 */
var getEtpNavAnal = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpNavAnal 호출됨.');
  log.debug(req.query);
  var options = req.query;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpNavAnal', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.debug("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP INTRA 조회
 */
var getEtpIntra = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpIntra 호출됨.');
  var options = {
    F16013: req.query.F16013,
  };
  if(req.query.term == '1D') options.limit = 100;
  else options.limit = 300;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpIntra', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP INTRA 조회(TODAY)
 */
var getEtpIntraToday = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpIntraToday 호출됨.');
  var options = {
    F16013: req.query.F16013,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpIntraToday', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP HOGA INTRA 조회(TODAY)
 */
var getEtpHogaIntraToday = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpHogaIntraToday 호출됨.');
  var options = {
    F16013: req.query.F16013,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpHogaIntraToday', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP Multi INTRA 조회
 */
var getEtpMultiIntra = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpMultiIntra 호출됨.');
  var options = {
    F16013: req.query.F16013,
    F16257: req.query.F16257,
    market_id: req.query.market_id,
  };
  if(req.query.term == '1D') options.limit = 100;
  else options.limit = 300;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpMultiIntra', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
var getEtpHist = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpHist 호출됨.');
  var options = {
    F16013: req.query.F16013,
  };
  if(req.query.term == '1M') options.limit = 30;
  else if(req.query.term == '3M') options.limit = 90;
  else if(req.query.term == '6M') options.limit = 180;
  else if(req.query.term == '1Y') options.limit = 300;
  else options.limit = 10000;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpHist', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query."
    });
    res.end();
  }
};
/*
* ETP Multi HIST 조회
  장전에 F15318 이 메모리 값이 0가 됨. 그래서, 당일 데이터 0가 됨.
  장전 기준가 필요한 경우, 아래 getEtpMultiHist1 을 써야함. 조회 속도 느려짐.
*/
var getEtpMultiHist = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpMultiHist 호출됨.');
  var options = {
    F16013: req.query.F16013,
    market_id: req.query.market_id,
  };
  if(req.query.term == '1M') options.limit = 30;
  else if(req.query.term == '3M') options.limit = 90;
  else if(req.query.term == '6M') options.limit = 180;
  else if(req.query.term == '1Y') options.limit = 300;
  else options.limit = 10000;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpMultiHist', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query."
    });
    res.end();
  }
};
var getEtpMultiHist1 = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpMultiHist1 호출됨.');
  var options = {
    F16013: req.query.F16013,
    F16257: req.query.F16257,
    market_id: req.query.market_id,
  };
  if(req.query.term == '1M') options.limit = 30;
  else if(req.query.term == '3M') options.limit = 90;
  else if(req.query.term == '6M') options.limit = 180;
  else if(req.query.term == '1Y') options.limit = 300;
  else options.limit = 10000;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('common.item', 'getEtpMultiHist1', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query."
    });
    res.end();
  }
};
/*
 * ETP GIGS SECTOR 비중 조회
 */
var getEtpGigsWeight = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpGigsWeight 호출됨.');
  var options = {
    F16012: req.query.F16012,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    getEtpMultiHist
    var stmt = mapper.getStatement('etpDetail', 'getEtpGigsWeight', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETF 순자산총액 지수별 합산
 */
var getEtfSumByIndex = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtfSumByIndex 호출됨.');
  var options = {
    F34239: req.query.F34239,
    F16257: req.query.F16257,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtfSumByIndex', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETN 순자산총액 지수별 합산
 */
var getEtnSumByIndex = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtnSumByIndex 호출됨.');
  var options = {
    F34239: req.query.F34239,
    F16257: req.query.F16257,
  };
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtnSumByIndex', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP SECTOR 기본정보
 */
var getEtpCtgBasic = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpCtgBasic 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtpCtgBasic', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP SECTOR 기본정보
 */
var getEtpSectorMaxRate = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpSectorMaxRate 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtpSectorMaxRate', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETF SECTOR 순자산 총액 합산
 */
var getEtfSectorSum = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtfSectorSum 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtfSectorSum', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETN SECTOR 순자산 총액 합산
 */
var getEtnSectorSum = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtnSectorSum 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtnSectorSum', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP SECTOR 상승종목수
 */
var getEtpSectorUp = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpSectorUp 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtpSectorUp', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP SECTOR 하락종목수
 */
var getEtpSectorDown = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpSectorDown 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtpSectorDown', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP SECTOR 보합종목수
 */
var getEtpSectorBohap = function(req, res) {
  log.debug('marketInfo 모듈 안에 있는 getEtpSectorBohap 호출됨.');
  var options = req.query;
  log.debug(options);
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var stmt = mapper.getStatement('etpinfo', 'getEtpSectorBohap', options, {
      language: 'sql',
      indent: '  '
    });
    log.debug(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP 시장 정보
 */
var getSectorEtpList = function(req, res) {
  try {
    log.debug('marketInfo=>getSectorEtpList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var carousel_info = {
      carousel_cnt: 0,
      carousel_mod: 0
    };
    var carousel_data = [];
    var carousel_mod = [];
    // 캐러셀 나눌 분자는 5개로 처리
    var carousel_div = 5;
    var carousel_cnt = 0;
    var ctg_code = req.query.ctg_code;
    var etpLists = [];
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        function(callback) {
          var params = {
            ctg_code: ctg_code,
          };
          var stmt = mapper.getStatement('market', 'getMarketCtgCodeInfo', params, {
            language: 'sql',
            indent: '  '
          });
          conn.query(stmt, function(err, rows) {
            callback(null, rows);
          })
        },
        function(ctgCodeList, callback) {
          log.debug("ctg_code" + ctgCodeList.length);
          carousel_info.carousel_cnt = Math.floor(ctgCodeList.length / carousel_div);
          carousel_info.carousel_mod = ctgCodeList.length % carousel_div;
          //log.debug("carousel_info.carousel_cnt:", carousel_info.carousel_cnt);
          //log.debug("carousel_info.carousel_mod:", carousel_info.carousel_mod);
          // 항목 갯수 만큼 쿼리 
          async.forEachOf(ctgCodeList, function(ctgCodeItem, index) {
            var params = {
              ctg_code: ctgCodeItem.ctg_code,
              ctg_large_code: ctgCodeItem.ctg_large_code,
            };
            //log.debug("ctgCodeItem.ctg_large_code,"+ctgCodeItem.ctg_large_code);
            var ctg_name = ctgCodeItem.ctg_name;
            var stmt = mapper.getStatement('etpinfo', 'getEtpListByJisu', params, {
              language: 'sql',
              indent: '  '
            });
            conn.query(stmt, function(err, rows) {
              /* ===================상단 데이터 생성 =========================*/
              var total_amt = 0;
              var etf_cnt = 0;
              var etn_cnt = 0;
              //log.debug("(carousel_info.carousel_cnt * 5):" , (carousel_info.carousel_cnt * 5));
              //log.debug("index" , index);
              if((carousel_info.carousel_cnt * 5) > index) {
                //log.debug("data:=====================", index);
                async.forEachOf(rows, function(item, idx) {
                  total_amt += Number(item.F15028);
                  log.debug("tot_amt" + item.F15028);
                  // ctf 구분자가 1과 2일 경우 
                  if(item.F16493 == '1' || item.F16493 == '2') {
                    etf_cnt++;
                  } else if(item.F16493 == '3' || item.F16493 == '4') {
                    etn_cnt++;
                  }
                });
                carousel_data.push({
                  "ctg_code": ctgCodeItem.ctg_code,
                  "name": ctg_name,
                  "total_amt": total_amt,
                  "etf_cnt": etf_cnt,
                  "etn_cnt": etn_cnt
                });
              } else {
                //log.debug("mode:=====================", index);
                async.forEachOf(rows, function(item, idx) {
                  total_amt += Number(item.F15028);
                  log.debug("tot_amt" + item.F15028);
                  // ctf 구분자가 1과 2일 경우 
                  if(item.F16493 == '1' || item.F16493 == '2') {
                    etf_cnt++;
                  } else if(item.F16493 == '3' || item.F16493 == '4') {
                    etn_cnt++;
                  }
                });
                carousel_mod.push({
                  "ctg_code": ctgCodeItem.ctg_code,
                  "name": ctg_name,
                  "total_amt": total_amt,
                  "etf_cnt": etf_cnt,
                  "etn_cnt": etn_cnt
                });
              }
              /* ===================상단 데이터 생성 완료 =========================*/
              // 조회한 데이터 저장
              etpLists.push(rows);
              //log.debug(ctgCodeList.length +"::" + index);
              if(index == ctgCodeList.length - 1) {
                callback(null, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList);
              }
            })
          });
        }
      ], function(err, etpLists, carousel_info, carousel_data, carousel_mod, ctgCodeList) {
        // result now equals 'done'
        //carousel_data = carousel_data.sort(carouselSort);
        //log.debug("carousel_mod:", carousel_mod.length);
        res.json({
          success: true,
          etpLists: etpLists,
          carousel_info: carousel_info,
          carousel_data: carousel_data,
          carousel_mod: carousel_mod,
          ctgCodeList: ctgCodeList
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("Error while performing Query.", exception);
    res.json({
      success: false,
      message: exception
    });
    res.end();
  }

  function carouselSort(a, b) {
    if(a.ctg_code == b.ctg_code) {
      return 0
    }
    return a.ctg_code > b.ctg_code ? 1 : -1;
  }
};
/*
 * INDEX 시장 정보
 */
var getMarketIndexList = function(req, res) {
  try {
    log.debug('marketInfo=>getMarketIndexList 호출됨.');
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    var graphinfos = [];
    var krsLists = [];
    var fnGuideLists = [];
    Promise.using(pool.connect(), conn => {
      async.waterfall([
        function(callback) {
          var params = {
            com_mst_cd: "COM003",
          };
          /* 시장 대표 정보 쿼리 KOSPI, KOSPI200, KOSDAQ, KOSDAQ150*/
          var stmt = mapper.getStatement('etpinfo', 'getIndexInfoByCodeDtl', params, {
            language: 'sql',
            indent: '  '
          });
          conn.query(stmt, function(err, rows) {
            callback(null, rows);
          })
        },
        function(marketRepList, callback) {
          // 항목 갯수 만큼 쿼리 
          async.forEachOf(marketRepList, function(marketItem, index) {
            var params = {
              F16013: marketItem.F16013,
              market_id: marketItem.market_id,
            };
            log.debug("현재가=", marketItem.F15001)
            var stmt = mapper.getStatement('common.item', 'getIndexIntra', params, {
              language: 'sql',
              indent: '  '
            });
            conn.query(stmt, function(err, rows) {
              /* ===================상단 데이터 생성 완료 =========================*/
              // 조회한 데이터 저장
              graphinfos.push(rows);
              //log.debug(ctgCodeList.length +"::" + index);
              if(index == marketRepList.length - 1) {
                callback(null, marketRepList, graphinfos);
              }
            })
          });
        },
        function(marketRepList, graphinfos, callback) {
          var dataCnt = 0;
          // KRS INDEX 정보 추출
          var params = {
            large_type: 'KRX'
          };
          var stmt = mapper.getStatement('common.item', 'getIndexBaseInfo', params, {
            language: 'sql',
            indent: '  '
          });
          // 대입 문자 치환
          stmt = stmt.replace(/\: =/g, ':=');
          log.debug(stmt);
          conn.query(stmt, function(err, rows) {
            /* ===================상단 데이터 생성 완료 =========================*/
            // 조회한 데이터 저장
            krsLists.push(rows);
            dataCnt++;
            if(dataCnt == 2) {
              callback(null, marketRepList, graphinfos, krsLists, fnGuideLists);
            }
          })
          // FNGUIDE INDEX 정보 추출
          params = {
            large_type: 'FNGUIDE'
          };
          stmt = mapper.getStatement('common.item', 'getIndexBaseInfo', params, {
            language: 'sql',
            indent: '  '
          });
          // 대입 문자 치환
          stmt = stmt.replace(/\: =/g, ':=');
          conn.query(stmt, function(err, rows) {
            /* ===================상단 데이터 생성 완료 =========================*/
            // 조회한 데이터 저장
            fnGuideLists.push(rows);
            dataCnt++;
            if(dataCnt == 2) {
              callback(null, marketRepList, graphinfos, krsLists, fnGuideLists);
            }
          })
        }
      ], function(err, marketRepList, graphinfos, krsLists, fnGuideLists) {
        // result now equals 'done'
        res.json({
          success: true,
          marketRepList: marketRepList,
          graphinfos: graphinfos,
          krsLists: krsLists,
          fnGuideLists: fnGuideLists
        });
        res.end();
      });
    });
  } catch (exception) {
    log.error("Error while performing Query.", exception);
    res.json({
      success: false,
      message: exception
    });
    res.end();
  }
};
/*
 * ETP AVG 값 조회(HIST)
 */
var getEtpHistAvg = function(req, res) {
  // console.log('marketInfo 모듈 안에 있는 getEtpHistAvg 호출됨.');
  // console.log(req.query);
  // var options = {
  //   F16013 : req.query.F16013,
  //   colName: req.query.colName,
  //   num: req.query.num
  // };
  var options = req.query;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    // console.log(options);
    var stmt = mapper.getStatement('common.item', 'getEtpHistAvg', options, {
      language: 'sql',
      indent: '  '
    });
    // console.log(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        // console.log(rows);
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    console.log("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
/*
 * ETP AVG 값 조회(INTRA)
 */
var getEtpIntraAvg = function(req, res) {
  // console.log('marketInfo 모듈 안에 있는 getEtpIntraAvg 호출됨.');
  // console.log(req.query);
  // var options = {
  //   F16013 : req.query.F16013,
  //   colName: req.query.colName,
  //   num: req.query.num
  // };
  var options = req.query;
  try {
    var pool = req.app.get("pool");
    var mapper = req.app.get("mapper");
    // console.log(options);
    var stmt = mapper.getStatement('common.item', 'getEtpIntraAvg', options, {
      language: 'sql',
      indent: '  '
    });
    // console.log(stmt);
    Promise.using(pool.connect(), conn => {
      conn.queryAsync(stmt).then(rows => {
        // console.log(rows);
        res.json({
          success: true,
          results: rows
        });
        res.end();
      });
    });
  } catch (exception) {
    console.log("err=>", exception);
    res.json({
      success: false,
      message: "Error while performing Query.",
    });
    res.end();
  }
};
module.exports.getIndexMast = getIndexMast;
module.exports.getIndexBasic = getIndexBasic;
module.exports.getIndexIntra = getIndexIntra;
module.exports.getIndexIntra1 = getIndexIntra1;
module.exports.getIndexHist1 = getIndexHist1;
module.exports.getIndexAnal = getIndexAnal;
module.exports.getIndexListByType = getIndexListByType;
module.exports.getIndexListAnalByType = getIndexListAnalByType;
module.exports.getEtpMast = getEtpMast;
module.exports.getEtpBasic = getEtpBasic;
module.exports.getEtpAnal = getEtpAnal;
module.exports.getEtpNavAnal = getEtpNavAnal;
module.exports.getEtpIntra = getEtpIntra;
module.exports.getEtpIntraToday = getEtpIntraToday;
module.exports.getEtpHogaIntraToday = getEtpHogaIntraToday;
module.exports.getEtpMultiIntra = getEtpMultiIntra;
module.exports.getEtpHist = getEtpHist;
module.exports.getEtpMultiHist = getEtpMultiHist;
module.exports.getEtpMultiHist1 = getEtpMultiHist1;
module.exports.getEtpGigsWeight = getEtpGigsWeight;
module.exports.getEtfSumByIndex = getEtfSumByIndex;
module.exports.getEtnSumByIndex = getEtnSumByIndex;
module.exports.getEtpCtgBasic = getEtpCtgBasic;
module.exports.getEtpSectorMaxRate = getEtpSectorMaxRate;
module.exports.getEtfSectorSum = getEtfSectorSum;
module.exports.getEtnSectorSum = getEtnSectorSum;
module.exports.getEtpSectorUp = getEtpSectorUp;
module.exports.getEtpSectorDown = getEtpSectorDown;
module.exports.getEtpSectorBohap = getEtpSectorBohap;
module.exports.getSectorEtpList = getSectorEtpList;
module.exports.getMarketIndexList = getMarketIndexList;
module.exports.getEtpHistAvg = getEtpHistAvg;
module.exports.getEtpIntraAvg = getEtpIntraAvg;