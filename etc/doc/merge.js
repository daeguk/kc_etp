

var XLSX = require('xlsx');
XLSX.writeFile({
    SheetNames:["Sheet1"],
    Sheets: {
        Sheet1: {
            "!ref": "A1:I3",
            A1:{t:'s', v:"삼성전자"},  
            A2:{t:'s', v:"기준가"},
            B2:{t:'s', v:"종가"},
            C2:{t:'s', v:"상장주식수"},
            D2:{t:'s', v:'비율'},                         
          

            F1:{t:'s', v:"KT"},  
            F2:{t:'s', v:"기준가"},
            G2:{t:'s', v:"종가"},
            H2:{t:'s', v:"상장주식수"},
            I2:{t:'s', v:'비율'},                         
            "!merges":[
                {s:{r:0,c:0},e:{r:0,c:4}, } /* A1:A2 */,
                {s:{r:0,c:5},e:{r:0,c:8}}
            ],
           
        }
    }
}, config.uploadFolder+'/test.xlsx');
