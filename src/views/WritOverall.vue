<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 我上传的文书
            div.tool-container
                div.search-container
                    el-input.input-searcher(v-model="searchName" prefix-icon="el-icon-edit-outline" clearable)
                    el-date-picker.date-searcher(v-model="searchTime" type="datetimerange" :clearable="false")
                div.tool-button-container
                    el-button-group
                        el-button(type="primary" icon="el-icon-search" @click="handleSearch" :disabled="noMsg")
                        el-button(type="primary" icon="el-icon-refresh" @click="handleRefresh")
                    el-button.my-upload 上传文书
                    el-badge.my-badge(:value="selectData.length" :hidden="selectData.length===0" :max="99")
                        el-button(:disabled="selectData.length===0") 创建任务
        div.center-view-body
            my-writ-list(ref="overallWritList" @handle-test="handleTest" @selection-change="handleSelectionChange" :name-str="searchName" :start-date="searchTime[0]" :end-date="searchTime[1]")
        //设置:modal-append-to-body="false" :append-to-body="true" 这样dialog插入body，modal插入dialog的父元素（其实就是两者平级在body）
        el-dialog(title="提交前的配置" :visible.sync="dialogVisible" center  :modal-append-to-body="false" :append-to-body="true" top="6vh")
            div.dialog-body
                el-row(:gutter="10").default-config-switch-container
                    el-col(:span="18")
                        label.my-label 使用默认配置
                    el-col(:span="6")
                        el-switch(v-model="useDefaultConfig")
                my-config(v-if="!useDefaultConfig")
            div(slot="footer")
                el-button(@click="dialogVisible=false") 取消
                el-button(type="primary" @click="handleSubmit") 提交
</template>

<script>
    import MyWritList from "@/components/MyWritList";
    import MyConfig from "@/components/MyConfig";

    export default {
        name: "WritOverall",
        components: {MyConfig, MyWritList},
        computed: {
            noMsg() {
                return !(this.searchName || (this.searchTime && this.searchTime.length > 0))
            }
        },
        data() {
            return {
                searchName: '',
                searchTime: [],
                selectData: [],
                dialogVisible: false,
                useDefaultConfig: true,
                currentWritId: null
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.selectData = val;
            },
            handleSearch() {
                this.$refs['overallWritList'].loadWrits();
            },
            handleRefresh() {
                this.searchName = '';
                this.searchTime = [];
                this.$refs['overallWritList'].refreshWrits();
            },

            handleTest(writId) {
                this.currentWritId = writId;
                this.dialogVisible = true;
            },

            handleSubmit() {
                this.currentWritId = null;
                this.dialogVisible = false;
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    .tool-container {
        display: flex;
        justify-content: center;
        flex-direction: row;

        .search-container {
            display: flex;
            justify-content: center;
            min-width: @projectMinWidth;

            & > div {
                margin-right: 10px;
            }
            .input-searcher {
                width: 220px !important;
            }
            .date-searcher {
                width: 355px !important;
                /*很奇怪，清空功能开启会出问题*/
                /deep/ .close-icon {
                    display: none;
                }
            }
        }

        .tool-button-container {
            .my-badge, .my-upload {
                margin-left: 10px;
            }
        }
    }

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
    }

    @media screen and (max-width: 1000px) {
        .center-view-body {
            margin-top: @navHeight+@reportHeaderMargin*2+10px+40px+40px+15px !important;
        }

        .tool-container {
            flex-direction: column;
        }

        .tool-button-container {
            margin-top: 15px;
        }
    }

    .dialog-body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .default-config-switch-container{
        font-weight: bolder;
        width: 400px;
        padding-left: 1rem;
        padding-right: 1rem;
        margin-bottom: 1rem;
    }
</style>