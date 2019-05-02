// 사용자
import  Home        from './components/Home/Home.vue'
// INDEX
import  IndexManageMain   from './components/Home/Index/Manage/IndexManageMain.vue'

import IndexMainSummary   from  '@/components/Home/Index/Manage/Summary.vue';
import IndexMainIndexList   from  '@/components/Home/Index/Manage/IndexList.vue';
import IndexMainIndexDetail   from  '@/components/Home/Index/Manage/IndexDetail.vue';


import  IndexRegisterMain   from './components/Home/Index/Register/IndexRegisterMain.vue'
import  IndexDatepickerTestMain   from './components/Home/Index/ToastGridTest/IndexDatepickerTestMain.vue'
import  IndexVueTableTestMain   from './components/Home/Index/ToastGridTest/IndexVueTableTestMain.vue'
import  IndexToastGridTestMain   from './components/Home/Index/ToastGridTest/IndexToastGridTestMain.vue'
import  IndexListdetail   from './components/Home/Index/Manage/IndexListdetail.vue'

// ETP
import  EtpOperMain                         from './components/Home/Etp/Manage/EtpOperMain.vue'                         /* ETP 운용관리 메인 */
import  EtpOperInfo                         from "./components/Home/Etp/Manage/EtpOperInfo.vue";                        /* ETP 운용정보 */
import  EtpOperIndex                        from "./components/Home/Etp/Manage/EtpOperIndex.vue";                       /* 지수관리 */
import  EtpOperPdf                          from "./components/Home/Etp/Manage/EtpOperPdf.vue";                         /* PDF 관리 */
import  EtpOperInfoQuickInav                from './components/Home/Etp/Manage/EtpOperInfoQuickInav.vue';               /* ETP 운용정보 -> iNAV 산출현황 */
import  EtpOperInfoQuickPerformance         from './components/Home/Etp/Manage/EtpOperInfoQuickPerformance.vue';        /* ETP 운용정보 -> ETP Performance */

import  EtpRegisterMain                     from './components/Home/Etp/Register/EtpRegisterMain.vue';
import  EtpContractMain                     from './components/Home/Etp/Contract/EtpContractMain.vue';
import  EtpManageDetail                     from './components/Home/Etp/Manage/EtpManageDetail.vue';
import  OverseasIndex                       from './components/Home/Etp/Manage/OverseasIndex.vue';

// MARKET INFO
import EtpInfoMain              from './components/Home/MarketInfo/etp/EtpInfoMain.vue'
//import MarktEtpSummaryInfo    from './components/Home/MarketInfo/EtfForList.vue'
import MarketRepresent          from  './components/Home/MarketInfo/etp/MarketRepresent.vue'             /* 001-시장대표 */
import MarketSector             from  './components/Home/MarketInfo/etp/MarketSector.vue'                /* 002-섹터*/
import MarketThema              from  './components/Home/MarketInfo/etp/marketThema.vue'                 /* 003-테마 */
import MarketStrategy           from  './components/Home/MarketInfo/etp/MarketStrategy.vue'              /* 004-전략 */
import MarketBond               from  './components/Home/MarketInfo/etp/marketBond.vue'                  /* 005-채권 */
import MarketCurrency           from  './components/Home/MarketInfo/etp/marketCurrency.vue'              /* 006-통화 */
import MarketRawMaterials       from  './components/Home/MarketInfo/etp/marketRawMaterials.vue'          /* 007-원자재 */
import MarketVix                from  './components/Home/MarketInfo/etp/marketVix.vue'                   /* 008-VIX */
import MarketRealEstate         from  './components/Home/MarketInfo/etp/marketRealEstate.vue'            /* 009-부동산 */
import MarketMixAssets          from  './components/Home/MarketInfo/etp/marketMixAssets.vue'             /* 010-혼합자산 */
import MarketOversea            from  './components/Home/MarketInfo/etp/marketOversea.vue'               /* 101-국가 ( 탭에 노출은 '해외' ) */
import MarketLeverageInverse    from  './components/Home/MarketInfo/etp/marketLeverageInverse.vue'       /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */

import  Login   from '@/components/common/login.vue'

// TODAY
import  Today1Main   from './components/Home/MarketInfo/index/IndexInfoMain.vue'


import  sampleChart   from '@/components/Sample/test.vue'
import  sampleUpload   from '@/components/Sample/fileUpload.vue'



// 관리자
export const routes = [
  { path : '/',
    component: Home,
    children: [        
        // MARKET INFO
        {   path : 'info/etpinfo',
            component: EtpInfoMain,
            meta: {
                requiresAuth: false
            },
            children: [
                {
                    path : 'marketRepresent',
                    component: MarketRepresent,          /* 001-시장대표 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketSector',
                    component: MarketSector,             /* 002-섹터 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketThema',
                    component: MarketThema,              /* 003-테마 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketStrategy',
                    component: MarketStrategy,           /* 004-전략 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketBond',
                    component: MarketBond,               /* 005-채권 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketCurrency',
                    component: MarketCurrency,           /* 006-통화 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketRawMaterials',
                    component: MarketRawMaterials,       /* 007-원자재 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketVix',
                    component: MarketVix,                /* 008-VIX */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketRealEstate',
                    component: MarketRealEstate,         /* 009-부동산 */
                    meta: {
                        requiresAuth: false
                    },
                },
                {
                    path : 'marketMixAssets',
                    component: MarketMixAssets,          /* 010-혼합자산 */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketOversea',
                    component: MarketOversea,            /* 101-국가 ( 탭에 노출은 '해외' ) */
                    meta: {
                        requiresAuth: false
                    },
                }, 
                {
                    path : 'marketLeverageInverse',
                    component: MarketLeverageInverse,    /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
                    meta: {
                        requiresAuth: false
                    },
                }, 
            ]
        },
        {   path : 'info/indexinfo',
            component: Today1Main,
        },
        {   path : 'sample/test',
            component: sampleChart,
        },
        {   path : 'sample/upload',
            component: sampleUpload,
        },
        {   path : 'login',
            component: Login,
        },
        // INDEX
        {   path : 'index/manage',
            component: IndexManageMain,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path : 'indexSummary',
                    component: IndexMainSummary,
                    meta: {
                        requiresAuth: true
                    },
                }, 
                {
                    path : 'indexList',
                    component: IndexMainIndexList,
                    meta: {
                        requiresAuth: true
                    },
                }, 
                {
                    path : 'indexDetail',
                    component: IndexMainIndexDetail,
                    meta: {
                        requiresAuth: true
                    },
                }, 
            ]
        },
        {   path : '/index/manage/IndexListdetail',
            component: IndexListdetail,
            meta: {
                requiresAuth: true
            },
        },
        {   path : '/index/register',
            component: IndexRegisterMain,
            meta: {
                requiresAuth: true
            },
        },

        //  ETP 운용관리
        {   path : 'etp/manage',
            component: EtpOperMain,                         /* ETP 운용관리 메인 */
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path : 'etpOperInfo',
                    component: EtpOperInfo,                 /* ETP 운용정보 */
                    meta: {
                        requiresAuth: true
                    },
                }, 
                {
                    path : 'etpOperIndex',
                    component: EtpOperIndex,                /* 지수관리 */
                    meta: {
                        requiresAuth: true
                    },
                }, 
                {
                    path : 'etpOperPdf',
                    component: EtpOperPdf,                  /* PDF 관리 */
                    meta: {
                        requiresAuth: true
                    },
                }, 
            ]            
        },
        {   path : 'etp/register',
            component: EtpRegisterMain,
            meta: {
                requiresAuth: true
            },
        },
        {   path : 'etp/contract',
            component: EtpContractMain,
            meta: {
                requiresAuth: true
            },
        },
        {   path : 'etp/etpManageDetail',
            component: EtpManageDetail,
            meta: {
                requiresAuth: true
            },
        },
        {   path : 'etp/manage/etpOperInfoQuickInav',
            component: EtpOperInfoQuickInav,
            meta: {
                requiresAuth: true
            },
        },
        {   path : 'etp/manage/etpOperInfoQuickPerformance',
            component: EtpOperInfoQuickPerformance,
            meta: {
                requiresAuth: true
            },
        },
        {   path : 'etp/OverseasIndex',
            component: OverseasIndex,
            meta: {
                requiresAuth: true
            },
        },


        {   path : '/index/datepickerTest',
            component: IndexDatepickerTestMain,
        },
        {   path : '/index/vueTableTest',
            component: IndexVueTableTestMain,
        },
        {   path : '/index/toastGridTest',
            component: IndexToastGridTestMain,
        },
    ]
  }
]



