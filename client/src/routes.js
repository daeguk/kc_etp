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
import  IndexDetailInfo   from './components/Home/Index/Manage/IndexDetailInfo.vue'

// ETP
import  EtpOperMain                         from './components/Home/Etp/Manage/EtpOperMain.vue'                         /* ETP 운용관리 메인 */
import  EtpOperInfo                         from "./components/Home/Etp/Manage/EtpOperInfo.vue";                        /* ETP 운용정보 */
import  EtpOperIndex                        from "./components/Home/Etp/Manage/EtpOperIndex.vue";                       /* 지수관리 */
import  EtpOperPdf                          from "./components/Home/Etp/Manage/EtpOperPdf.vue";                         /* PDF 관리 */
import  EtpOperInfoQuickPerformance         from './components/Home/Etp/Manage/EtpOperInfoQuickPerformance.vue';        /* ETP 운용정보 -> ETP Performance */

import  EtpRegisterMain                     from './components/Home/Etp/Register/EtpRegisterMain.vue';
import  EtpContractMain                     from './components/Home/Etp/Contract/EtpContractMain.vue';
import  EtpManageDetail                     from './components/Home/Etp/Manage/EtpManageDetail.vue';
import  OverseasIndex                       from './components/Home/Etp/Manage/OverseasIndex.vue';
import  PdfModifyImportance                       from './components/Home/Etp/Manage/PdfModifyImportance.vue';

// MARKET INFO
import EtpInfoMain              from  './components/Home/MarketInfo/etp/EtpInfoMain.vue'


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
        // INDEX
        {   path : 'index/manage',
            component: IndexManageMain,
            meta: {
                requiresAuth: true,
                requiresType: ['0003', '0005']
            },
            children: [
                {   path : 'indexSummary',
                    component: IndexMainSummary,
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0003', '0005']
                    },
                }, 
                {   path : 'indexList',
                    component: IndexMainIndexList,
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0003', '0005']
                    },
                }, 
                {   path : 'indexDetail',
                    component: IndexMainIndexDetail,
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0003', '0005']
                    },
                }, 
            ]
        },
        {   path : '/index/manage/IndexDetailInfo',
            component: IndexDetailInfo,
            meta: {
              requiresAuth: true,
              requiresType: ['0003', '0005']
            },
        },
        {   path : '/index/register',
            component: IndexRegisterMain,
            meta: {
              requiresAuth: true,
              requiresType: ['0003', '0005']
            },
        },

        //  ETP 운용관리
        {   path : 'etp/manage',
            component: EtpOperMain,                         /* ETP 운용관리 메인 */
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
            children: [
                {   path : 'etpOperInfo',
                    component: EtpOperInfo,                 /* ETP 운용정보 */
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0001', '0002', '0004', '0005']
                    },
                }, 
                {   path : 'etpOperIndex',
                    component: EtpOperIndex,                /* 지수관리 */
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0001', '0002', '0004', '0005']
                    },
                }, 
                {   path : 'etpOperPdf',
                    component: EtpOperPdf,                  /* PDF 관리 */
                    meta: {
                      requiresAuth: true,
                      requiresType: ['0001', '0002', '0004', '0005']
                    },
                }, 
            ]            
        },
        {   path : 'etp/register',
            component: EtpRegisterMain,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },
        {   path : 'etp/contract',
            component: EtpContractMain,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },
        {   path : 'etp/etpManageDetail',
            component: EtpManageDetail,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },
        {   path : 'etp/manage/etpOperInfoQuickPerformance',
            component: EtpOperInfoQuickPerformance,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },
        {   path : 'etp/manage/overseasIndex',
            component: OverseasIndex,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },
        {   path : 'etp/manage/PdfModifyImportance',
            component: PdfModifyImportance,
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
        },


        {   path : '/index/datepickerTest',
            component: IndexDatepickerTestMain,
            meta: {
              requiresAuth: false
            },
        },
        {   path : '/index/vueTableTest',
            component: IndexVueTableTestMain,
            meta: {
              requiresAuth: false
            },
        },
        {   path : '/index/toastGridTest',
            component: IndexToastGridTestMain,
            meta: {
              requiresAuth: false
            },
        },
        
    ]
  }
]



