<template>
    <v-layout row wrap class="content_margin etp_new">
        <v-flex grow>
            <v-card flat>
             <v-card-title primary-title>   
                <h3 class="headline" pb-0>
                            PORTFOLIO SIMULATION |
                   <span class="grey--text">KOSPI, KOSDAQ, ETF를 이용해 포트폴리오를 구성하고 백테스트를 수행합니다.</span>
                </h3>
             </v-card-title>
             <v-card class="register_wrap  pt0"  flat xs12  color="lighten-1">
                <h4>조건 설정</h4>
                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시나리오명</v-subheader>
                        </v-flex>
                        <v-flex xs2> 
                            <v-text-field  label="unnamed-1" outline></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">시작년도</v-subheader>
                        </v-flex>
                        <v-flex xs2> 
                            <v-select :items="items1" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">리밸런싱주기</v-subheader>
                        </v-flex>
                        <v-flex xs2> 
                            <v-select item-text="text" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                        <v-flex xs8 row class="checkbox_w pl-2">
                            <v-layout row wrap class="light--text">
                              <v-flex xs1>
                                 <v-checkbox v-bind:disabled = inputDisabled
                                             color="primary"
                                             label="첫영업일"
                                              value="Y">
                                </v-checkbox> 
                                </v-flex>
                                <v-flex xs2>
                                    <v-checkbox v-bind:disabled = inputDisabled
                                         color="primary"
                                        label="동시만기 익일"
                                         value="Y"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-checkbox v-bind:disabled = inputDisabled
                                             color="primary"
                                            label="동시만기 익주 첫영업일"
                                             value="Y"></v-checkbox>
                                        </v-flex>
                                        <v-flex xs2>
                                           <v-checkbox v-bind:disabled = inputDisabled
                                                color="primary"
                                                label="옵션만기 익일"
                                                value="Y"></v-checkbox>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-checkbox v-bind:disabled = inputDisabled
                                                   color="primary"
                                                   label="옵션만기 익주 첫영업일"
                                                    value="Y"></v-checkbox>
                                        </v-flex>
                                    </v-layout> 
                        </v-flex>
                        
                    </v-layout>
                    <v-layout row xs12>
                                <v-flex xs2>
                                    <v-subheader class="subheader_r">초기투자금액(KRW)</v-subheader>
                                </v-flex>
                                <v-flex xs2> 
                                    <v-text-field  label="1,000,000" outline></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row xs12>
                        <v-flex xs2>
                            <v-subheader class="subheader_r">벤치마크 설정</v-subheader>
                        </v-flex>
                        <v-flex xs2> 
                            <v-select item-text="text" placeholder="선택하세요" outline></v-select>
                        </v-flex>
                    </v-layout> 
                  </v-card>
                   <v-card class="register_wrap  pt0"  flat xs12  color="lighten-1">
                <h4>포트폴리오 설정</h4>
                    <v-layout row>
                        <v-flex xs12>
                            <div class="right_btn">
                                <span>비중설정방식: </span>
                                <span class="toggle2">
                                    <v-btn-toggle v-model="toggle_one" class="toggle_01">
                                        <v-btn flat >직접입력</v-btn>
                                        <v-btn flat >동일가중</v-btn>
                                        <v-btn flat >시총비중</v-btn>
                                    </v-btn-toggle>
                                </span>
                            </div>
                        </v-flex>
                    </v-layout>
                     <v-card flat class="pt-3">
            <table class="tbl_type ver10">
              <caption> 헤더 고정 테이블</caption>
              <colgroup>
                <col width="10%">
                <col width="16%">
                <col width="16%">
                <col width="15%">
                <col width="16%">
                <col width="16%">
            </colgroup>
              <thead>
              <tr>
                  <th></th>
                  <th>종목코드</th>
                  <th class="txt_left">종목명</th>
                  <th class="txt_right">시가총액</th>
                  <th class="txt_right">YTD</th>
                  <th class="txt_right">지수적용비율</th>
            </tr>
              </thead>
              <tbody>
                <tr>
                    <td><button class='btn_icon v-icon material-icons' @click="">add_circle_outline</button>
                        <span class="add_btn_span">Asset1</span></td>
                    <td class="td_in_input"><input type='text' id='' class='txt_right wid100'  value=''>
                        <span><button class='btn_icon v-icon material-icons' @click="">search</button></span></td>
                    <td class="txt_left" >삼성전자</td>
                    <td class="txt_right" >999.999.999.999.999</td>
                    <td class="txt_right" ><input type='text' id='' class='txt_right wid100'  value=''></td>
                    <td class="txt_right" >25.3</td>
                </tr>
                <tr class="sum">
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="txt_right" ><input type='text' id='' class='txt_right wid100'  value='100%'></td>
                    <td></td>
                </tr>
              </tbody>
            </table>
            <div class="text-xs-center mt-3"><v-btn depressed color="primary" @click="fn_test">백테스트 실행</v-btn>
        </div>
        </v-card>
      </v-card>
     </v-card>
    </v-flex>
</v-layout>
    
</template>
<script>
  export default {
    data () {
      return {
        toggle_one: 0,
        items1: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
        item: [
        {

          link: 'Simulation/SimulationResult',
        }
        ],
      }
    },

    methods : {
        fn_test : function() {
            this.$router.push( {path : "/Simulation/SimulationResult" } );
        }
    }
  }
  </script>