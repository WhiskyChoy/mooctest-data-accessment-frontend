<template lang="pug">
    el-tooltip(effect="dark" :content="'得分：'+score&&score.toFixed(1)+'，总分'+total&&total.toFixed(1)" placement="right")
        el-progress(:percentage="percentage" :status="status" :color="customColors")
</template>

<script>
    const bad_fair = 60, fair_good = 80;
    export default {
        name: "MyProgress",
        computed: {
            percentage() {
                return this.score / this.total * 100;
            },
            status() {
                if (this.percentage < bad_fair) {
                    return 'exception'
                }
                if (this.percentage < fair_good) {
                    return 'warning'
                }
                return 'success'
            }
        },
        props: {
            score: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
        },
        data() {
            return {
                customColors: [
                    {color: '#f56c6c', percentage: bad_fair},
                    {color: '#e6a23c', percentage: fair_good},
                    {color: '#5cb87a', percentage: 100},
                ],
            }
        }
    }
</script>

<style scoped lang="less">

</style>