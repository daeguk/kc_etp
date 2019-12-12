// 사용자
import Home        from './components/Home/Home.vue'

// MARKET ETP INFO
import EtpInfoMain              from  './components/Home/MarketInfo/etp/EtpInfoMain.vue'

// MARKET INDEX INFO
import  IndexInfoMain   from './components/Home/MarketInfo/index/IndexInfoMain.vue'
import  KrxIndexList   from './components/Home/MarketInfo/index/KrxIndexList.vue'
import  FngIndexList   from './components/Home/MarketInfo/index/FngIndexList.vue'
import  sampleChart   from '@/components/Sample/test.vue'
import  sampleUpload   from '@/components/Sample/fileUpload.vue'

// INDEX
import IndexManageMain   from './components/Home/Index/Manage/IndexManageMain.vue'
import IndexMainSummary   from  '@/components/Home/Index/Manage/Summary.vue';
import IndexMainIndexList   from  '@/components/Home/Index/Manage/IndexList.vue';
import IndexMainIndexDetailList   from  '@/components/Home/Index/Manage/IndexDetailList.vue';
import  IndexRegisterMain   from './components/Home/Index/Register/IndexRegisterMain.vue'
import  IndexDetailInfo   from './components/Home/Index/Manage/IndexDetailInfo.vue'

// ETP
import  EtpOperMain                         from './components/Home/Etp/Manage/EtpOperMain.vue'                         /* ETP 운용관리 메인 */
import  EtpOperInfo                         from "./components/Home/Etp/Manage/EtpOperInfo.vue";                        /* ETP 운용정보 */
import  EtpOperIndex                        from "./components/Home/Etp/Manage/EtpOperIndex.vue";                       /* 지수관리 */
import  EtpOperPdf                          from "./components/Home/Etp/Manage/EtpOperPdf.vue";                         /* PDF 관리 */
import  EtpRegisterMain                     from './components/Home/Etp/Register/EtpRegisterMain.vue';
import  EtpContractMain                     from './components/Home/Etp/Contract/EtpContractMain.vue';
import  EtpManageDetail                     from './components/Home/Etp/Manage/EtpManageDetail.vue';

// LP
import  LpOperMain                         from './components/Home/Lp/Manage/LpOperMain.vue'                         /* LP 운용관리 메인 */
import  LpOperInfo                         from "./components/Home/Lp/Manage/LpOperInfo.vue";                        /* LP 운용정보 */

// simulation
import  SimulationControl           from '@/components/Home/Simulation/SimulationControl.vue'
import  SimulationList              from '@/components/Home/Simulation/SimulationList.vue'
import  Simulation                  from '@/components/Home/Simulation/Simulation.vue'
import  SimulationResult            from '@/components/Home/Simulation/SimulationResult.vue'
import  SimulationTimeSeriesUpload  from '@/components/Home/Simulation/SimulationTimeSeriesUpload.vue'

// OperSupport
import  OperSupportControl   from '@/components/Home/OperSupport/OperSupportControl.vue'

// 사용자(MOBILE)
import MobileHome        from './components/MobileHome/M_Home.vue'

export const routes = [
  { path : '/',
    component: Home,
    children: [        
      // MARKET INFO
      { path : 'info/etpinfo',
        component: EtpInfoMain,
        meta: {
            requiresAuth: false
        },
      },
      { path : 'info/indexinfo',
        component: IndexInfoMain,
        children: [
          { path: 'krxindexlist',
            component: KrxIndexList
          },
          { path: 'fngindexlist',
            component: FngIndexList
          },
        ]
      },
      { path : 'sample/test',
        component: sampleChart,
      },
      { path : 'sample/upload',
        component: sampleUpload,
      },
      // INDEX
      { path : 'index/manage',
        component: IndexManageMain,
        meta: {
          requiresAuth: true,
          requiresType: ['0003', '0005']
        },
        children: [
          { path : 'indexSummary',
            component: IndexMainSummary,
            meta: {
              requiresAuth: true,
              requiresType: ['0003', '0005']
            },
          }, 
          { path : 'indexList',
            component: IndexMainIndexList,
            meta: {
              requiresAuth: true,
              requiresType: ['0003', '0005']
            },
          }, 
          { path : 'indexDetailList',
            component: IndexMainIndexDetailList,
            meta: {
              requiresAuth: true,
              requiresType: ['0003', '0005']
            },
          }, 
        ]
      },
      { path : '/index/manage/IndexDetailInfo',
        component: IndexDetailInfo,
        meta: {
          requiresAuth: true,
          requiresType: ['0003', '0005']
        },
      },
      { path : '/index/register',
        component: IndexRegisterMain,
        meta: {
          requiresAuth: true,
          requiresType: ['0003', '0005']
        },
      },

      //  ETP 운용관리
      { path : 'etp/manage',
        component: EtpOperMain,                         /* ETP 운용관리 메인 */
        meta: {
          requiresAuth: true,
          requiresType: ['0001', '0002', '0004', '0005']
        },
        children: [
          { path : 'etpOperInfo',
            component: EtpOperInfo,                 /* ETP 운용정보 */
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
          }, 
          { path : 'etpOperIndex',
            component: EtpOperIndex,                /* 지수관리 */
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
          }, 
          { path : 'etpOperPdf',
            component: EtpOperPdf,                  /* PDF 관리 */
            meta: {
              requiresAuth: true,
              requiresType: ['0001', '0002', '0004', '0005']
            },
          }, 
        ]            
      },
      { path : 'etp/register',
        component: EtpRegisterMain,
        meta: {
          requiresAuth: true,
          requiresType: ['0001', '0002', '0004', '0005']
        },
      },
      { path : 'etp/contract',
        component: EtpContractMain,
        meta: {
          requiresAuth: true,
          requiresType: ['0001', '0002', '0004', '0005']
        },
      },
      { path : 'etp/etpManageDetail',
        component: EtpManageDetail,
        meta: {
          requiresAuth: true,
          requiresType: ['0001', '0002', '0004', '0005']
        },
      },
      //  LP 운용관리
      { path : 'lp/manage',
        component: LpOperMain,                         /* LP 운용관리 메인 */
        meta: {
          requiresAuth: false,
        },
        children: [
          { path : 'lpOperInfo',
            component: LpOperInfo,                 /* LP 운용정보 */
            meta: {
              requiresAuth: false,
            },
          }, 
        ]            
      },

      //  시뮬레이션
      { path : 'simulation/simulationControl',
        component: SimulationControl,
        meta: {
          requiresAuth: false,
        },
      },        
      { path : 'simulation/simulationList',
        component: SimulationList,
        meta: {
          requiresAuth: false,
        },
      },
      { path : 'simulation/simulation',
        component: Simulation,
        meta: {
          requiresAuth: false,
        },
      },
      { path : 'simulation/simulationResult',
        component: SimulationResult,
        meta: {
          requiresAuth: false,
        },
      },
      { path : 'simulation/SimulationTimeSeriesUpload',
        component: SimulationTimeSeriesUpload,
        meta: {
          requiresAuth: false,
        },
      },

      //운용지원
      { path : 'OperSupport/OperSupportControl',
        component: OperSupportControl,
        meta: {
            requiresAuth: false,
        },
      },       
    ]
  },

  // MOBILE
  { path : '/mobile',
    component: MobileHome,    
    children: [        
      // MARKET INFO
      { path : 'info/etpinfo',
        component: EtpInfoMain,
        meta: {
            requiresAuth: false
        },
      },
    ]
  },
]



