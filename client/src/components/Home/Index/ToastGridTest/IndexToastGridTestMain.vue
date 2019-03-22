<template>
    <div>
        <IndexToastGridTestList></IndexToastGridTestList>
    </div>
</template>

<script>
import IndexToastGridTestList   from  './IndexToastGridTestList.vue'

export default {
        data() {
            return {
                tab: null,
                items: ['신청현황', '신규등록'],
    	};
    },    
    components: {
        IndexToastGridTestList     : IndexToastGridTestList
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>