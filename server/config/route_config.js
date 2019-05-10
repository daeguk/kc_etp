/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

module.exports = {
    route_info: [
        // 신규 개발
        // 사용자 로그인처리(threeon. 2019.04.19)
        { file: './user/member/users', path: '/user/member/getmembertypelist', method: 'getMemberTypeList', session: 'uncheck', type: 'get' },
        { file: './user/member/users', path: '/user/member/getmemberdomainlist', method: 'getMemberDomainList', session: 'uncheck', type: 'get' },
        { file: './user/member/users', path: '/user/member/userlogincheck', method: 'userLoginCheck', session: 'check', type: 'post' },
        { file: './user/member/users', path: '/user/member/usernewaccount', method: 'userNewAccount', session: 'check', type: 'post' },
        { file: './user/member/users', path: '/user/member/userfindpwd', method: 'userFindPwd', session: 'check', type: 'post' },
        { file: './user/member/users', path: '/user/member/userupdateinfo', method: 'userUpdateInfo', session: 'check', type: 'post' },

        //일반 ETP register
        { file: './user/etp/etpApplyList', path: '/user/etp/getEtpApplyList', method: 'getEtpApplyList', session: 'uncheck', type: 'get' },
        { file: './user/etp/etpApplyList', path: '/user/etp/getEtpApplyDistCnt', method: 'getEtpApplyDistCnt', session: 'uncheck', type: 'get' },
        { file: './user/etp/etpApplyList', path: '/user/etp/getEtpApplyIndexCnt', method: 'getEtpApplyIndexCnt', session: 'uncheck', type: 'get' },
        { file: './user/etp/etpApplyList', path: '/user/etp/getEtpApplyCodeCnt', method: 'getEtpApplyCodeCnt', session: 'uncheck', type: 'get' },
        { file: './user/etp/etpApplyList', path: '/user/etp/getEtpApplyInavCnt', method: 'getEtpApplyInavCnt', session: 'uncheck', type: 'get' },
        
        { file: './user/etp/etpregister', path: '/user/etp/getEtpRegisterView', method: 'getEtpRegisterView', session: 'check', type: 'get' },
        { file: './user/etp/etpregister', path: '/user/etp/insertEtpRegister', method: 'insertEtpRegister', session: 'check', type: 'post' },
        { file: './user/etp/etpregister', path: '/user/etp/updateEtpRegister', method: 'updateEtpRegister', session: 'check', type: 'post' },
        
        { file: './user/etp/etpDetail'      , path: '/user/etp/getEtpBasic'         , method: 'getEtpBasic'         , session: 'check', type: 'post' },
        { file: './user/etp/etpDetail'      , path: '/user/etp/getEtpInfo'          , method: 'getEtpInfo'          , session: 'check', type: 'post' },
        { file: './user/etp/etpDetail'      , path: '/user/etp/getEtpChartData'     , method: 'getEtpChartData'     , session: 'check', type: 'post' },
        { file: './user/etp/etpDetail'      , path: '/user/etp/getEtpPerformance'   , method: 'getEtpPerformance'   , session: 'check', type: 'post' },
        { file: './user/etp/etpDetail'      , path: '/user/etp/getExistEtpBasicCnt' , method: 'getExistEtpBasicCnt' , session: 'check', type: 'post' },

        { file: './user/etp/etpOper'        , path: '/user/etp/getEtpOperInfo'          , method: 'getEtpOperInfo'          , session: 'check', type: 'post' },
        { file: './user/etp/etpOper'        , path: '/user/etp/getEtpOperIndex'         , method: 'getEtpOperIndex'         , session: 'check', type: 'post' },
        { file: './user/etp/etpOper'        , path: '/user/etp/geEtpOperIndexOversea'   , method: 'geEtpOperIndexOversea'   , session: 'check', type: 'post' },
        { file: './user/etp/etpOper'        , path: '/user/etp/geEtpOperIndexError'     , method: 'geEtpOperIndexError'     , session: 'check', type: 'post' },
        { file: './user/etp/etpOper'        , path: '/user/etp/getEtpOperPdf'           , method: 'getEtpOperPdf'           , session: 'check', type: 'post' },

        //일반 INDEX register

        // 지수 요약 정보
        { file: './user/index/indexSummary', path: '/user/index/getIndexSummaryInfo', method: 'getIndexSummaryInfo', session: 'check', type: 'post' },   
        { file: './user/index/indexSummary', path: '/user/index/getinfoopenreqlist', method: 'getInfoOpenReqList', session: 'check', type: 'get' },   
        { file: './user/index/indexSummary', path: '/user/index/getindexsummaryhist', method: 'getIndexSummaryHist', session: 'check', type: 'get' },
        { file: './user/index/indexSummary', path: '/user/index/updateIndexOpenYn', method: 'updateIndexOpenYn', session: 'check', type: 'post' },
        { file: './user/index/indexSummary', path: '/user/index/getInfoIndexList', method: 'getInfoIndexList', session: 'check', type: 'get' },   
        { file: './user/index/indexSummary', path: '/user/index/getIndexBaseInfo', method: 'getIndexBaseInfo', session: 'check', type: 'get' },   
        { file: './user/index/indexSummary', path: '/user/index/getIndexEtpHistoryData', method: 'getIndexEtpHistoryData', session: 'check', type: 'get' },   
        { file: './user/index/indexSummary', path: '/user/index/getIndexInEtpInfo', method: 'getIndexInEtpInfo', session: 'check', type: 'get' },   
        { file: './user/index/indexSummary', path: '/user/index/getindexSubscribeList', method: 'getindexSubscribeList', session: 'check', type: 'get' },           
        { file: './user/index/indexSummary', path: '/user/index/getIndexImportanceList', method: 'getIndexImportanceList', session: 'check', type: 'get' },
        { file: './user/index/indexSummary', path: '/user/index/getIndexAnalysisInfo', method: 'getIndexAnalysisInfo', session: 'check', type: 'get' },
        { file: './user/index/indexSummary', path: '/user/index/getIndexAnalysisData', method: 'getIndexAnalysisData', session: 'check', type: 'get' },
        { file: './user/index/indexSummary', path: '/user/index/getShareReqCnt', method: 'getShareReqCnt', session: 'check', type: 'get' },
        { file: './user/index/indexSummary', path: '/user/index/getIndexRegStateCnt', method: 'getIndexRegStateCnt', session: 'check', type: 'get' },
        


        { file: './user/index/indexDetail', path: '/user/index/getIndexJongmokList', method: 'getIndexJongmokList', session: 'check', type: 'post' },
        { file: './user/index/indexDetail', path: '/user/index/getIndexList', method: 'getIndexList', session: 'check', type: 'post' },
        { file: './user/index/indexDetail', path: '/user/index/getIndexDetailList', method: 'getIndexDetailList', session: 'check', type: 'post' },
        { file: './user/index/indexDetail', path: '/user/index/getIndexFixList', method: 'getIndexFixList', session: 'check', type: 'post' },
        
        
        

        { file: './user/index/indexmanage', path: '/user/index/getIndexVueTableTestList', method: 'getIndexVueTableTestList', session: 'uncheck', type: 'get' },
        { file: './user/index/indexmanage', path: '/user/index/getIndexToastGridTestList', method: 'getIndexToastGridTestList', session: 'uncheck', type: 'get' },
        
        { file: './user/index/indexRegister', path: '/user/index/getJisuDuplCheck', method: 'getJisuDuplCheck', session: 'check', type: 'post' },
        { file: './user/index/indexRegister', path: '/user/index/getDomainInst', method: 'getDomainInst', session: 'check', type: 'post' },
        { file: './user/index/indexRegister', path: '/user/index/fileuploadSingle', method: 'fileuploadSingle', session: 'check', type: 'post' },
        { file: './user/index/indexRegister', path: '/user/index/registerJisu', method: 'registerJisu', session: 'check', type: 'post' },

        { file: './user/index/indexSelectList', path: '/user/index/getStatusList', method: 'getStatusList', session: 'check', type: 'post' },
        { file: './user/index/indexSelectList', path: '/user/index/getIndexSelectList', method: 'getIndexSelectList', session: 'check', type: 'post' },

        { file: './user/index/indexModify', path: '/user/index/getRegistedJisuData', method: 'getRegistedJisuData', session: 'check', type: 'post' },
        { file: './user/index/indexModify', path: '/user/index/modifyJisu', method: 'modifyJisu', session: 'check', type: 'post' },
        { file: './user/index/indexModify', path: '/user/index/deleteJisu', method: 'deleteJisu', session: 'check', type: 'post' },
        

        //일반 MARKET INFO
        { file: './user/marketinfo/etpInfo', path: '/user/marketinfo/getetfkorlist', method: 'getEtfKorList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpInfo', path: '/user/marketinfo/getetfforlist', method: 'getEtfForList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpInfo', path: '/user/marketinfo/getetnkorlist', method: 'getEtnKorList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpInfo', path: '/user/marketinfo/getetnforlist', method: 'getEtnForList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpInfo', path: '/user/marketinfo/getEtpList', method: 'getEtpList', session: 'uncheck', type: 'post' },
        { file: './user/marketinfo/marketInfo', path: '/user/marketinfo/getSectorEtpList', method: 'getSectorEtpList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/marketInfo', path: '/user/marketinfo/getMarketIndexList', method: 'getMarketIndexList', session: 'uncheck', type: 'get' },

        
        // 공통 
        { file: './user/common/itemInfo', path: '/user/common/getFavorItemInfo', method: 'getFavorItemInfo', session: 'check', type: 'get' },
        { file: './user/common/itemInfo', path: '/user/common/deleteFavorItem', method: 'deleteFavorItem', session: 'check', type: 'post' },
        { file: './user/common/itemInfo', path: '/user/common/insertFavorItem', method: 'insertFavorItem', session: 'check', type: 'post' },
        { file: './user/common/itemInfo', path: '/user/common/getETFList', method: 'getETFList', session: 'check', type: 'get' },   
        { file: './user/common/itemInfo', path: '/user/common/getETNList', method: 'getETNList', session: 'check', type: 'get' },   
        { file: './user/common/itemInfo', path: '/user/common/getIndexList', method: 'getIndexList', session: 'check', type: 'get' },   
        { file: './user/common/itemInfo', path: '/user/common/getPublishEtpList', method: 'getPublishEtpList', session: 'check', type: 'get' },   
        { file: './user/common/itemInfo', path: '/user/common/getALLEtpList', method: 'getALLEtpList', session: 'check', type: 'get' },   

        //풀 테스트 

        { file: './sample/bluebirdTest', path: '/sample/getBluelist', method: 'getBlueList', session: 'uncheck', type: 'post' },
        { file: './sample/fileupload', path: '/sample/fileuploadSingle', method: 'fileuploadSingle', session: 'uncheck', type: 'post' },
        { file: './sample/fileupload', path: '/sample/fileuploadMulti', method: 'fileuploadMulti', session: 'uncheck', type: 'post' },
    ]
}