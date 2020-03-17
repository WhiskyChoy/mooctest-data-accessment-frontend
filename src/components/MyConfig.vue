<template lang="pug">
    el-scrollbar.my-config-container(v-loading="loading")
        el-row.my-config-row(v-for="item of defaultConfig" :gutter="10")
            el-col(:span="18")
                label.my-label {{item.label}}
            el-col(:span="6")
                el-switch(v-if="item.component==='switch'" v-model="item.result" :active-value="getSwitchActive(item.type)" :inactive-value="getSwitchInactive(item.type)")
            // 其他类型的conponent以后再写，用v-if判断，并用type判断result的值
</template>

<script>
    export default {
        name: "MyConfig",
        props: {
            preload: {
                type: Boolean,
                default: true
            },
        },
        beforeMount() {
            if (this.preload) {
                this.handleLoad();
            }
        },
        data() {
            return {
                loading: false,
                defaultConfig: [],
                cachedConfig: []
            }
        },
        methods: {
            async handleLoad() {
                this.loading = true;
                const data = await this.$api.getDefaultConfig();
                if (data) {
                    this.defaultConfig = data;
                    //这里必须复制一份，因为是引用
                    this.cachedConfig = JSON.parse(JSON.stringify(data));
                }
                this.loading = false;
            },
            getSendConfig() {
                let config = {};
                this.defaultConfig.forEach(item => config[item.value] = item.result);
                return config;
            },
            async handleSubmit() {
                let config = this.getSendConfig();
                const received = await this.$api.putDefaultConfig(config);
                if (received) {
                    this.$message.success({message: '修改默认配置成功', duration: 1500});
                }
                return true;
            },
            handleReset() {
                this.defaultConfig = JSON.parse(JSON.stringify(this.cachedConfig));
            },
            getSwitchVal(type) {
                let active, inactive;
                if (type === 'boolean') {
                    active = true;
                    inactive = false;
                }
                if (type === 'number') {
                    active = 1;
                    inactive = 0;
                }
                return {active, inactive}
            },
            getSwitchActive(type) {
                return this.getSwitchVal(type).active;
            },
            getSwitchInactive(type) {
                return this.getSwitchVal(type).inactive;
            }
        }
    }
</script>

<style scoped lang="less">
    .my-config-row {
        width: 400px;
        padding-left: 1rem;
        padding-right: 1rem;
        margin-bottom: 1rem;
    }

    .my-label {
        color: gray;
    }

    .el-scrollbar.my-config-container {
        position: relative;
        height: 400px;
        width: 400px;
        border-radius: 5px;
        border: 1px solid lightgray;
        background-color: aliceblue;
    }

    .el-scrollbar /deep/ .el-scrollbar__wrap {
        overflow-y: auto;
        overflow-x: hidden;
        /*圆括号里面不能再有/deep/了，不然/deep/不会被编译*/
    }

    .el-scrollbar /deep/ .el-scrollbar__view {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 1rem;
    }
</style>