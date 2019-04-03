<template>
  <v-container fluid grid-list-md pa-0 mb-4>
  <v-layout row wrap>
    <v-flex xs12 flat> 
      <div class="indexinfo_box01">
        <h4 class="mb-0">Performance</h4>
          <div class="graph_02_w" style="height:100px;">
           그래프들어갑니다</div>
           <v-card flat>
           <v-data-table
            :headers="headers"
            :items="desserts"
            class="table_line2 indexinfo_table01"
            hide-actions="pagination"
            >
           <template v-slot:items="props">
            <td class="text-xs-right"><img src="/assets/img/icon_bar02.png"></td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.Week1 }}</td>
            <td class="text-xs-center">{{ props.item.Month1 }}</td>
            <td class="text-xs-center">{{ props.item.Month3 }}</td>
            <td class="text-xs-center">{{ props.item.YTD }}</td>
            <td class="text-xs-center">{{ props.item.Year1 }}</td>
            <td class="text-xs-center">{{ props.item.Year3 }}</td>
            <td class="text-xs-center">{{ props.item.Year5 }}</td>
            <td class="text-xs-center">{{ props.item.Year10 }}</td>
          </template>
          </v-data-table>
          </v-card>
          <v-card flat>
              <v-dialog  v-model="dialog2" persistent max-width="700">
            <template v-slot:activator="{ on }">
          <v-btn outline small color="primary" dark v-on="on" >
            <v-icon small  color="primary">add</v-icon> 자산추가
          </v-btn>
           </template>
           <!---자산추가 팝업-->
            <v-card>
              <h5>
              <v-card-title ma-0>특정 기관과 공유
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog2 = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-card-title>
             </h5>
                
            <v-container fluid pt-0 >
              <v-layout align-center justify-space-around row fill-height >
                <v-flex xs3>
                   <v-checkbox
              v-model="ex4"
              label="삼성자산운용"
              color="primary"
              value="삼성자산운용"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="미래에셋자산운용"
              color="primary"
              value="미래에셋자산운용"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="KB자산운용"
              color="primary"
              value="KB자산운용"
              hide-details
            ></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout align-center justify-space-around row fill-height >
                <v-flex xs3>
                   <v-checkbox
              v-model="ex4"
              label="한국투자신탁"
              color="primary"
              value="한국투자신탁"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="키움자산운용"
              color="primary"
              value="키움자산운용"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="교보악사자산운용"
              color="primary"
              value="교보악사자산운용"
              hide-details
            ></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout align-center justify-space-around row fill-height >
                <v-flex xs3>
                   <v-checkbox
              v-model="ex4"
              label="삼성증권"
              color="primary"
              value="삼성증권"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="대신증권"
              color="primary"
              value="대신증권"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="NH투자증권"
              color="primary"
              value="NH투자증권"
              hide-details
            ></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout align-center justify-space-around row fill-height >
                <v-flex xs3>
                   <v-checkbox
              v-model="ex4"
              label="미래에셋대우"
              color="primary"
              value="미래에셋대우"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="예탁결제원"
              color="primary"
              value="예탁결제원"
              hide-details
            ></v-checkbox>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox
              v-model="ex4"
              label="KRX"
              color="primary"
              value="KRX"
              hide-details
            ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
              <v-card class="pop_btn_w text-xs-center">
                  <v-btn depressed  color="primary" @click="dialog2 = false">공유하기</v-btn>
              </v-card>
              </v-card>
              <!---자산추가 팝업 end-->
          </v-dialog>
        </v-card>
          
      </div>
   </v-flex>
   <v-flex xs12 flat> 
      <div class="indexinfo_box01">
        <h4 class="mb-0">포트폴리오</h4>
        <v-subheader>TOP10 비중정보<v-btn outline small  color="primary" @click="dialog2 = false">VIEW ALL</v-btn></v-subheader>
          <div class="graph_02_w" style="height:100px;">
           그래프들어갑니다</div>
           <v-card flat></v-card>
      </div>
   </v-flex>
      
     <v-flex xs12>
  
    </v-flex>
  </v-layout>
  </v-container>
</template>



<script>
export default {
  props: [],
  data() {
    return {
      dialog: false,
      dialog2: false,
      results: [],
      headers: [
          {
            text: '',
            align: 'right',
            sortable: false,
            value: 'name',
            width: '1%' 
          },
          {
            text: '',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: '1-Week', value: 'Week1' },
          { text: '1-Month', value: 'Month1' },
          { text: '3-Month', value: 'Month3' },
          { text: 'YTD', value: 'YTD' },
          { text: '1-Year', value: 'Year1' },
          { text: '3-Year', value: 'Year3' },
          { text: '5-Year', value: 'Year5' },
          { text: '10-Year', value: 'Year10' }
        ],
        desserts: [
          {
            icon:'v-icon',
            name: 'TIGER 미국달러 선물레버러지(Price)',
            Week1: 159,
            Month1: 6.0,
            Month3: 24,
            YTD: 4.0,
            Year1: '1%',
            Year3: 24,
            Year5: 4.0,
            Year10: '1%'
          },
         {
             icon:'edit',
            name: 'TIGER 미국달러 선물레버러지(NAV)',
            Week1: 159,
            Month1: 6.0,
            Month3: 24,
            YTD: 4.0,
            Year1: '1%',
            Year3: 24,
            Year5: 4.0,
            Year10: '1%'
          },
          {
             icon:'edit',
            name: 'F-USDKRW',
            Week1: 159,
            Month1: 6.0,
            Month3: 24,
            YTD: 4.0,
            Year1: '1%',
            Year3: 24,
            Year5: 4.0,
            Year10: '1%'
          }
      ],
      modalFlag: false,
    };
  },
  
}
</script>

