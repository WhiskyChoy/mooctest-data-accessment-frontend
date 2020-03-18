<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 上传新文书
            div.tool-container
                el-button(@click="handleClear" icon="el-icon-refresh") 清空
                el-button(@click="handleUpload" type="primary" :loading="loading" icon="el-icon-upload2") 上传
        div.center-view-body

</template>

<script>

    export default {
        name: "WritUpload",
        methods: {
            handleClear() {

            },
            handleUpload() {

            }
        },
        data() {
            return {
                loading: false,
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
    }
</style>