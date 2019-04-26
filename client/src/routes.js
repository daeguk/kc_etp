// 사용자
import  Home        from './components/Home/Home.vue'
// INDEX
import  IndexManageMain   from './components/Home/Index/Manage/IndexManageMain.vue'

import IndexMainSummary   from  '@/components/Home/Index/Manage/Summary.vue';
import IndexMainIndexList   from  '@/components/Home/Index/Manage/IndexList.vue';
import IndexMainIndexDetail   from  '@/components/Home/Index/Manage/IndexDetail.vue';


import  IndexRegisterMain   from './components/Home/Index/Register/IndexRegisterMain.vue'
import  IndexDevelopMain   from './components/Home/Index/Develop/IndexDevelopMain.vue'
import  IndexDatepickerTestMain   from './components/Home/Index/ToastGridTest/IndexDatepickerTestMain.vue'
import  IndexVueTableTestMain   from './components/Home/Index/ToastGridTest/IndexVueTableTestMain.vue'
import  IndexToastGridTestMain   from './components/Home/Index/ToastGridTest/IndexToastGridTestMain.vue'
import  IndexListdetail   from './components/Home/Index/Manage/IndexListdetail.vue'

// ETP
import  EtpManageMain   from './components/Home/Etp/Manage/EtpManageMain.vue'
import  EtpRegisterMain   from './components/Home/Etp/Register/EtpRegisterMain.vue'
import  EtpContractMain   from './components/Home/Etp/Contract/EtpContractMain.vue'
import  EtpManageDetail   from './components/Home/Etp/Manage/EtpManageDetail.vue'
import  InfoEtpInav   from './components/Home/Etp/Manage/InfoEtpInav.vue'
import  ETPPerfomance   from './components/Home/Etp/Manage/ETPPerfomance.vue'
import  OverseasIndex   from './components/Home/Etp/Manage/OverseasIndex.vue'

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


// TODAY
import  Today1Main   from './components/Home/MarketInfo/index/IndexInfoMain.vue'


import  sampleChart   from '@/components/Sample/test.vue'
import  sampleUpload   from '@/components/Sample/fileUpload.vue'
import  sampleLoginTest   from '@/components/Sample/loginTest.vue'


// 관리자
export const routes = [
  { path : '/',
    component: Home,
    children: [        
        // MARKET INFO
        {   path : 'info/etpinfo',
            component: EtpInfoMain,
            children: [
/*                
                {
                    path : 'marktEtpSummaryInfo',
                    component: MarktEtpSummaryInfo
                }, 
*/                

                {
                    path : 'marketRepresent',
                    component: MarketRepresent          /* 001-시장대표 */
                }, 
                {
                    path : 'marketSector',
                    component: MarketSector             /* 002-섹터 */
                }, 
                {
                    path : 'marketThema',
                    component: MarketThema              /* 003-테마 */
                }, 
                {
                    path : 'marketStrategy',
                    component: MarketStrategy           /* 004-전략 */
                }, 
                {
                    path : 'marketBond',
                    component: MarketBond               /* 005-채권 */
                }, 
                {
                    path : 'marketCurrency',
                    component: MarketCurrency           /* 006-통화 */
                }, 
                {
                    path : 'marketRawMaterials',
                    component: MarketRawMaterials       /* 007-원자재 */
                }, 
                {
                    path : 'marketVix',
                    component: MarketVix                /* 008-VIX */
                }, 
                {
                    path : 'marketRealEstate',
                    component: MarketRealEstate         /* 009-부동산 */
                },
                {
                    path : 'marketMixAssets',
                    component: MarketMixAssets          /* 010-혼합자산 */
                }, 
                {
                    path : 'marketOversea',
                    component: MarketOversea            /* 101-국가 ( 탭에 노출은 '해외' ) */
                }, 
                {
                    path : 'marketLeverageInverse',
                    component: MarketLeverageInverse    /* 201-배율 ( 탭에 노출은 '레버리지/인버스' ) */
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
            component: sampleLoginTest,
        },
        // INDEX
        {   path : 'index/manage',
            component: IndexManageMain,
            children: [
                {
                    path : 'indexSummary',
                    component: IndexMainSummary
                }, 
                {
                    path : 'indexList',
                    component: IndexMainIndexList
                }, 
                {
                    path : 'indexDetail',
                    component: IndexMainIndexDetail
                }, 
            ]
        },
        
        {   path : '/index/register',
            component: IndexRegisterMain,
        },
        {   path : '/index/develop',
            component: IndexDevelopMain,
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
        {   path : '/index/manage/IndexListdetail',
            component: IndexListdetail,
        },
        
        // ETP
        {   path : 'etp/manage',
            component: EtpManageMain,
        },
        {   path : 'etp/register',
            component: EtpRegisterMain,
        },
        {   path : 'etp/contract',
            component: EtpContractMain,
        },
        {   path : 'etp/etpManageDetail',
            component: EtpManageDetail,
        },
        {   path : 'etp/InfoEtpInav',
            component: InfoEtpInav,
        },
        {   path : 'etp/ETPPerfomance',
            component: ETPPerfomance,
        },
        {   path : 'etp/OverseasIndex',
            component: OverseasIndex,
        },
    ]
  }
]



