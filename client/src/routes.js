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
// MARKET INFO
import EtpInfoMain   from './components/Home/MarketInfo/EtpInfoMain.vue'
import MarktEtpSummaryInfo   from './components/Home/MarketInfo/EtfForList.vue'
import MarketRepresent   from  './components/Home/MarketInfo/MarketRepresent.vue'
import MarketSector   from  './components/Home/MarketInfo/MarketSector.vue'
import marketThema   from  './components/Home/MarketInfo/marketThema.vue'
import MarketStrategy   from  './components/Home/MarketInfo/MarketStrategy.vue'
import marketBond   from  './components/Home/MarketInfo/marketBond.vue'
import marketOversea   from  './components/Home/MarketInfo/marketOversea.vue'
import marketMix   from  './components/Home/MarketInfo/marketMix.vue'
import marketItem   from  './components/Home/MarketInfo/marketItem.vue'


// TODAY
import  Today1Main   from './components/Home/Today/Today1Main.vue'


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
                    component: MarketRepresent
                }, 
                {
                    path : 'marketSector',
                    component: MarketSector
                }, 
                {
                    path : 'marketThema',
                    component: marketThema
                }, 
                {
                    path : 'marketStrategy',
                    component: MarketStrategy
                }, 
                {
                    path : 'marketBond',
                    component: marketBond
                }, 
                {
                    path : 'marketOversea',
                    component: marketOversea
                }, 
                {
                    path : 'marketMix',
                    component: marketMix
                }, 
                {
                    path : 'marketItem',
                    component: marketItem
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
    ]
  }
]



