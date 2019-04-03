/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

module.exports = {
    route_info: [

        // 로그인
        { file: './admin/login', path: '/logintest', method: 'checkLoginTest', session: 'uncheck', type: 'post' },
        { file: './admin/login', path: '/login', method: 'checkLogin', session: 'uncheck', type: 'post' },
        //공지사항
        { file: './admin/board', path: '/board/liststory', method: 'listStory', session: 'check', type: 'get' },
        { file: './admin/board', path: '/board/insertstory', method: 'insertStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updatestory', method: 'updateStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/deletestory', method: 'deleteStory', session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updateviewcount', method: 'updateViewCount', session: 'check', type: 'post' },
        //시스템변경사항
        { file: './admin/changenotice', path: '/changenotice/liststory', method: 'listStory', session: 'uncheck', type: 'get' },
        { file: './admin/changenotice', path: '/changenotice/insertstory', method: 'insertStory', session: 'check', type: 'post' },
        { file: './admin/changenotice', path: '/changenotice/updatestory', method: 'updateStory', session: 'check', type: 'post' },
        { file: './admin/changenotice', path: '/changenotice/deletestory', method: 'deleteStory', session: 'check', type: 'post' },
        { file: './admin/changenotice', path: '/changenotice/updateviewcount', method: 'updateViewCount', session: 'uncheck', type: 'post' },
        //관리자 리포트
        { file: './admin/chart', path: '/admin/chart/chartlistterm', method: 'getUserChartListTerm', session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/downloadfileterm', method: 'downloadFileTerm', session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/chartlistmonth', method: 'getUserChartListMonth', session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/downloadfilemonth', method: 'downloadFileMonth', session: 'check', type: 'post' },
        //사용자설정
        { file: './admin/users', path: '/admin/userlist', method: 'userList', session: 'check', type: 'get' },
        { file: './admin/users', path: '/admin/insertinfo', method: 'insertInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/updateinfo', method: 'updateInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/deleteinfo', method: 'deleteInfo', session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/useridcheck', method: 'useridCheck', session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/pwdinit', method: 'pwdInit', session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/pwdchange', method: 'pwdChange', session: 'check', type: 'post' },
        //일반고객 리포트
        { file: './user/chart', path: '/user/chart/chartlistterm', method: 'getUserChartListTerm', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfileterm', method: 'downloadFileTerm', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/chartlistmonth', method: 'getUserChartListMonth', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfilemonth', method: 'downloadFileMonth', session: 'check', type: 'post' },
        //일반고객 회원정보조회
        { file: './user/users', path: '/user/getuserinfo', method: 'getUserInfo', session: 'check', type: 'post' },
        { file: './user/users', path: '/user/updateuserinfo', method: 'updateUserInfo', session: 'check', type: 'post' },
        //
        // 신규 개발
        //일반 ETP register
        { file: './user/etp/etpregister', path: '/user/etp/getetpapplylist', method: 'getEtpApplyList', session: 'uncheck', type: 'get' },
        //일반 INDEX register
        { file: './user/index/indexmanage', path: '/user/index/getinfoopenreqlist', method: 'getInfoOpenReqList', session: 'uncheck', type: 'get' },
        { file: './user/index/indexmanage', path: '/user/index/getindexsummaryhist', method: 'getIndexSummaryHist', session: 'uncheck', type: 'get' },
        { file: './user/index/indexmanage', path: '/user/index/getIndexVueTableTestList', method: 'getIndexVueTableTestList', session: 'uncheck', type: 'get' },
        { file: './user/index/indexmanage', path: '/user/index/getIndexToastGridTestList', method: 'getIndexToastGridTestList', session: 'uncheck', type: 'get' },
        { file: './user/index/indexmanage', path: '/user/index/getJisuDuplCheck', method: 'getJisuDuplCheck', session: 'uncheck', type: 'post' },
        { file: './user/index/indexmanage', path: '/user/index/fileuploadSingle', method: 'fileuploadSingle', session: 'uncheck', type: 'post' },
        { file: './user/index/indexmanage', path: '/user/index/save', method: 'save', session: 'uncheck', type: 'post' },
        //일반 MARKET INFO
        { file: './user/marketinfo/etpinfo', path: '/user/marketinfo/getetfkorlist', method: 'getEtfKorList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpinfo', path: '/user/marketinfo/getetfforlist', method: 'getEtfForList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpinfo', path: '/user/marketinfo/getetnkorlist', method: 'getEtnKorList', session: 'uncheck', type: 'get' },
        { file: './user/marketinfo/etpinfo', path: '/user/marketinfo/getetnforlist', method: 'getEtnForList', session: 'uncheck', type: 'get' },

        //풀 테스트 

        { file: './sample/bluebirdTest', path: '/sample/getBluelist', method: 'getBlueList', session: 'uncheck', type: 'post' },
        { file: './sample/fileupload', path: '/sample/fileuploadSingle', method: 'fileuploadSingle', session: 'uncheck', type: 'post' },
        { file: './sample/fileupload', path: '/sample/fileuploadMulti', method: 'fileuploadMulti', session: 'uncheck', type: 'post' },
    ]
}