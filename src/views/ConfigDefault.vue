<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1 我的默认配置
            div.tool-container
                el-button(@click="handleReset" icon="el-icon-refresh") 重置
                el-button(@click="handleSubmit" type="primary" :loading="loading" icon="el-icon-upload2") 提交
        div.center-view-body
            my-config(ref="myDefaultConfig")
</template>

<script>
    import MyConfig from "@/components/MyConfig";

    export default {
        name: "ConfigDefault",
        components: {MyConfig},
        data(){
            return {
                loading: false
            }
        },
        methods: {
            handleReset() {
                this.$refs['myDefaultConfig'].handleReset();
            },
            async handleSubmit() {
                this.loading = true;
                await this.$refs['myDefaultConfig'].handleSubmit();
                this.loading = false;
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