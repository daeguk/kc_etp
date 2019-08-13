-- --------------------------------------------------------
-- 호스트:                          211.255.203.126
-- 서버 버전:                        5.7.17 - MySQL Community Server (GPL)
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- kc_etp 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `kc_etp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `kc_etp`;

-- 테이블 kc_etp.m000cskicompi 구조 내보내기
CREATE TABLE IF NOT EXISTS `m000cskicompi` (
  `UP_CODE` decimal(4,0) NOT NULL COMMENT '업종코드',
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `MKT_IDX_TP_CD` char(1) NOT NULL COMMENT '시장지수구분코드',
  `ISU_SRT_CD1` char(6) DEFAULT NULL COMMENT '단축코드(16013)',
  `CALC_FLAG` decimal(1,0) DEFAULT NULL COMMENT '업종산출포함유무',
  PRIMARY KEY (`UP_CODE`,`ISIN_CODE`,`MKT_IDX_TP_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M000CSKICOMPI';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m000_skimfimapi 구조 내보내기
CREATE TABLE IF NOT EXISTS `m000_skimfimapi` (
  `TRADE_DATE` char(8) NOT NULL COMMENT '일자',
  `UP_CODE` decimal(4,0) NOT NULL COMMENT '업종코드',
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `CEILING_PERCNT` decimal(20,12) DEFAULT NULL COMMENT 'CEILING비중',
  `STYLE_INCLUD_PERCNT` decimal(20,12) DEFAULT NULL COMMENT '스타일포함비중',
  PRIMARY KEY (`TRADE_DATE`,`UP_CODE`,`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M001_SKSETFFORMASTI';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m001uetpcode 구조 내보내기
CREATE TABLE IF NOT EXISTS `m001uetpcode` (
  `l_cd` char(3) NOT NULL COMMENT '대분류코드',
  `l_cd_nm` varchar(30) DEFAULT NULL COMMENT '대분류코드명',
  `m_cd` char(4) NOT NULL COMMENT '중분류코드',
  `m_cd_nm` varchar(512) DEFAULT NULL COMMENT '중문류코드명',
  PRIMARY KEY (`l_cd`,`m_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='m001uetpcode';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m001uetpinstcode 구조 내보내기
CREATE TABLE IF NOT EXISTS `m001uetpinstcode` (
  `id` varchar(15) NOT NULL COMMENT 'ID',
  `user_type` char(4) DEFAULT NULL COMMENT '참여자구분코드',
  `inst_cd` char(5) DEFAULT NULL COMMENT '발행기관구분코드',
  `inst_nm` varchar(40) DEFAULT NULL COMMENT '발행기관명',
  `user_nm` varchar(40) DEFAULT NULL COMMENT '담당자명',
  `user_pos` varchar(40) DEFAULT NULL COMMENT '담당자직책',
  `tel_no` varchar(40) DEFAULT NULL COMMENT '회사전화번호',
  `cel_no` varchar(40) DEFAULT NULL COMMENT '휴대폰',
  `email` varchar(40) DEFAULT NULL COMMENT '이메일',
  `comment` varchar(200) DEFAULT NULL COMMENT '설명',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M001UETPINSTCODE';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m001uetpmaster 구조 내보내기
CREATE TABLE IF NOT EXISTS `m001uetpmaster` (
  `seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'SEQ',
  `isu_kor_nm` varchar(100) DEFAULT NULL COMMENT '종목한글명',
  `isu_eng_nm` varchar(100) DEFAULT NULL COMMENT '종목영문명',
  `isin_code` char(12) DEFAULT NULL COMMENT '종목코드',
  `isu_srt_cd` char(6) DEFAULT NULL COMMENT '단축코드',
  `etp_type` char(3) DEFAULT NULL COMMENT '상품구분',
  `inst_cd` char(5) DEFAULT NULL COMMENT '발행기관코드',
  `req_date` char(8) DEFAULT NULL COMMENT '신청일자',
  `list_req_date` char(8) DEFAULT NULL COMMENT '상장신청일자',
  `list_date` char(8) DEFAULT NULL COMMENT '상장일자',
  `krx_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수KRX분배여부',
  `comp_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수발행사분배여부',
  `ksd_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수예탁원분배여부',
  `mirae_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수미래에셋분배여부',
  `idx_inst_cd` char(4) DEFAULT NULL COMMENT '기초지수산출기관코드',
  `idx_sym_code` varchar(16) DEFAULT NULL COMMENT '기초지수심볼코드',
  `idx_nm` varchar(100) DEFAULT NULL COMMENT '기초지수명',
  `idx_dist_inst_cd` char(4) DEFAULT NULL COMMENT '기초지수입수기관코드',
  `idx_close_type` char(2) DEFAULT NULL COMMENT '기초지수종가타입',
  `idx_holy_cd` varchar(5) DEFAULT NULL COMMENT '기초지수휴장일',
  `idx_trace_yd_mult_type` decimal(2,0) DEFAULT NULL COMMENT '기초지수추적배수구분',
  `pre_idx_type` decimal(2,0) DEFAULT NULL COMMENT '전일기초지수구분(한국시간기준)',
  `idx_file_nm` varchar(512) DEFAULT NULL COMMENT '기초지수파일명(경로포함)',
  `idx_comp_ksd_dist_yn` char(1) DEFAULT NULL COMMENT '지수구성종목예탁원분배여부',
  `idx_comp_mirae_dist_yn` char(1) DEFAULT NULL COMMENT '지수구성종목미래에셋분배여부',
  `blom_ticker` varchar(15) DEFAULT NULL COMMENT '블룸버그티커',
  `user_req` varchar(1000) DEFAULT NULL COMMENT '종가지수요청사항',
  `real_yn` char(1) DEFAULT NULL COMMENT '실시간여부',
  `ridx_inst_cd` char(4) DEFAULT NULL COMMENT '실시간지수산출기관코드',
  `ridx_dist_inst_cd` char(4) DEFAULT NULL COMMENT '실시간지수입수기관코드',
  `ridx_crt_sym_code` varchar(16) DEFAULT NULL COMMENT '실시간지수산출기관심볼코드',
  `ridx_dist_sym_code` varchar(16) DEFAULT NULL COMMENT '실시간지수입수기관심볼코드',
  `ridx_holy_cd` varchar(10) DEFAULT NULL COMMENT '실시간지수휴장일',
  `ridx_krx_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수KRX분배여부',
  `ridx_comp_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수발행사분배여부',
  `ridx_ksd_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수예탁원분배여부',
  `ridx_mirae_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수미래에셋분배여부',
  `ridx_dist_term` decimal(3,0) DEFAULT NULL COMMENT '실시간지수제공주기',
  `refidx_sym_code` varchar(16) DEFAULT NULL COMMENT '참고지수심볼코드',
  `refidx_nm` varchar(100) DEFAULT NULL COMMENT '참고지수명',
  `refidx_inst_cd` char(4) DEFAULT NULL COMMENT '참고지수입수기관코드',
  `refidx_file_nm` varchar(30) DEFAULT NULL COMMENT '참고지수파일명',
  `refidx_req` varchar(1000) DEFAULT NULL COMMENT '참고지수요청사항',
  `refidx_blom_ticker` varchar(15) DEFAULT NULL COMMENT '참고지수블룸버그티커',
  `ex_rate_cd` char(4) DEFAULT NULL COMMENT '적용환율',
  `ex_hedge_yn` char(1) DEFAULT NULL COMMENT '환헷지여부',
  `isin_stat_cd` char(4) DEFAULT NULL COMMENT '종목상태코드',
  `inav_calc_cd` char(4) DEFAULT NULL COMMENT 'iNAV/iIV산출구분코드',
  `idx_rec_yn` char(1) DEFAULT NULL COMMENT '기초지수입수여부_KOSCOM',
  `idx_dis_yn` char(1) DEFAULT NULL COMMENT '기초지수분배여부_KOSCOM',
  `inav_calc_yn` char(1) DEFAULT NULL COMMENT 'iNAV산출여부_KOSCOM',
  `idx_mid` decimal(3,0) DEFAULT NULL COMMENT '기초지수MID_KOSCOM',
  `ridx_mid` decimal(3,0) DEFAULT NULL COMMENT '실시간지수MID_KOSCOM',
  `close_file` varchar(100) DEFAULT NULL COMMENT '종가파일_KOSCOM',
  `real_idx_tr` varchar(100) DEFAULT NULL COMMENT '실시간TR_KOSCOM',
  `proc_stat` varchar(300) DEFAULT NULL COMMENT '진행상황_KOSCOM',
  `insert_id` varchar(40) DEFAULT NULL COMMENT '생성자ID',
  `insert_time` char(12) DEFAULT NULL COMMENT '생성시간',
  `update_id` varchar(40) DEFAULT NULL COMMENT '수정자ID',
  `update_time` char(12) DEFAULT NULL COMMENT '수정시간',
  `kor_for_type` char(1) DEFAULT NULL COMMENT '국내/해외 구분',
  `agent_cd` char(4) DEFAULT NULL COMMENT '사무수탁사코드 ',
  `idx_comp_cd` char(4) DEFAULT NULL COMMENT '국내ETP기초지수타입코드 ',
  `krx_up_code` decimal(5,0) DEFAULT NULL COMMENT '거래소업종코드 ',
  `agent_up_code` decimal(5,0) DEFAULT NULL COMMENT '사무수탁사업종코드 ',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=467 DEFAULT CHARSET=utf8 COMMENT='M001UETPMASTER';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m001uetpmasterh 구조 내보내기
CREATE TABLE IF NOT EXISTS `m001uetpmasterh` (
  `seq_master` int(11) NOT NULL COMMENT 'SEQ MASTER',
  `seq_hist` int(11) NOT NULL COMMENT 'SEQ_HISTORY',
  `isu_kor_nm` varchar(100) DEFAULT NULL COMMENT '종목한글명',
  `isu_eng_nm` varchar(100) DEFAULT NULL COMMENT '종목영문명',
  `isin_code` char(12) DEFAULT NULL COMMENT '종목코드',
  `isu_srt_cd` char(6) DEFAULT NULL COMMENT '단축코드',
  `etp_type` char(3) DEFAULT NULL COMMENT '상품구분',
  `inst_cd` char(5) DEFAULT NULL COMMENT '발행기관코드',
  `req_date` char(8) DEFAULT NULL COMMENT '신청일자',
  `list_req_date` char(8) DEFAULT NULL COMMENT '상장신청일자',
  `list_date` char(8) DEFAULT NULL COMMENT '상장일자',
  `krx_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수KRX분배여부',
  `comp_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수발행사분배여부',
  `ksd_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수예탁원분배여부',
  `mirae_dist_yn` char(1) DEFAULT NULL COMMENT '기초지수미래에셋분배여부',
  `idx_inst_cd` char(4) DEFAULT NULL COMMENT '기초지수산출기관코드',
  `idx_sym_code` varchar(16) DEFAULT NULL COMMENT '기초지수심볼코드',
  `idx_nm` varchar(100) DEFAULT NULL COMMENT '기초지수명',
  `idx_dist_inst_cd` char(4) DEFAULT NULL COMMENT '기초지수입수기관코드',
  `idx_close_type` char(2) DEFAULT NULL COMMENT '기초지수종가타입',
  `idx_holy_cd` varchar(5) DEFAULT NULL COMMENT '기초지수휴장일',
  `idx_trace_yd_mult_type` decimal(2,0) DEFAULT NULL COMMENT '기초지수추적배수구분',
  `pre_idx_type` decimal(2,0) DEFAULT NULL COMMENT '전일기초지수구분(한국시간기준)',
  `idx_file_nm` varchar(512) DEFAULT NULL COMMENT '기초지수파일명(경로포함)',
  `idx_comp_ksd_dist_yn` char(1) DEFAULT NULL COMMENT '지수구성종목예탁원분배여부',
  `idx_comp_mirae_dist_yn` char(1) DEFAULT NULL COMMENT '지수구성종목미래에셋분배여부',
  `blom_ticker` varchar(15) DEFAULT NULL COMMENT '블룸버그티커',
  `user_req` varchar(1000) DEFAULT NULL COMMENT '종가지수요청사항',
  `real_yn` char(1) DEFAULT NULL COMMENT '실시간여부',
  `ridx_inst_cd` char(4) DEFAULT NULL COMMENT '실시간지수산출기관코드',
  `ridx_dist_inst_cd` char(4) DEFAULT NULL COMMENT '실시간지수입수기관코드',
  `ridx_crt_sym_code` varchar(16) DEFAULT NULL COMMENT '실시간지수산출기관심볼코드',
  `ridx_dist_sym_code` varchar(16) DEFAULT NULL COMMENT '실시간지수입수기관심볼코드',
  `ridx_holy_cd` varchar(10) DEFAULT NULL COMMENT '실시간지수휴장일',
  `ridx_krx_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수KRX분배여부',
  `ridx_comp_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수발행사분배여부',
  `ridx_ksd_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수예탁원분배여부',
  `ridx_mirae_dist_yn` char(1) DEFAULT NULL COMMENT '실시간지수미래에셋분배여부',
  `ridx_dist_term` decimal(3,0) DEFAULT NULL COMMENT '실시간지수제공주기',
  `refidx_sym_code` varchar(16) DEFAULT NULL COMMENT '참고지수심볼코드',
  `refidx_nm` varchar(100) DEFAULT NULL COMMENT '참고지수명',
  `refidx_inst_cd` char(4) DEFAULT NULL COMMENT '참고지수입수기관코드',
  `refidx_file_nm` varchar(30) DEFAULT NULL COMMENT '참고지수파일명',
  `refidx_req` varchar(1000) DEFAULT NULL COMMENT '참고지수요청사항',
  `refidx_blom_ticker` varchar(15) DEFAULT NULL COMMENT '참고지수블룸버그티커',
  `ex_rate_cd` char(4) DEFAULT NULL COMMENT '적용환율',
  `ex_hedge_yn` char(1) DEFAULT NULL COMMENT '환헷지여부',
  `isin_stat_cd` char(4) DEFAULT NULL COMMENT '종목상태코드',
  `inav_calc_cd` char(4) DEFAULT NULL COMMENT 'iNAV/iIV산출구분코드',
  `idx_rec_yn` char(1) DEFAULT NULL COMMENT '기초지수입수여부_KOSCOM',
  `idx_dis_yn` char(1) DEFAULT NULL COMMENT '기초지수분배여부_KOSCOM',
  `inav_calc_yn` char(1) DEFAULT NULL COMMENT 'iNAV산출여부_KOSCOM',
  `idx_mid` decimal(3,0) DEFAULT NULL COMMENT '기초지수MID_KOSCOM',
  `ridx_mid` decimal(3,0) DEFAULT NULL COMMENT '실시간지수MID_KOSCOM',
  `close_file` varchar(100) DEFAULT NULL COMMENT '종가파일_KOSCOM',
  `real_idx_tr` varchar(100) DEFAULT NULL COMMENT '실시간TR_KOSCOM',
  `proc_stat` varchar(300) DEFAULT NULL COMMENT '진행상황_KOSCOM',
  `insert_id` varchar(15) DEFAULT NULL COMMENT '생성자ID',
  `insert_time` char(12) DEFAULT NULL COMMENT '생성시간',
  `update_id` varchar(15) DEFAULT NULL COMMENT '수정자ID',
  `update_time` char(12) DEFAULT NULL COMMENT '수정시간',
  `kor_for_type` char(1) DEFAULT NULL COMMENT '국내/해외 구분',
  `agent_cd` char(4) DEFAULT NULL COMMENT '사무수탁사코드 ',
  `idx_comp_cd` char(4) DEFAULT NULL COMMENT '국내ETP기초지수타입코드 ',
  `krx_up_code` decimal(5,0) DEFAULT NULL COMMENT '거래소업종코드 ',
  `agent_up_code` decimal(5,0) DEFAULT NULL COMMENT '사무수탁사업종코드 ',
  PRIMARY KEY (`seq_master`,`seq_hist`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M001UETPMASTER HISTORY';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m001_sksetfshrsi 구조 내보내기
CREATE TABLE IF NOT EXISTS `m001_sksetfshrsi` (
  `TRADE_DATE` char(8) NOT NULL COMMENT '일자',
  `COMPANY_NO` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `ETF_ISIN_CODE` char(12) NOT NULL COMMENT 'ETF표준코드',
  `ISSUE_STOCKS` decimal(10,0) DEFAULT NULL COMMENT '발행증권수',
  `ESTAB_STOCKS` decimal(10,0) DEFAULT NULL COMMENT '설정증권수',
  `REBUY_STOCKS` decimal(10,0) DEFAULT NULL COMMENT '환매증권수',
  `LISTED_TYPE` decimal(2,0) DEFAULT NULL COMMENT '상장구분',
  PRIMARY KEY (`TRADE_DATE`,`COMPANY_NO`,`ETF_ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M001_SKSETFSHRSI';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m168uidxcomp 구조 내보내기
CREATE TABLE IF NOT EXISTS `m168uidxcomp` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `GUBUN` char(10) NOT NULL COMMENT 'WISEFN/FNGUIDE',
  `F16013` char(12) NOT NULL COMMENT '종목코드',
  `F33711` decimal(2,0) DEFAULT NULL COMMENT '시장구분(1:유가2:코스닥)',
  `F03003` decimal(10,0) DEFAULT NULL COMMENT '전일종가',
  `F34241` decimal(2,0) DEFAULT NULL COMMENT '가격산정구분(0:실시간1:종가)',
  `F30812` decimal(18,0) DEFAULT NULL COMMENT '상장주식수',
  `F30813` decimal(3,0) DEFAULT NULL COMMENT '유동주식비율',
  PRIMARY KEY (`F12506`,`GUBUN`,`F16013`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M168UIDXCOMP';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m168uidxmap 구조 내보내기
CREATE TABLE IF NOT EXISTS `m168uidxmap` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `GUBUN` char(10) NOT NULL COMMENT 'WISEFN/FNGUIDE',
  `UP_CODE` char(6) NOT NULL COMMENT '업종코드',
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `CEILING_PERCNT` decimal(20,12) DEFAULT NULL COMMENT 'CEILING비중',
  `STYLE_INCLUD_PERCNT` decimal(20,12) DEFAULT NULL COMMENT '스타일포함비중',
  PRIMARY KEY (`F12506`,`GUBUN`,`UP_CODE`,`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M168UIDXMAP';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.m168uidxrefe 구조 내보내기
CREATE TABLE IF NOT EXISTS `m168uidxrefe` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `GUBUN` char(10) NOT NULL COMMENT 'WISEFN/FNGUIDE',
  `F16013` char(6) NOT NULL COMMENT '지수코드(MFI업종코드표)',
  `F16002` varchar(80) DEFAULT NULL COMMENT '지수명한글',
  `F16004` varchar(80) DEFAULT NULL COMMENT '지수명영문',
  `F30812` decimal(18,0) DEFAULT NULL COMMENT '기준시가총액',
  `F03003` decimal(10,3) DEFAULT NULL COMMENT '전일종가',
  `F34840` decimal(20,0) DEFAULT NULL COMMENT '현금',
  PRIMARY KEY (`F12506`,`GUBUN`,`F16013`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='M168UIDXREFE';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etffor_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etffor_mast` (
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `ISU_SRT_CD` varchar(9) DEFAULT NULL COMMENT '종목단축코드',
  `ISU_KOR_ABBRV` varchar(40) DEFAULT NULL COMMENT '종목한글약명',
  `SYM_CODE` char(16) DEFAULT NULL COMMENT '심블코드',
  `CLOSE_TYPE` char(2) DEFAULT NULL COMMENT '종가구분',
  `NAME_K` varchar(100) DEFAULT NULL COMMENT '한글명',
  `EX_HEDGE_TYPE` decimal(4,0) DEFAULT NULL COMMENT '환헷지구분',
  `EX_RATE_CODE` char(3) DEFAULT NULL COMMENT '환율코드',
  `NATION_CODE` char(4) DEFAULT NULL COMMENT '국가코드',
  `PROC_TYPE` decimal(4,0) DEFAULT NULL COMMENT '처리구분',
  `ETF_TRACE_YD_MULT` decimal(13,6) DEFAULT NULL COMMENT 'ETF추적수익율배수',
  `UPDATE_DATE` char(8) DEFAULT NULL COMMENT '업데이트일자',
  `TABLE_NAME` varchar(40) DEFAULT NULL COMMENT '테이블명',
  `TR_CODE` char(5) DEFAULT NULL COMMENT 'TR코드',
  `REAL_TYPE` decimal(1,0) DEFAULT NULL COMMENT '실시간구분',
  `INDEX_TYPE` decimal(1,0) DEFAULT NULL COMMENT '지수구분',
  `R_UP_PCMKT_ID` decimal(4,0) DEFAULT NULL COMMENT 'ETF관련업종PC시장ID(R_F18424)',
  `R_ETF_RATE` decimal(10,0) DEFAULT NULL COMMENT '해외_신종ETF배율(R_F18453)',
  `R_NEW_ETF_TP_CD` decimal(4,0) DEFAULT NULL COMMENT '신종ETF구분(R_F18500)',
  `R_SUB_TP_CD` decimal(4,0) DEFAULT NULL COMMENT '부구분(R_F16025)',
  `R_SYM_CODE` char(16) DEFAULT NULL COMMENT '심블코드(R)',
  `R_INDEX_MID` decimal(5,0) DEFAULT NULL COMMENT 'ETF기초지수MID(R_F34239)',
  `R_CALC_TYPE` char(1) DEFAULT NULL COMMENT 'ETF계산유형(R_F34240)',
  `R_INDEX_TYPE` char(1) DEFAULT NULL COMMENT 'ETF기초지수유형(R_F34241)',
  `R_NATION_CODE` char(8) DEFAULT NULL COMMENT '휴장일(R)',
  `R_BASIC_INDEX_DATE` varchar(10) DEFAULT NULL COMMENT '전일기초지수일자',
  `R_EX_RATE_CODE` char(5) DEFAULT NULL COMMENT '실시간환율코드',
  `DEL_CD` decimal(1,0) DEFAULT NULL COMMENT '삭제구분',
  `BBG_TICKER` varchar(40) DEFAULT NULL COMMENT '블룸버그티커',
  `RIC` varchar(40) DEFAULT NULL COMMENT '로이터코드',
  `REFIDX_MID` decimal(3,0) DEFAULT NULL COMMENT '참고지수MID',
  `REFIDX_CODE` varchar(15) DEFAULT NULL COMMENT '참고지수코드',
  `ETP_IDX_YN` char(1) DEFAULT NULL COMMENT 'ETP기초지수제공여부',
  PRIMARY KEY (`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etffor_mast';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etfkor_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etfkor_mast` (
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `ISU_SRT_CD` varchar(9) DEFAULT NULL COMMENT '종목단축코드',
  `ISU_KOR_ABBRV` varchar(40) DEFAULT NULL COMMENT '종목한글약명',
  `NAME_K` varchar(50) DEFAULT NULL COMMENT '한글명',
  `UPD_DATE` char(8) DEFAULT NULL COMMENT '업데이트일자',
  `R_ETF_UP_STR` char(16) DEFAULT NULL COMMENT 'ETF관련업종STRING(R_F18458)',
  `R_ETF_MID_UP` char(6) DEFAULT NULL COMMENT 'ETF관련업종(중)(R_F16495)',
  `R_UP_PCMKT_ID` decimal(4,0) DEFAULT NULL COMMENT 'ETF관련업종PC시장ID(F18424)',
  `R_ETF_RATE` decimal(10,0) DEFAULT NULL COMMENT '해외_신종ETN배율(R_F18453)',
  `R_NEW_ETF_TP_CD` decimal(4,0) DEFAULT NULL COMMENT '신종ETF구분(R_F18500)',
  `R_SUB_TP_CD` decimal(4,0) DEFAULT NULL COMMENT '부구분(R_F16025)',
  `R_INDEX_MID` decimal(5,0) DEFAULT NULL COMMENT 'ETF기초지수MID(R_F34239)',
  `DEL_CD` decimal(1,0) DEFAULT NULL COMMENT '삭제구분',
  `SYM_CODE` char(16) DEFAULT NULL COMMENT '심볼코드',
  `CLOSE_TYPE` char(5) DEFAULT NULL COMMENT '종가유형',
  `REFIDX_MID` decimal(3,0) DEFAULT NULL COMMENT '참고지수MID',
  `REFIDX_CODE` varchar(15) DEFAULT NULL COMMENT '참고지수코드',
  `ETP_IDX_YN` char(1) DEFAULT NULL COMMENT 'ETP기초지수제공여부',
  PRIMARY KEY (`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etfkor_mast';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etfpdf_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etfpdf_basic` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `F33837` decimal(4,0) DEFAULT NULL COMMENT '구성종목수',
  `F16499` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수',
  `F33861` decimal(4,0) DEFAULT NULL COMMENT 'ETF시장구분',
  `F16004` varchar(40) DEFAULT NULL COMMENT '해외시장종목명',
  `F34840` decimal(18,0) DEFAULT NULL COMMENT '액면금액설정현금액',
  `F33760` decimal(8,0) DEFAULT NULL COMMENT '이익분배기준일',
  `F16588` decimal(18,0) DEFAULT NULL COMMENT '평가금액',
  `F34743` decimal(10,0) DEFAULT NULL COMMENT 'ETF_PDF비중',
  `F34744` decimal(1,0) DEFAULT NULL COMMENT 'ETF_PDF포함여부',
  `F16006` char(16) DEFAULT NULL COMMENT '영문심볼',
  PRIMARY KEY (`F12506`,`F16583`,`F16012`,`F16013`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etfpdf_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etfpdf_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etfpdf_hist` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `F33837` decimal(4,0) DEFAULT NULL COMMENT '구성종목수',
  `F16499` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수',
  `F33861` decimal(4,0) DEFAULT NULL COMMENT 'ETF시장구분',
  `F16004` varchar(40) DEFAULT NULL COMMENT '해외시장종목명',
  `F34840` decimal(18,0) DEFAULT NULL COMMENT '액면금액설정현금액',
  `F33760` decimal(8,0) DEFAULT NULL COMMENT '이익분배기준일',
  `F16588` decimal(18,0) DEFAULT NULL COMMENT '평가금액',
  `F34743` decimal(10,0) DEFAULT NULL COMMENT 'ETF_PDF비중',
  `F34744` decimal(1,0) DEFAULT NULL COMMENT 'ETF_PDF포함여부',
  `F16006` char(16) DEFAULT NULL COMMENT '영문심볼',
  PRIMARY KEY (`F12506`,`F16583`,`F16012`,`F16013`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etfpdf_hist';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etnfor_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etnfor_mast` (
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `ISU_SRT_CD` varchar(9) DEFAULT NULL COMMENT '종목단축코드',
  `ISU_KOR_ABBRV` varchar(40) DEFAULT NULL COMMENT '종목한글약명',
  `SYM_CODE` char(16) DEFAULT NULL COMMENT '심블코드',
  `CLOSE_TYPE` char(2) DEFAULT NULL COMMENT '종가구분',
  `NAME_K` varchar(100) DEFAULT NULL COMMENT '한글명',
  `EX_HEDGE_TYPE` decimal(4,0) DEFAULT NULL COMMENT '환헷지구분',
  `EX_RATE_CODE` char(3) DEFAULT NULL COMMENT '환율코드',
  `NATION_CODE` char(10) DEFAULT NULL COMMENT '국가코드',
  `PROC_TYPE` decimal(4,0) DEFAULT NULL COMMENT '처리구분',
  `UPDATE_DATE` char(8) DEFAULT NULL COMMENT '업데이트일자',
  `TABLE_NAME` varchar(40) DEFAULT NULL COMMENT '테이블명',
  `TR_CODE` char(5) DEFAULT NULL COMMENT 'TR코드',
  `REAL_TYPE` decimal(1,0) DEFAULT NULL COMMENT '실시간구분',
  `INDEX_TYPE` decimal(1,0) DEFAULT NULL COMMENT '지수구분',
  `R_UP_PCMKT_ID` decimal(4,0) DEFAULT NULL COMMENT 'ETF관련업종PC시장ID(R_F18424)',
  `R_ETF_RATE` decimal(10,0) DEFAULT NULL COMMENT '해외_신종ETF배율(R_F18453)',
  `R_SYM_CODE` char(16) DEFAULT NULL COMMENT '심블코드(R)',
  `R_INDEX_MID` decimal(5,0) DEFAULT NULL COMMENT 'ETF기초지수MID(R_F34239)',
  `R_NATION_CODE` char(8) DEFAULT NULL COMMENT '휴장일(R)',
  `R_BASIC_INDEX_DATE` varchar(10) DEFAULT NULL COMMENT '전일기초지수일자',
  `R_CALC_TYPE` char(1) DEFAULT NULL COMMENT 'ETF계산유형(R_F34240)',
  `R_INDEX_TYPE` char(1) DEFAULT NULL COMMENT 'ETF기초지수유형(R_F34241)',
  `R_EX_RATE_CODE` char(5) DEFAULT NULL COMMENT '실시간환율코드',
  `DEL_CD` decimal(1,0) DEFAULT NULL COMMENT '삭제구분',
  `BBG_TICKER` varchar(40) DEFAULT NULL COMMENT '블룸버그티커',
  `RIC` varchar(40) DEFAULT NULL COMMENT '로이터코드',
  `REFIDX_MID` decimal(3,0) DEFAULT NULL COMMENT '참고지수MID',
  `REFIDX_CODE` varchar(15) DEFAULT NULL COMMENT '참고지수코드',
  `ETP_IDX_YN` char(1) DEFAULT NULL COMMENT 'ETP기초지수제공여부',
  PRIMARY KEY (`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etnfor_mast';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etnkor_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etnkor_mast` (
  `ISIN_CODE` char(12) NOT NULL COMMENT '종목코드',
  `ISU_SRT_CD` varchar(9) DEFAULT NULL COMMENT '종목단축코드',
  `ISU_KOR_ABBRV` varchar(40) DEFAULT NULL COMMENT '종목한글약명',
  `NAME_K` varchar(50) DEFAULT NULL COMMENT '한글명',
  `UPD_DATE` char(8) DEFAULT NULL COMMENT '업데이트일자',
  `SYM_CODE` char(16) DEFAULT NULL COMMENT '심블코드',
  `TABLE_NAME` varchar(40) DEFAULT NULL COMMENT '테이블명',
  `R_UP_PCMKT_ID` decimal(4,0) DEFAULT NULL COMMENT 'ETF관련업종PC시장ID(R_F18424)',
  `R_ETF_RATE` decimal(10,0) DEFAULT NULL COMMENT '해외_신종ETN배율(R_F18453)',
  `R_INDEX_MID` decimal(5,0) DEFAULT NULL COMMENT 'ETN기초지수MID(R_F34239)',
  `DEL_CD` decimal(1,0) DEFAULT NULL COMMENT '삭제구분',
  `REFIDX_MID` decimal(3,0) DEFAULT NULL COMMENT '참고지수MID',
  `REFIDX_CODE` varchar(15) DEFAULT NULL COMMENT '참고지수코드',
  `ETP_IDX_YN` char(1) DEFAULT NULL COMMENT 'ETP기초지수제공여부',
  PRIMARY KEY (`ISIN_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etnkor_mast';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etnpdf_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etnpdf_basic` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETN종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETN단축코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `F33837` decimal(4,0) DEFAULT NULL COMMENT '구성종목수',
  `F16541` varchar(80) DEFAULT NULL COMMENT '구성종목명',
  `F16311` decimal(7,2) DEFAULT NULL COMMENT '구성비',
  PRIMARY KEY (`F12506`,`F16583`,`F16012`,`F16013`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etnpdf_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etnpdf_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etnpdf_hist` (
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETN종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETN단축코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `F33837` decimal(4,0) DEFAULT NULL COMMENT '구성종목수',
  `F16541` varchar(80) DEFAULT NULL COMMENT '구성종목명',
  `F16311` decimal(7,2) DEFAULT NULL COMMENT '구성비',
  PRIMARY KEY (`F12506`,`F16583`,`F16012`,`F16013`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etnpdf_hist';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etp_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etp_basic` (
  `F12506` decimal(8,0) DEFAULT NULL COMMENT '입회일',
  `F16012` char(12) NOT NULL COMMENT '국제표준코드',
  `F16013` char(6) DEFAULT NULL COMMENT '단축코드',
  `F16002` varchar(60) DEFAULT NULL COMMENT '한글종목명',
  `F16003` varchar(60) DEFAULT NULL COMMENT '한글종목약명',
  `F16017` decimal(8,0) DEFAULT NULL COMMENT '상장일',
  `F15001` decimal(10,0) DEFAULT NULL COMMENT '현재가',
  `F15472` decimal(10,0) DEFAULT NULL COMMENT '대비',
  `F15004` decimal(5,2) DEFAULT NULL COMMENT '등락율',
  `F15006` decimal(2,0) DEFAULT NULL COMMENT '등락구분(1:상한/2:상승/3:보합/4:하한/5:하락/6:기세상한/7:기세상승/8:기세하한/9:기세하락)',
  `F15009` decimal(10,0) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,0) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,0) DEFAULT NULL COMMENT '저가',
  `F15015` decimal(16,0) DEFAULT NULL COMMENT '거래량',
  `F15023` decimal(19,0) DEFAULT NULL COMMENT '30609동일거래금액',
  `F15028` decimal(16,0) DEFAULT NULL COMMENT '시가총액',
  `F15029` decimal(10,2) DEFAULT NULL COMMENT '시가총액비중',
  `F30812` decimal(19,0) DEFAULT NULL COMMENT '유동시가총액',
  `F30813` decimal(10,2) DEFAULT NULL COMMENT '유동시가총액비중',
  `F18438` decimal(10,4) DEFAULT NULL COMMENT '적용환율',
  `F16143` decimal(19,0) DEFAULT NULL COMMENT '상장주식수',
  `F16073` char(2) DEFAULT NULL COMMENT '락구분코드',
  `F15007` decimal(10,0) DEFAULT NULL COMMENT '기준가',
  `F16493` decimal(2,0) DEFAULT NULL COMMENT 'ETP상품구분코드(1:ETF(투자회사형),2:ETF(수익증권형),3:ETN,4:손실제한형ETN)',
  `F15301` decimal(10,2) DEFAULT NULL COMMENT 'ETP지표가치(NAV/IV)',
  `F15302` decimal(5,2) DEFAULT NULL COMMENT '추적오차율',
  `F15303` decimal(10,2) DEFAULT NULL COMMENT 'ETP장중지표가치(iNAV/iIV)대비',
  `F15304` decimal(5,2) DEFAULT NULL COMMENT 'ETP괴리율',
  `F15305` decimal(5,2) DEFAULT NULL COMMENT 'ETP괴리도',
  `F30818` decimal(10,2) DEFAULT NULL COMMENT '장중지표가치(iNAV/iIV)등락율',
  `F15318` decimal(10,4) DEFAULT NULL COMMENT 'ETP기초지수현재가',
  `F16497` decimal(5,0) DEFAULT NULL COMMENT 'ETF구성종목수',
  `F31892` decimal(10,0) DEFAULT NULL COMMENT '전일현금배당금액',
  `F18450` char(4) DEFAULT NULL COMMENT '해외ETF원주자산기준통화코드',
  `F18001` decimal(16,0) DEFAULT NULL COMMENT '전일ETF순자산총액(원)',
  `F16500` decimal(16,0) DEFAULT NULL COMMENT '전일ETF순자산총액(백만)',
  `F33307` decimal(10,0) DEFAULT NULL COMMENT '주식순증감(ETN)',
  `F33308` decimal(10,0) DEFAULT NULL COMMENT '상장증권수(ETN)',
  `F33951` decimal(2,0) DEFAULT NULL COMMENT 'ETP기초지수소속시장구분코드',
  `F15319` decimal(10,4) DEFAULT NULL COMMENT 'ETP기초지수기준대비',
  `F30823` decimal(10,2) DEFAULT NULL COMMENT 'ETF관련지수등락율',
  `F15602` decimal(10,2) DEFAULT NULL COMMENT 'ETP장중지표가치(iNAV/iIV)',
  `F15631` decimal(10,4) DEFAULT NULL COMMENT 'ETP지표가치_로그수익률',
  `F15632` decimal(10,4) DEFAULT NULL COMMENT 'ETP기초지수_로그수익률',
  `F15633` decimal(10,4) DEFAULT NULL COMMENT 'ETP로그수익률차(15631-15632)',
  `F19288` decimal(10,2) DEFAULT NULL COMMENT 'ETP지표가치_장종료-확정치차(NAV/IV)',
  `F34515` decimal(19,0) DEFAULT NULL COMMENT 'ETF_1CU당금액',
  `F16499` decimal(10,0) DEFAULT NULL COMMENT 'ETF_CU구성단위',
  `F03329` decimal(10,2) DEFAULT NULL COMMENT '전일ETP지표가치(예탁원)(NAV/IV)',
  `F18439` char(4) DEFAULT NULL COMMENT '적용화폐명',
  `F16109` decimal(16,0) DEFAULT NULL COMMENT '유통주식수',
  `F16257` varchar(16) DEFAULT NULL COMMENT 'ETP기초지수코드',
  `F34777` varchar(60) DEFAULT NULL COMMENT 'ETP기초자산명',
  `F34521` decimal(3,0) DEFAULT NULL COMMENT 'ETF참고지수MID',
  `F34776` varchar(16) DEFAULT NULL COMMENT 'ETF참고지수코드',
  `F34514` char(1) DEFAULT NULL COMMENT 'ETF복제방법구분코드(P:실물복제,S:합성복제,A:Active)',
  `F34239` decimal(3,0) DEFAULT NULL COMMENT 'ETP기초지수MID',
  `F34241` char(1) DEFAULT NULL COMMENT 'ETP지표가치산출구분(K:국내,F:해외)',
  `F34769` char(1) DEFAULT NULL COMMENT 'ETP지수산출기관코드',
  `F34770` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수시장대분류',
  `F34771` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수시장중분류',
  `F34772` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수시장소분류',
  `F34775` decimal(2,0) DEFAULT NULL COMMENT 'ETP레버리지인버스구분코드',
  `F34778` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산대분류1',
  `F34779` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산중분류1',
  `F34780` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산소분류1',
  `F34781` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산대분류2',
  `F34782` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산중분류2',
  `F34783` decimal(2,0) DEFAULT NULL COMMENT 'ETP지수자산소분류2',
  `F33960` decimal(6,0) DEFAULT NULL COMMENT 'ETP운용사코드',
  `F33961` varchar(60) DEFAULT NULL COMMENT 'ETP운용사명(한글명)',
  `F33929` char(1) DEFAULT NULL COMMENT 'ETP_iNAV산출방식(0:PDF,1:지수수익율)',
  `F33267` decimal(10,0) DEFAULT NULL COMMENT 'ETP산출시간',
  `F30824` decimal(10,2) DEFAULT NULL COMMENT '해외ETP장전매매기준율(예탁원기준가환율)',
  `F18453` decimal(10,2) DEFAULT NULL COMMENT 'ETP배율',
  `F34240` char(1) DEFAULT NULL COMMENT 'ETP계산유형(H:환헷지,F:환노출,A:지수환노출,T:복합배율,K:복합배율2)',
  `F30819` decimal(10,2) DEFAULT NULL COMMENT '해외ETP매매기준율',
  `F18101` decimal(10,6) DEFAULT NULL COMMENT '예상배당수익률',
  `F34374` decimal(10,2) DEFAULT NULL COMMENT '전일ETP기초지수등락율',
  `F13510` decimal(16,0) DEFAULT NULL COMMENT '거래량60일이동평균',
  `F13516` decimal(19,0) DEFAULT NULL COMMENT '거래대금60일이동평균',
  `F33128` decimal(10,2) DEFAULT NULL COMMENT 'iNAV산출환율보정',
  `F19329` decimal(5,2) DEFAULT NULL COMMENT '전일추적오차율',
  `F19330` decimal(5,2) DEFAULT NULL COMMENT '전일ETP괴리율',
  `W00001` decimal(8,3) DEFAULT '0.000' COMMENT '종가1일수익률',
  `W00002` decimal(8,3) DEFAULT '0.000' COMMENT '종가1주수익률',
  `W00003` decimal(8,3) DEFAULT '0.000' COMMENT '종가1달수익률',
  `W00004` decimal(8,3) DEFAULT '0.000' COMMENT '종가3달수익률',
  `W00005` decimal(8,3) DEFAULT '0.000' COMMENT '종가YTD수익률',
  `W00006` decimal(8,3) DEFAULT '0.000' COMMENT '종가1년수익률',
  `W00007` decimal(8,3) DEFAULT '0.000' COMMENT '종가3년수익률',
  `W00008` decimal(8,3) DEFAULT '0.000' COMMENT '종가5년수익률',
  `W00009` decimal(8,3) DEFAULT '0.000' COMMENT '종가10년수익률',
  `W00011` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV1일수익률',
  `W00012` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV1주수익률',
  `W00013` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV1달수익률',
  `W00014` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV3달수익률',
  `W00015` decimal(8,3) DEFAULT '0.000' COMMENT 'NAVYTD수익률',
  `W00016` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV1년수익률',
  `W00017` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV3년수익률',
  `W00018` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV5년수익률',
  `W00019` decimal(8,3) DEFAULT '0.000' COMMENT 'NAV10년수익률',
  `W00021` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수1일수익률',
  `W00022` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수1주수익률',
  `W00023` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수1달수익률',
  `W00024` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수3달수익률',
  `W00025` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수YTD수익률',
  `W00026` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수1년수익률',
  `W00027` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수3년수익률',
  `W00028` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수5년수익률',
  `W00029` decimal(8,3) DEFAULT '0.000' COMMENT '기초지수10년수익률',
  `F40544` decimal(10,0) NOT NULL DEFAULT '0' COMMENT 'LP최우선매도호가',
  `F40545` decimal(10,0) NOT NULL DEFAULT '0' COMMENT 'LP최우선매수호가',
  `F33294` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'LP시장스프레드비율',
  PRIMARY KEY (`F16012`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etp_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etp_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etp_hist` (
  `F16013` char(6) NOT NULL COMMENT '단축코드',
  `F12506` decimal(10,0) NOT NULL COMMENT '입회일자',
  `F15001` decimal(10,0) DEFAULT NULL COMMENT '현재가',
  `F15472` decimal(10,0) DEFAULT NULL COMMENT '대비',
  `F15004` decimal(10,2) DEFAULT NULL COMMENT '등락율',
  `F15006` decimal(3,0) DEFAULT NULL COMMENT '등락구분코드',
  `F15009` decimal(10,0) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,0) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,0) DEFAULT NULL COMMENT '저가',
  `F15015` decimal(19,0) DEFAULT NULL COMMENT '30608동일거래량',
  `F15023` decimal(19,0) DEFAULT NULL COMMENT '30609동일거래금액',
  `F15028` decimal(19,0) DEFAULT NULL COMMENT '시가총액',
  `F15029` decimal(10,2) DEFAULT NULL COMMENT '시가총액비중',
  `F30812` decimal(19,0) DEFAULT NULL COMMENT '유동시가총액',
  `F30813` decimal(10,2) DEFAULT NULL COMMENT '유동시가총액비중',
  `F18438` decimal(10,4) DEFAULT NULL COMMENT '적용환율',
  `F16143` decimal(19,0) DEFAULT NULL COMMENT '상장주식수',
  `F16073` char(2) DEFAULT NULL COMMENT '락구분코드',
  `F15007` decimal(10,0) DEFAULT NULL COMMENT '기준가',
  `F15302` decimal(10,2) DEFAULT NULL COMMENT '추적오차율',
  `F15304` decimal(10,2) DEFAULT NULL COMMENT 'ETP괴리율',
  `F15301` decimal(10,2) DEFAULT NULL COMMENT 'ETP지표가치(NAV/IV)',
  `F15303` decimal(10,2) DEFAULT NULL COMMENT 'ETP장중지표가치(iNAV/iIV)대비',
  `F30818` decimal(10,2) DEFAULT NULL COMMENT '장중지표가치(iNAV/iIV)등락율',
  `F15305` decimal(10,2) DEFAULT NULL COMMENT 'ETF괴리율',
  `F15318` decimal(10,4) DEFAULT NULL COMMENT 'ETP기초지수현재가',
  `F16497` decimal(5,0) DEFAULT NULL COMMENT 'ETF구성종목수',
  `F31892` decimal(10,0) DEFAULT NULL COMMENT '전일현금배당금액',
  `F18450` char(4) DEFAULT NULL COMMENT '해외ETF원주자산기준통화코드',
  `F18001` decimal(10,0) DEFAULT NULL COMMENT '전일ETF순자산총액(원)',
  `F16500` decimal(10,0) DEFAULT NULL COMMENT '전일ETF순자산총액(백만)',
  `F33307` decimal(10,0) DEFAULT NULL COMMENT '주식순증감(ETN)',
  `F33308` decimal(10,0) DEFAULT NULL COMMENT '상장증권수(ETN)',
  `F33951` char(1) DEFAULT NULL COMMENT 'ETP기초지수소속시장구분코드',
  `F15319` decimal(10,4) DEFAULT NULL COMMENT 'ETF관련현재지수대비',
  `F30823` decimal(10,2) DEFAULT NULL COMMENT 'ETF관련지수등락율',
  `F15602` decimal(10,2) DEFAULT NULL COMMENT 'ETP장중지표가치(iNAV/iIV)',
  `F15631` decimal(10,4) DEFAULT NULL COMMENT 'ETP지표가치_로그수익률',
  `F15632` decimal(10,4) DEFAULT NULL COMMENT 'ETP기초지수_로그수익률',
  `F15633` decimal(10,4) DEFAULT NULL COMMENT 'ETP로그수익률차(15631-15632)',
  `F19288` decimal(10,2) DEFAULT NULL COMMENT 'ETP지표가치_장종료-확정치차(NAV/IV)',
  `F34515` decimal(19,0) DEFAULT NULL COMMENT 'ETF_1CU당금액',
  `F16499` decimal(10,0) DEFAULT NULL COMMENT 'ETF_CU구성단위',
  `F30824` decimal(10,2) DEFAULT NULL COMMENT '해외ETP장전매매기준율(예탁원기준가환율)',
  PRIMARY KEY (`F16013`,`F12506`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etp_hist';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etp_intra 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etp_intra` (
  `F16013` char(6) NOT NULL COMMENT '단축코드',
  `F20044` decimal(10,0) NOT NULL COMMENT '인트라체결일자',
  `F20004` decimal(10,0) NOT NULL COMMENT '체결인트라생성시각',
  `F20008` decimal(10,0) DEFAULT NULL COMMENT '인트라종가',
  `F40544` decimal(10,0) NOT NULL DEFAULT '0' COMMENT 'LP최우선매도호가',
  `F40545` decimal(10,0) NOT NULL DEFAULT '0' COMMENT 'LP최우선매수호가',
  `F33294` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'LP시장스프레드비율',
  `F15301` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'ETP지표가치 NAV/IV',
  `F15302` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '추적오차율',
  `F15303` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'ETP장중지표가치(iNAV/iIV)대비',
  `F30818` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '장중지표가치(iNAV/iIV)등락율',
  `F20041` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'INTRA 등락율',
  PRIMARY KEY (`F16013`,`F20044`,`F20004`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etp_intra';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_etp_sector 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_etp_sector` (
  `F12506` decimal(8,0) NOT NULL COMMENT '입회일',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `R00001` decimal(5,2) DEFAULT '0.00' COMMENT '에너지',
  `R00002` decimal(5,2) DEFAULT '0.00' COMMENT '소재',
  `R00003` decimal(5,2) DEFAULT '0.00' COMMENT '산업재',
  `R00004` decimal(5,2) DEFAULT '0.00' COMMENT '자유소비재',
  `R00005` decimal(5,2) DEFAULT '0.00' COMMENT '필수소비재',
  `R00006` decimal(5,2) DEFAULT '0.00' COMMENT '건강관리',
  `R00007` decimal(5,2) DEFAULT '0.00' COMMENT '금융',
  `R00008` decimal(5,2) DEFAULT '0.00' COMMENT '정보기술',
  `R00009` decimal(5,2) DEFAULT '0.00' COMMENT '커뮤니케이션서비스',
  `R00010` decimal(5,2) DEFAULT '0.00' COMMENT '유틸리티',
  `R00011` decimal(5,2) DEFAULT '0.00' COMMENT '부동산',
  PRIMARY KEY (`F12506`,`F16583`,`F16012`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_etp_sector';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_exch_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_exch_basic` (
  `F12506` decimal(8,0) DEFAULT NULL COMMENT '입회일',
  `F16012` char(12) NOT NULL COMMENT '표준코드',
  `F16013` char(7) DEFAULT NULL COMMENT '단축코드',
  `F15472` decimal(10,2) DEFAULT NULL COMMENT '대비',
  `F15006` decimal(2,0) DEFAULT NULL COMMENT '등락구분(1:상한/2:상승/3:보합/4:하한/5:하락/6:기세상한/7:기세상승/8:기세하한/9:기세하락)',
  `F03021` decimal(10,2) DEFAULT NULL COMMENT '전일종매도호가',
  `F19136` decimal(10,2) DEFAULT NULL COMMENT '전일대비(전일기준가기준) ',
  `F19137` decimal(10,2) DEFAULT NULL COMMENT '전일등락율(전일기준가기준)',
  `F03025` decimal(10,2) DEFAULT NULL COMMENT '전일종매수호가',
  `F03003` decimal(10,2) DEFAULT NULL COMMENT '전일종가',
  `F03007` decimal(10,1) DEFAULT NULL COMMENT '전일거래량(스프레드제외',
  `F03300` decimal(10,2) DEFAULT NULL COMMENT '전일평균가격(국채현물가(계산))',
  `F03303` decimal(10,2) DEFAULT NULL COMMENT '전일매매기준율',
  `F11504` decimal(8,0) DEFAULT NULL COMMENT '장시간',
  `F15009` decimal(10,2) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,2) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,2) DEFAULT NULL COMMENT '저가',
  `F15002` decimal(10,2) DEFAULT NULL COMMENT '전일종가대비',
  `F14501` decimal(10,2) DEFAULT NULL COMMENT '매도호가1',
  `F14531` decimal(10,2) DEFAULT NULL COMMENT '매수호가1',
  `F15001` decimal(10,2) DEFAULT NULL COMMENT '현재가',
  `F15004` decimal(10,2) DEFAULT NULL COMMENT '등락율',
  `F16492` char(8) DEFAULT NULL COMMENT '중계사명_국내외환',
  `F30523` decimal(10,2) DEFAULT NULL COMMENT '최종매매기준율',
  `F15007` decimal(10,2) DEFAULT NULL COMMENT '기준가',
  `F30555` decimal(10,2) DEFAULT NULL COMMENT '외환현재가(전일종가/현재가/시간가치처리)',
  `F16169` char(1) DEFAULT NULL COMMENT '최근월물구분(Y:최근월물/N:else)',
  `F16002` char(16) DEFAULT NULL COMMENT '한글종목명',
  `F16003` char(16) DEFAULT NULL COMMENT '한글종목약명',
  `F14763` decimal(10,2) DEFAULT NULL COMMENT '중간호가',
  PRIMARY KEY (`F16012`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_exch_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_future_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_future_basic` (
  `F12506` decimal(8,0) DEFAULT NULL COMMENT '입회일',
  `F16013` char(8) DEFAULT NULL COMMENT '단축코드',
  `F16012` char(12) NOT NULL COMMENT '국제표준코드',
  `F16002` char(32) DEFAULT NULL COMMENT '한글종목명',
  `F16004` char(32) DEFAULT NULL COMMENT '영문종목명',
  `F15007` decimal(10,2) DEFAULT NULL COMMENT '기준가',
  `F03003` decimal(10,2) DEFAULT NULL COMMENT '전일종가',
  `F15001` decimal(10,2) DEFAULT NULL COMMENT '현재가',
  `F15006` decimal(2,0) DEFAULT NULL COMMENT '등락구분(1:상한/2:상승/3:보합/4:하한/5:하락/6:기세상한/7:기세상승/8:기세하한/9:기세하락',
  `F15003` decimal(10,2) DEFAULT NULL COMMENT '기준가대비',
  `F15009` decimal(10,2) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,2) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,2) DEFAULT NULL COMMENT '저가',
  `F15015` decimal(10,0) DEFAULT NULL COMMENT '거래량(30608과동일)',
  `F15023` decimal(16,0) DEFAULT NULL COMMENT '거래대금(30609과동일)',
  `F15101` decimal(10,0) DEFAULT NULL COMMENT '미결제약정수량',
  `F15005` decimal(10,2) DEFAULT NULL COMMENT '기준가등락율',
  `F15472` decimal(10,2) DEFAULT NULL COMMENT '대비',
  `F15002` decimal(10,2) DEFAULT NULL COMMENT '전일종가등락율',
  `F16169` char(1) DEFAULT NULL COMMENT '최근월물구분(Y:최근월물/N:else)',
  `F16189` decimal(10,0) DEFAULT NULL COMMENT '만기년월',
  `F33904` decimal(10,0) DEFAULT NULL COMMENT '거래승수',
  `F16198` decimal(2,0) DEFAULT NULL COMMENT '옵션종류(2:CALL,3:PUT)',
  `F16190` decimal(16,0) DEFAULT NULL COMMENT '행사가격',
  `market_id` char(4) NOT NULL COMMENT '시장 ID',
  PRIMARY KEY (`F16012`,`market_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_future_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_index_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_index_basic` (
  `F12506` decimal(8,0) DEFAULT NULL COMMENT '입회일',
  `F16013` varchar(16) NOT NULL COMMENT '단축코드',
  `F16002` varchar(60) DEFAULT NULL COMMENT '한글종목명',
  `F15009` decimal(10,2) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,2) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,2) DEFAULT NULL COMMENT '저가',
  `F15001` decimal(10,2) DEFAULT NULL COMMENT '현재가',
  `F15007` decimal(10,2) DEFAULT NULL COMMENT '기준가',
  `F15015` decimal(16,0) DEFAULT NULL COMMENT '거래량',
  `F15023` decimal(16,0) DEFAULT NULL COMMENT '거래대금',
  `F15472` decimal(10,2) DEFAULT NULL COMMENT '대비',
  `F15004` decimal(5,2) DEFAULT NULL COMMENT '등락율',
  `F15006` decimal(2,0) DEFAULT NULL COMMENT '등락구분(1:상한/2:상승/3:보합/4:하한/5:하락/6:기세상한/7:기세상승/8:기세하한/9:기세하락)',
  `F15028` decimal(16,0) DEFAULT NULL COMMENT '시가총액',
  `large_type` varchar(16) DEFAULT NULL COMMENT '지수대분류(FNGUIDE, KRX, KIS, KAP)',
  `middle_type` varchar(16) DEFAULT NULL COMMENT '지수중분류(FNGUIDE, WISEFN)',
  `market_id` char(4) NOT NULL COMMENT '시장 ID',
  `std_index` decimal(10,2) DEFAULT '100.00' COMMENT '기준지수',
  `std_date` decimal(8,0) DEFAULT '20000101' COMMENT '기준일',
  `anno_date` decimal(8,0) DEFAULT '20000101' COMMENT '발표일',
  `index_cal_method` varchar(60) DEFAULT '시가총액방식' COMMENT '지수산출방식',
  `std_capital` decimal(16,0) DEFAULT '0' COMMENT '기준시가총액',
  `fixed_cash` decimal(16,0) DEFAULT '0' COMMENT '고정현금',
  `flowrate_yn` char(1) DEFAULT 'Y' COMMENT '유동비율적용여부',
  `index_comment` varchar(1024) DEFAULT NULL COMMENT '지수설명',
  PRIMARY KEY (`F16013`,`market_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_index_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_index_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_index_hist` (
  `F16013` varchar(16) NOT NULL COMMENT '단축코드',
  `F12506` decimal(8,0) NOT NULL COMMENT '입회일자',
  `F15009` decimal(10,2) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,2) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,2) DEFAULT NULL COMMENT '저가',
  `F15001` decimal(10,2) DEFAULT NULL COMMENT '현재가',
  `F15472` decimal(10,2) DEFAULT NULL COMMENT '대비',
  `F15006` decimal(3,0) DEFAULT NULL COMMENT '등락구분코드',
  `F15004` decimal(10,2) DEFAULT NULL COMMENT '등락율',
  `F15015` decimal(16,0) DEFAULT NULL COMMENT '30608동일거래량',
  `F15023` decimal(16,0) DEFAULT NULL COMMENT '30609동일거래금액',
  `market_id` char(4) NOT NULL COMMENT '시장 ID',
  PRIMARY KEY (`F16013`,`F12506`,`market_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_index_hist';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_index_intra 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_index_intra` (
  `F16013` varchar(16) NOT NULL COMMENT '단축코드',
  `F20044` decimal(10,0) NOT NULL COMMENT '인트라체결일자',
  `F20004` decimal(10,0) NOT NULL COMMENT '체결인트라생성시각',
  `F20008` decimal(10,2) DEFAULT NULL COMMENT '인트라현재가',
  `market_id` char(4) NOT NULL COMMENT '시장 ID',
  PRIMARY KEY (`F16013`,`F20044`,`F20004`,`market_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_index_intra';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_kspjong_basic 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_kspjong_basic` (
  `F12506` decimal(8,0) DEFAULT NULL COMMENT '입회일',
  `F16012` char(12) NOT NULL COMMENT '국제표준코드',
  `F16013` char(6) DEFAULT NULL COMMENT '단축코드',
  `F16002` varchar(60) DEFAULT NULL COMMENT '한글종목명',
  `F15007` decimal(10,0) DEFAULT NULL COMMENT '기준가',
  `F15006` decimal(2,0) DEFAULT NULL COMMENT '등락구분(1:상한/2:상승/3:보합/4:하한/5:하락/6:기세상한/7:기세상승/8:기세하한/9:기세하락)',
  `F15001` decimal(10,0) DEFAULT NULL COMMENT '현재가',
  `F15003` decimal(10,0) DEFAULT NULL COMMENT '기준가대비',
  `F15004` decimal(5,2) DEFAULT NULL COMMENT '등락율',
  `F15009` decimal(10,0) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,0) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,0) DEFAULT NULL COMMENT '저가',
  `F15015` decimal(16,0) DEFAULT NULL COMMENT '거래량',
  `F15028` decimal(16,0) DEFAULT NULL COMMENT '시가총액',
  `F16017` decimal(8,0) DEFAULT NULL COMMENT '상장일',
  `F16109` decimal(16,0) DEFAULT NULL COMMENT '유통주식수',
  `market_id` char(4) NOT NULL COMMENT '시장 ID',
  PRIMARY KEY (`F16012`,`market_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_kspjong_basic';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.td_kspjong_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `td_kspjong_hist` (
  `F16013` char(6) NOT NULL COMMENT '단축코드',
  `F12506` decimal(10,0) NOT NULL COMMENT '입회일자',
  `F15001` decimal(10,0) DEFAULT NULL COMMENT '현재가',
  `F30700` decimal(10,0) DEFAULT NULL COMMENT '가중수정주가현재가',
  `F15472` decimal(10,0) DEFAULT NULL COMMENT '대비',
  `F15004` decimal(10,2) DEFAULT NULL COMMENT '등락율',
  `F15006` decimal(3,0) DEFAULT NULL COMMENT '등락구분코드',
  `F15009` decimal(10,0) DEFAULT NULL COMMENT '시가',
  `F15010` decimal(10,0) DEFAULT NULL COMMENT '고가',
  `F15011` decimal(10,0) DEFAULT NULL COMMENT '저가',
  `F15015` decimal(19,0) DEFAULT NULL COMMENT '30608동일거래량',
  `F15023` decimal(19,0) DEFAULT NULL COMMENT '30609동일거래금액',
  `F15028` decimal(19,0) DEFAULT NULL COMMENT '시가총액',
  `F15029` decimal(10,2) DEFAULT NULL COMMENT '시가총액비중',
  `F30812` decimal(19,0) DEFAULT NULL COMMENT '유동시가총액',
  `F30813` decimal(10,2) DEFAULT NULL COMMENT '유동시가총액비중',
  `F18438` decimal(10,4) DEFAULT NULL COMMENT '적용환율',
  `F16143` decimal(19,0) DEFAULT NULL COMMENT '상장주식수',
  `F16073` char(2) DEFAULT NULL COMMENT '락구분코드',
  `F15007` decimal(10,0) DEFAULT NULL COMMENT '기준가',
  PRIMARY KEY (`F16013`,`F12506`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='td_kspjong_hist';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_admin 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_admin` (
  `user_id` varchar(40) NOT NULL COMMENT 'ID',
  `password` varchar(40) NOT NULL COMMENT '패스워드',
  `user_level` varchar(10) NOT NULL COMMENT 'NORMAL/SUPER',
  `user_name` varchar(40) NOT NULL COMMENT '사용자명',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 일자',
  `login_date` datetime DEFAULT NULL COMMENT '로그인 일자',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_admin';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_code_dtl 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_code_dtl` (
  `com_mst_cd` varchar(6) NOT NULL COMMENT '마스터 코드',
  `com_dtl_cd` varchar(6) NOT NULL COMMENT '상세 코드',
  `com_dtl_name` varchar(40) NOT NULL COMMENT '상세 코드명',
  `com_val01` varchar(10) DEFAULT NULL COMMENT '여분 val01',
  `com_val02` varchar(10) DEFAULT NULL COMMENT '여분 val02',
  `com_val03` varchar(10) DEFAULT NULL COMMENT '여분 val03',
  `use_yn` char(1) NOT NULL COMMENT '사용여부(0-사용안함, 1-사용)',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`com_mst_cd`,`com_dtl_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통코드 상세';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_code_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_code_mast` (
  `com_mst_cd` varchar(6) NOT NULL COMMENT '마스터 코드',
  `com_mst_name` varchar(40) NOT NULL COMMENT '마스터 코드명',
  `use_yn` char(1) NOT NULL COMMENT '사용여부(0-사용안함, 1-사용)',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`com_mst_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공통코드 마스터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_cust_support 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_cust_support` (
  `cs_no` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '지원번호',
  `email` varchar(40) DEFAULT NULL COMMENT '이메일',
  `type_cd` char(4) DEFAULT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) DEFAULT NULL COMMENT '기관구분코드',
  `subject` varchar(200) DEFAULT NULL COMMENT '제목',
  `contents` text COMMENT '내용',
  `reg_id` varchar(20) DEFAULT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`cs_no`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COMMENT='고객지원';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_date_manage 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_date_manage` (
  `GUBUN` decimal(2,0) NOT NULL COMMENT '영업일구분',
  `F12506` decimal(8,0) NOT NULL COMMENT '영업일',
  `DAY_TYPE` decimal(1,0) DEFAULT NULL COMMENT '요일(1:일요일, 2:월요일..)',
  PRIMARY KEY (`GUBUN`,`F12506`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_date_manage';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_etpctg_code 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_etpctg_code` (
  `ctg_large_code` char(3) NOT NULL COMMENT 'ETP대분류코드',
  `ctg_code` char(3) NOT NULL COMMENT 'ETP분류코드',
  `ctg_name` varchar(80) NOT NULL COMMENT '분류이름',
  PRIMARY KEY (`ctg_large_code`,`ctg_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_etpctg_code';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_etpctg_large_code 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_etpctg_large_code` (
  `ctg_large_code` char(3) NOT NULL COMMENT 'ETP대분류코드',
  `ctg_large_name` varchar(80) NOT NULL COMMENT '분류이름',
  PRIMARY KEY (`ctg_large_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_etpctg_large_code';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_etpctg_map 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_etpctg_map` (
  `ctg_large_code` char(3) NOT NULL COMMENT 'ETP대분류코드',
  `ctg_code` char(3) NOT NULL COMMENT 'ETP분류코드',
  `F16012` char(12) NOT NULL COMMENT '종목코드',
  PRIMARY KEY (`ctg_large_code`,`ctg_code`,`F16012`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_etpctg_map';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_favor_item 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_favor_item` (
  `item_seq` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '종목 시퀀스',
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `gubun` char(1) NOT NULL COMMENT '구분 : 1, ETP, 2. INDEX',
  `F16012` varchar(12) DEFAULT NULL COMMENT '국제표준코드',
  `F16013` varchar(12) DEFAULT NULL COMMENT '단축코드',
  `market_id` char(4) DEFAULT NULL COMMENT '시장아이디',
  `large_type` varchar(16) DEFAULT NULL COMMENT '지수대분류(FNGUIDE, KRX, KIS, KAP)',
  `middle_type` varchar(16) DEFAULT NULL COMMENT '지수중분류(FNGUIDE, WISEFN)',
  PRIMARY KEY (`item_seq`,`type_cd`,`inst_cd`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1246 DEFAULT CHARSET=utf8 COMMENT='tm_favor_item';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_file 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_file` (
  `file_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '파일ID',
  `org_file_name` varchar(100) NOT NULL COMMENT '원본 파일명',
  `save_file_name` varchar(100) NOT NULL COMMENT '노출할 파일명',
  `file_size` int(11) NOT NULL COMMENT '파일 사이즈',
  `mime_type` varchar(100) NOT NULL COMMENT 'mime_type',
  `gubun` varchar(10) NOT NULL COMMENT '구분( COM002 : 지수방법론, 소급지수 )',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=439 DEFAULT CHARSET=utf8 COMMENT='지수 파일정보';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_mast` (
  `jisu_seq` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '지수 시퀀스',
  `jisu_id` varchar(20) NOT NULL COMMENT '지수 ID',
  `jisu_kor_nm` varchar(100) NOT NULL COMMENT '지수 한글명',
  `jisu_eng_nm` varchar(100) NOT NULL COMMENT '지수 영문명',
  `jisu_summary` varchar(4000) NOT NULL COMMENT '지수 개요',
  `base_jisu` decimal(15,3) NOT NULL COMMENT '기준 지수',
  `base_date` varchar(8) NOT NULL COMMENT '기준일',
  `method_file_id` bigint(20) DEFAULT NULL COMMENT '파일ID (지수 방법론)',
  `jisu_file_id` bigint(20) DEFAULT NULL COMMENT '파일ID (소급지수)',
  `req_content` varchar(4000) DEFAULT NULL COMMENT '요청사항',
  `status` varchar(6) NOT NULL COMMENT '상태 ( COM001 : 01=등록완료, 02=연동신청, 03=연동완료 )',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) NOT NULL COMMENT '수정자 ID',
  `upd_time` datetime NOT NULL COMMENT '수정시간',
  PRIMARY KEY (`jisu_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COMMENT='지수 마스터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_share_req 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_share_req` (
  `jisu_seq` bigint(20) NOT NULL COMMENT '지수 시퀀스',
  `inst_cd` char(5) CHARACTER SET latin1 NOT NULL COMMENT '기관코드',
  `jisu_id` varchar(20) NOT NULL COMMENT '지수 ID',
  `req_flag` char(1) CHARACTER SET latin1 DEFAULT NULL COMMENT '공개여부, 0:비공개, 1:공개요청, 2: 공개',
  `reg_id` varchar(20) CHARACTER SET latin1 DEFAULT NULL COMMENT '등록자ID',
  `reg_time` datetime DEFAULT NULL COMMENT '등록시간',
  `upd_id` varchar(20) CHARACTER SET latin1 DEFAULT NULL COMMENT '수정자 ID',
  `upd_time` datetime DEFAULT NULL COMMENT '수정시간',
  PRIMARY KEY (`jisu_seq`,`inst_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='지수정보공개요청';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_temp_upload 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_temp_upload` (
  `file_id` bigint(20) NOT NULL COMMENT '파일ID',
  `row_no` int(11) NOT NULL COMMENT '행번호',
  `col01` varchar(100) DEFAULT NULL COMMENT '컬럼01',
  `col02` varchar(100) DEFAULT NULL COMMENT '컬럼02',
  `col03` varchar(100) DEFAULT NULL COMMENT '컬럼03',
  `col04` varchar(100) DEFAULT NULL COMMENT '컬럼04',
  `col05` varchar(100) DEFAULT NULL COMMENT '컬럼05',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`file_id`,`row_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='지수 저장전 업로드';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_upload 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_upload` (
  `jisu_seq` bigint(20) NOT NULL COMMENT '지수 시퀀스',
  `row_no` int(10) NOT NULL COMMENT '행번호',
  `jisu_file_id` bigint(20) DEFAULT NULL COMMENT '파일 ID (소급지수)',
  `col01` varchar(100) DEFAULT NULL COMMENT '컬럼01',
  `col02` varchar(100) DEFAULT NULL COMMENT '컬럼02',
  `col03` varchar(100) DEFAULT NULL COMMENT '컬럼03',
  `col04` varchar(100) DEFAULT NULL COMMENT '컬럼04',
  `col05` varchar(100) DEFAULT NULL COMMENT '컬럼05',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`jisu_seq`,`row_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='지수 엑셀업로드';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_jisu_upload_hist 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_jisu_upload_hist` (
  `hist_no` bigint(20) NOT NULL COMMENT '지수ID 별 이력번호',
  `jisu_seq` bigint(20) NOT NULL COMMENT '지수 시퀀스',
  `row_no` int(10) NOT NULL COMMENT '행번호',
  `jisu_file_id` bigint(20) NOT NULL COMMENT '파일 ID (소급지수)',
  `col01` varchar(100) DEFAULT NULL COMMENT '컬럼01',
  `col02` varchar(100) DEFAULT NULL COMMENT '컬럼02',
  `col03` varchar(100) DEFAULT NULL COMMENT '컬럼03',
  `col04` varchar(100) DEFAULT NULL COMMENT '컬럼04',
  `col05` varchar(100) DEFAULT NULL COMMENT '컬럼05',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`hist_no`,`jisu_seq`,`row_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='지수 엑셀업로드 이력';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_pdf_modify_dtl 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_pdf_modify_dtl` (
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `group_no` bigint(20) NOT NULL COMMENT '사용자별 처리한 그룹번호',
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `status` varchar(10) DEFAULT NULL COMMENT 'insert( 신규 ), modify( 변경 )',
  `F16499` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수',
  `F16499_PREV` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수 (변경전)',
  `F34840` decimal(18,2) DEFAULT NULL COMMENT '액면금액',
  `F34840_PREV` decimal(18,2) DEFAULT NULL COMMENT '액면금액 ( 변경전 )',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) NOT NULL COMMENT '수정자 ID',
  `upd_time` datetime NOT NULL COMMENT '수정시간',
  PRIMARY KEY (`email`,`F12506`,`F16583`,`F16012`,`F16013`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PDF 변경 상세 정보 (구성종목)';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_pdf_modify_hist_dtl 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_pdf_modify_hist_dtl` (
  `hist_no` bigint(20) NOT NULL COMMENT '이력번호',
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `group_no` bigint(20) NOT NULL COMMENT '사용자별 처리한 그룹번호',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `status` varchar(10) DEFAULT NULL COMMENT 'insert( 신규 ), modify( 변경 )',
  `F16499` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수',
  `F16499_PREV` decimal(18,2) DEFAULT NULL COMMENT '1CU단위증권수 (변경전)',
  `F34840` decimal(18,2) DEFAULT NULL COMMENT '액면금액',
  `F34840_PREV` decimal(18,2) DEFAULT NULL COMMENT '액면금액 ( 변경전 )',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`hist_no`,`email`,`F12506`,`F16583`,`F16012`,`F16013`,`group_no`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PDF 변경 이력 상세';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_pdf_modify_hist_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_pdf_modify_hist_mast` (
  `hist_no` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '이력번호',
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `group_no` bigint(20) NOT NULL COMMENT '사용자별 처리한 그룹번호',
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`hist_no`,`email`,`F12506`,`F16583`,`F16012`,`F16013`,`group_no`),
  KEY `idx_tm_pdf_modify_hist_mast_01` (`reg_time`,`email`),
  KEY `idx_tm_pdf_modify_hist_mast_02` (`reg_time`,`inst_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8 COMMENT='PDF 변경 이력 마스터';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_pdf_modify_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_pdf_modify_mast` (
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `F12506` decimal(8,0) NOT NULL COMMENT '일자',
  `F16583` decimal(4,0) NOT NULL COMMENT '사무수탁회사번호',
  `F16012` char(12) NOT NULL COMMENT 'ETF종목코드',
  `F16013` char(6) NOT NULL COMMENT 'ETF단축코드',
  `group_no` bigint(20) NOT NULL COMMENT '사용자별 처리한 그룹번호',
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `reg_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) NOT NULL COMMENT '등록자 ID',
  `upd_time` datetime NOT NULL COMMENT '등록시간',
  PRIMARY KEY (`email`,`F12506`,`F16583`,`F16012`,`F16013`),
  KEY `idx_tm_pdf_modify_mast_01` (`reg_time`,`inst_cd`),
  KEY `idx_tm_pdf_modify_mast_02` (`upd_time`,`inst_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PDF 변경 마스터 정보';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_simul_mast 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_simul_mast` (
  `grp_cd` varchar(10) NOT NULL COMMENT '그룹코드(상위코드)',
  `scen_cd` varchar(10) NOT NULL COMMENT '시나리오 코드',
  `scen_depth` char(1) NOT NULL COMMENT '시나리오 DEPTH',
  `scen_order_no` int(4) NOT NULL COMMENT '시나리오 정렬 순번',
  `scen_name` varchar(50) NOT NULL COMMENT '시나리오명',
  `grp_yn` char(1) NOT NULL DEFAULT '1' COMMENT '그룹여부(1-그룹)',
  `start_year` varchar(4) DEFAULT NULL COMMENT '시작년도',
  `rebalance_cycle_cd` varchar(6) DEFAULT NULL COMMENT '리밸런싱주기 (COM006)',
  `rebalance_date_cd` varchar(6) DEFAULT NULL COMMENT '리밸런싱일자 (COM007)',
  `init_invest_money` decimal(18,2) DEFAULT NULL COMMENT '초기투자금액',
  `bench_mark_cd` varchar(6) DEFAULT NULL COMMENT '벤치마크 (COM008)',
  `importance_method_cd` varchar(6) DEFAULT NULL COMMENT '비중설정방식 (COM009)',
  `reg_id` varchar(20) DEFAULT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) DEFAULT NULL COMMENT '수정자 ID',
  `upd_time` datetime NOT NULL COMMENT '수정시간',
  PRIMARY KEY (`grp_cd`,`scen_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='시뮬레이션 기본등록';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_simul_portfolio 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_simul_portfolio` (
  `grp_cd` varchar(10) NOT NULL COMMENT '그룹코드(상위코드)',
  `scen_cd` varchar(10) NOT NULL COMMENT '시나리오코드',
  `F16316` char(12) NOT NULL COMMENT '구성종목코드',
  `order_no` int(4) NOT NULL COMMENT '정렬 순번',
  `importance` decimal(7,2) DEFAULT NULL COMMENT '비중',
  `jisu_rate` decimal(7,2) DEFAULT NULL COMMENT '지수적용비율',
  `reg_id` varchar(20) DEFAULT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) DEFAULT NULL COMMENT '수정자 ID',
  `upd_time` datetime NOT NULL COMMENT '수정시간',
  PRIMARY KEY (`grp_cd`,`scen_cd`,`F16316`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='시뮬레이션 포트폴리오';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_simul_result 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_simul_result` (
  `grp_cd` varchar(10) NOT NULL COMMENT '그룹코드(상위코드)',
  `scen_cd` varchar(10) NOT NULL COMMENT '시나리오코드',
  `F12506` decimal(10,0) NOT NULL COMMENT '입회일자',
  `F16013` char(6) NOT NULL COMMENT '단축 코드(현금은 KRW로 처리)',
  `rebalancing` varchar(6) NOT NULL COMMENT '리밸런싱 여부(Y,N)-COM010',
  `F15007` decimal(10,0) NOT NULL COMMENT '기준가',
  `F30700` decimal(10,0) NOT NULL COMMENT '종가',
  `F16143` decimal(19,0) NOT NULL COMMENT '상장주식수',
  `BEFORE_RATE` decimal(20,10) NOT NULL COMMENT '(직전)지수적용비율',
  `TODAY_RATE` decimal(20,10) NOT NULL COMMENT '(당일)지수적용비율',
  `F15028_S` decimal(19,0) NOT NULL COMMENT '기준시총',
  `F15028_C` decimal(19,0) NOT NULL COMMENT '비교시총',
  `INDEX_RATE` decimal(20,10) NOT NULL COMMENT '지수',
  `RETURN_VAL` decimal(20,10) NOT NULL COMMENT '결과',
  `EVENT_FLAG` char(6) DEFAULT NULL COMMENT '이벤트(비중조절, 종목편입)-COM011',
  `reg_id` varchar(20) DEFAULT NULL COMMENT '등록자 ID',
  `reg_time` datetime NOT NULL COMMENT '등록시간',
  `upd_id` varchar(20) DEFAULT NULL COMMENT '수정자 ID',
  `upd_time` datetime NOT NULL COMMENT '수정시간',
  PRIMARY KEY (`grp_cd`,`scen_cd`,`F12506`,`F16013`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='시뮬레이션 결과';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_user_domain 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_user_domain` (
  `type_cd` char(4) NOT NULL COMMENT '사용자 타입코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `inst_name` varchar(40) NOT NULL COMMENT '기관명',
  `domain_url` varchar(40) DEFAULT NULL COMMENT '도메인명',
  `krx_cd` decimal(6,0) DEFAULT NULL COMMENT '거래소ETP발행사코드',
  `large_type` varchar(16) DEFAULT NULL COMMENT '지수대분류(FNGUIDE, KRX, KIS, KAP)',
  PRIMARY KEY (`type_cd`,`inst_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_user_domain';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_user_member 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_user_member` (
  `type_cd` char(4) NOT NULL COMMENT '사용자 그룹 코드',
  `inst_cd` char(5) NOT NULL COMMENT '기관구분코드',
  `email` varchar(40) NOT NULL COMMENT '이메일',
  `name` varchar(40) NOT NULL COMMENT '이름',
  `password` varchar(20) NOT NULL COMMENT '비밀번호',
  `hp_no` varchar(20) DEFAULT NULL COMMENT '핸드폰 번호',
  `tel_no` varchar(20) DEFAULT NULL COMMENT '사무실 전화번호',
  `emailchk` char(1) DEFAULT 'N' COMMENT '이메일 인증여부',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `login_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `position` varchar(20) DEFAULT NULL,
  `team` varchar(40) DEFAULT NULL,
  `check_use` char(1) DEFAULT NULL COMMENT '체크사용유무',
  PRIMARY KEY (`type_cd`,`inst_cd`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_user_member';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 kc_etp.tm_user_type 구조 내보내기
CREATE TABLE IF NOT EXISTS `tm_user_type` (
  `type_cd` char(4) NOT NULL COMMENT '타입코드',
  `type_name` varchar(40) NOT NULL COMMENT '타입명',
  PRIMARY KEY (`type_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tm_user_type';

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
