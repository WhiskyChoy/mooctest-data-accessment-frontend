<template lang="pug">
    el-scrollbar(:style="[{position,height}]")
</template>

<script>
    export default {
        name: "MyDynamicScroller",
        props: {
            position: {
                type: String,
                default: 'relative'
            },
            height: {
                type: String,
                default: '800px'
            }
        },
    }
</script>

<style scoped lang="less">
    .el-scrollbar /deep/ .el-scrollbar__wrap {
        overflow-y: auto;
        overflow-x: hidden;
        /*圆括号里面不能再有/deep/了，不然/deep/不会被编译*/
    }
</style>