<template>
    <div>
        <IndexDatepickerTest></IndexDatepickerTest>
    </div>
</template>

<script>
import IndexDatepickerTest   from  './IndexDatepickerTest.vue'

export default {
        data() {
            return {
                tab: null,
                items: ['신청현황', '신규등록'],
    	};
    },    
    components: {
        IndexDatepickerTest     : IndexDatepickerTest
    },
    created: function() {
    },
    methods: {
    }

}
</script>

<style scoped>

</style>