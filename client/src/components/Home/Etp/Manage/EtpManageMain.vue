<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div id="myPieChart" />
      </v-flex>
    </v-layout>
</template>

<script>
// import Info   from  './Info.vue'
// import Index   from  './Index.vue'
// import Pdf   from  './Pdf.vue'

export default {
        data() {
            return {
                // tab: null,
                // items: ['ETP 운용정보', '지수관리', 'PDF 관리'],
    	};
    },    
    components: {
        // Info     : Info,
        // Index     : Index,
        // Pdf     : Pdf,
    },
    created: function() {
    },
    mounted: function() {
        this.showChart();
    },
    methods: {
        showChart: function() {
            // Define the chart to be drawn.
            var options = {'legend':'left',
                'title':'My Big Pie Chart',
                'is3D':true,
                 'width':600, 'height':400};
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Element');
            data.addColumn('number', 'Percentage');
            data.addRows([
                ['Nitrogen', 0.78],
                ['Oxygen', 0.21],
                ['Other', 0.01]
            ]);

            // Instantiate and draw the chart.
            var chart = new google.visualization.PieChart(document.getElementById('myPieChart'));
            chart.draw(data, options);
        },
    }
}
</script>

<style scoped>
</style>