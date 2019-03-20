// 사용자
import  Home        from './components/Home/Home.vue'
// INDEX
import  IndexManageMain   from './components/Home/Index/Manage/IndexManageMain.vue'
import  IndexRegisterMain   from './components/Home/Index/Register/IndexRegisterMain.vue'
import  IndexDevelopMain   from './components/Home/Index/Develop/IndexDevelopMain.vue'
// ETP
import  EtpManageMain   from './components/Home/Etp/Manage/EtpManageMain.vue'
import  EtpRegisterMain   from './components/Home/Etp/Register/EtpRegisterMain.vue'
import  EtpContractMain   from './components/Home/Etp/Contract/EtpContractMain.vue'
// MARKET INFO
import  EtpInfoMain   from './components/Home/MarketInfo/EtpInfoMain.vue'
// TODAY
import  Today1Main   from './components/Home/Today/Today1Main.vue'


import  testMain   from '@/components/Home/Index/Manage/test.vue'

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
        {   path : 'index/register',
            component: IndexRegisterMain,
        },
        {   path : 'index/develop',
            component: IndexDevelopMain,
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
        {   path : 'index/test',
            component: testMain,
        },
    ]
  },
]
