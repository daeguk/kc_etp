<template>
<v-container>
    <v-dialog v-model="dialog" persistent max-width="700">
     <template v-slot:activator="{ on }">
         <v-btn depressed color="primary" dark v-on="on">분류체계설명</v-btn>
     </template>
    <v-card flat >
    <h5>
      <v-card-title>
        <h5>ETF 대상지수구분(신) 분류체계 설명 <span class="pl-0"></span></h5>
      <v-spacer></v-spacer>
      <v-btn icon  @click="dialog = false"><v-icon>close</v-icon></v-btn>
      </v-card-title>
    </h5>
    <div class="incode_pop">
        <h6>※ 공통 적용 사항</h6>
        <ul>
            <li>- 지수구분(대) 유지</li>
            <li>- 지수구분(중) 신규 1 byte</li>
            <li>- 지수일련번호(지수구분) 길이 확장 2bytes -> 5 bytes</li>
            <li>- 기존에 일련번호 자릿수 한계로 알파벳을 사용한 코드체계 폐지</li>
        </ul>
      <!--1table-->  
    <div class="mt-3">
        <h6 class="pb-1">1.국내 주식형지수(K, Q, M, W)</h6>
        <div class="table-box-wrap">
        
            <div class="table-box">
            <table class="tbl_type ver8 v2">
                <caption>헤더 고정 테이블</caption>
                <colgroup>
                    <col width="33%">
                    <col width="33%">
                    <col width="33%">
                </colgroup>
                <thead>
          <tr>
            <th style="width:33%" class="txt_left">지수구분(대)</th>
            <th style="width:33%" class="txt_left">지수구분(중)</th>
            <th style="width:33%" class="txt_left">지수구분(소)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt_left">1 BYTE</td>
            <td class="txt_left">1 BYTE</td>
            <td class="txt_left">5 BYTE</td>
          </tr>
          <tr>
            <td class="txt_left">K: KOSPI주식 <br>Q: KOSDAQ 주식 <br> M: FnGuide 주식 <br>W: WISEfn 주식</td>
            <td class="txt_left">미사용('0' 값 고정)</td>
            <td class="txt_left">지수일련번호</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    </div>

    <!--2table-->
    <div class="mt-3">
        <h6 class="pb-1">2.해외지수(F,Q)</h6>
        <div class="table-box-wrap">
        
            <div class="table-box">
            <table class="tbl_type ver8 v2">
                <caption>헤더 고정 테이블</caption>
                <colgroup>
                    <col width="30%">
                    <col width="40%">
                    <col width="30%">
                </colgroup>
                <thead>
          <tr>
            <th style="width:30%" class="txt_left">지수구분(대)</th>
            <th style="width:40%" class="txt_left">지수구분(중)</th>
            <th style="width:30%" class="txt_left">지수구분(소)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt_left">1 BYTE</td>
            <td class="txt_left">1 BYTE</td>
            <td class="txt_left">5 BYTE</td>
          </tr>
          <tr>
            <td class="txt_left">F: 해외 주식지수 <br>C: 해외 상품지수</td>
            <td class="txt_left point_txt">0: 구성자산에 해외상품이 포함<br>1: 구성자산이 국내상품으로 구성<br>2: 해외채권 FnGuide 제공<br>3: 해외채권KIS 제공<br>4: 해외채권KAP 제공 <br>5: 해외선물</td>
            <td class="txt_left">지수일련번호</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    </div>

    <!--3table-->
    <div class="mt-3">
        <h6 class="pb-1">3.국내 파생형 지수(D)</h6>
        <div class="table-box-wrap">
        
            <div class="table-box">
            <table class="tbl_type ver8 v2">
                <caption>헤더 고정 테이블</caption>
                <colgroup>
                    <col width="33%">
                    <col width="33%">
                    <col width="33%">
                </colgroup>
                <thead>
          <tr>
            <th style="width:33%" class="txt_left">지수구분(대)</th>
            <th style="width:33%" class="txt_left">지수구분(중)</th>
            <th style="width:33%" class="txt_left">지수구분(소)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt_left"></td>
            <td class="txt_left"></td>
            <td class="txt_left"></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    </div>



        </div>
  </v-card>
    </v-dialog>
</v-container>
</template>

<script>


export default {

  data() {
    return {
        dialog: false,
    }
    
  },

} 
</script>