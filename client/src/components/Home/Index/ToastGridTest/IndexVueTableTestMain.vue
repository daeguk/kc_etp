<template>
    <div>
        <IndexVueTableTestList></IndexVueTableTestList>
    </div>
</template>

<script>
import IndexVueTableTestList   from  './IndexVueTableTestList.vue'

export default {
        data() {
            return {
                tab: null,
                items: ['신청현황', '신규등록'],
    	};
    },    
    components: {
        IndexVueTableTestList     : IndexVueTableTestList
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>