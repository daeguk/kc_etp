// 사용자
import  Home        from './components/Home/Home.vue'
// INDEX
import  IndexManageMain   from './components/Home/Index/Manage/IndexManageMain.vue'

import IndexMainSummary   from  '@/components/Home/Index/Manage/Summary.vue';
import IndexMainIndexList   from  '@/components/Home/Index/Manage/IndexList.vue';
import IndexMainIndexDetail   from  '@/components/Home/Index/Manage/IndexDetail.vue';


import  IndexRegisterMain   from './components/Home/Index/Register/IndexRegisterMain.vue'
import  IndexDevelopMain   from './components/Home/Index/Develop/IndexDevelopMain.vue'
import  IndexListdetail   from './components/Home/Index/Manage/IndexListdetail.vue'

// ETP
import  EtpManageMain   from './components/Home/Etp/Manage/EtpManageMain.vue'
import  EtpRegisterMain   from './components/Home/Etp/Register/EtpRegisterMain.vue'
import  EtpContractMain   from './components/Home/Etp/Contract/EtpContractMain.vue'
// MARKET INFO
import  EtpInfoMain   from './components/Home/MarketInfo/EtpInfoMain.vue'
// TODAY
import  Today1Main   from './components/Home/Today/Today1Main.vue'


import  sampleChart   from '@/components/Sample/test.vue'
import  sampleUpload   from '@/components/Sample/fileUpload.vue'
import  sampleLoginTest   from '@/components/Sample/loginTest.vue'

// 관리자
export const routes = [
  {
    path : '/', 
    component: Home,
    children: [        
        // INDEX
        {   path : 'index/manage',
            component: IndexManageMain,
        },
        {
            path : 'index/manage/indexSummary',
            component: IndexMainSummary
        }, 
        {
            path : 'index/manage/indexList',
            component: IndexMainIndexList
        }, 
        {
            path : 'index/manage/indexDetail',
            component: IndexMainIndexDetail
        }, 
        {   path : 'index/register',
            component: IndexRegisterMain,
        },
        {   path : 'index/develop',
            component: IndexDevelopMain,
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
        // TODAY
        {   path : 'today/today1',
            component: Today1Main,
        },
        // MARKET INFO
        {   path : 'info/etpinfo',
            component: EtpInfoMain,
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
    ]
  }
]



