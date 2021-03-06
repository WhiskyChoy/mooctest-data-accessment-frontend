<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 我上传的文书
            div.tool-container
                div.search-container
                    el-input.input-searcher(v-model="searchName" prefix-icon="el-icon-edit-outline" clearable placeholder="文书名称（部分）" @keyup.enter.native="handleSearch" @clear="handleSearch")
                    el-date-picker.date-searcher(v-model="searchTime" type="datetimerange" :clearable="false" start-placeholder="开始时间" end-placeholder="结束时间" @change="handleSearch")
                    el-select.status-searcher( v-model="searchStatus" placeholder="按状态筛选" @change="handleSearch" clearable)
                        el-option(v-for="item of options" :key="item.value" :label="item.label" :value="item.value")
                div.tool-button-container
                    el-button-group
                        el-button(type="primary" size="small" icon="el-icon-search" @click="handleSearch" :disabled="noMsg||loading")
                        el-button(size="small" icon="el-icon-refresh" @click="handleRefresh" :disabled="loading")
                        el-button(size="small" icon="el-icon-upload2" @click="handleUpload")
                    el-badge.my-badge(:value="selectData.length" :hidden="selectData.length===0" :max="maxBadgeNum")
                        el-button-group
                            el-button.my-check-select(@click="handleCheckSelect" :disabled="selectData.length===0" size="small" icon="el-icon-view")
                            el-button(:disabled="selectData.length===0" @click="handleCreateTask" size="small") 创建任务
        div.center-view-body
            my-writ-list(ref="overallWritList"
            :status="searchStatus"
            @handle-test="handleTest"
            @selection-change="handleSelectionChange"
            :name-str="searchName"
            :start-date="searchTime[0]"
            :end-date="searchTime[1]")
        //设置:modal-append-to-body="false" :append-to-body="true" 这样dialog插入body，modal插入dialog的父元素（其实就是两者平级在body）
        el-dialog(v-draggable title="提交前的配置" :visible.sync="dialogSubmitVisible" center :modal-append-to-body="false" :append-to-body="true" top="6vh")
            div.dialog-body
                el-input.task-title-container(v-if="submitType===SUBMIT_TYPE.TASK" placeholder="请输入任务名称" v-model="title" prefix-icon="el-icon-edit-outline" clearable)
                el-row(:gutter="10").default-config-switch-container
                    el-col(:span="18")
                        label.my-label 使用默认配置
                    el-col(:span="6")
                        el-switch(v-model="useDefaultConfig")
                my-config(v-if="!useDefaultConfig" ref="writConfig")
            div(slot="footer")
                el-button(@click="dialogSubmitVisible=false") 取消
                el-button(type="primary" @click="handleSubmit" :disabled="submitType===SUBMIT_TYPE.TASK&&!title") 提交
        el-dialog(v-draggable title="已选择的文书" :visible.sync="dialogSelectVisible" center :modal-append-to-body="false" :append-to-body="true" top="6vh")
            div.dialog-body
                my-select-writ-list(:result="batchSelectData" :total="selectData.length" ref="selectWritList" @update-result="updateResult" @remove-select="removeSelect")

</template>

<script>
    import MyWritList from "@/components/MyWritList";
    import MyConfig from "@/components/MyConfig";
    import MySelectWritList from "@/components/MySelectWritList";
    import {writStatusList} from "@/utils/infoUtil";

    const SUBMIT_TYPE = {
        SINGLE: 'single',
        TASK: 'task'
    };

    export default {
        name: "WritOverall",
        components: {MySelectWritList, MyConfig, MyWritList},
        computed: {
            noMsg() {
                return !(this.searchName || (this.searchTime && this.searchTime.length > 0) || this.searchStatus)
            }
        },
        data() {
            return {
                maxBadgeNum: 99,
                searchName: '',
                searchTime: [],
                selectData: [],
                batchSelectData: [],
                dialogSubmitVisible: false,
                dialogSelectVisible: false,
                useDefaultConfig: true,
                currentWritId: null,
                currentWritIndex: null,
                submitType: SUBMIT_TYPE.TASK,
                title: '',
                SUBMIT_TYPE,
                options: writStatusList,
                searchStatus: null,
                loading: false
            }
        },
        methods: {
            updateResult(pageIndex, pageSize) {
                const start = (pageIndex - 1) * pageSize;
                this.batchSelectData = this.selectData.slice(start, start + pageSize)
            },
            removeSelect(acutalIndex) {
                this.$refs['overallWritList'].removeByIndex(acutalIndex);
            },
            async handleCheckSelect() {
                this.dialogSelectVisible = true;
                await this.$nextTick();
                this.$refs['selectWritList'].reset();
            },
            handleSelectionChange(val) {
                this.selectData = val;
            },
            async handleSearch() {
                await this.$nextTick();
                this.loading = true;
                await this.$refs['overallWritList'].loadWrits();
                this.loading = false;
            },
            async handleRefresh() {
                this.searchName = '';
                this.searchTime = [];
                await this.$nextTick();
                this.loading = true;
                await this.$refs['overallWritList'].refreshWrits();
                this.loading = false;
            },
            handleUpload() {
                this.$router.push('/resources/writ-upload');
            },
            handleTest(writId, $index) {
                this.currentWritId = writId;
                this.currentWritIndex = $index;
                this.dialogSubmitVisible = true;
                this.submitType = SUBMIT_TYPE.SINGLE;
            },
            handleCreateTask() {
                this.submitType = SUBMIT_TYPE.TASK;
                this.dialogSubmitVisible = true;
            },
            handleSubmit() {
                if (this.submitType === SUBMIT_TYPE.SINGLE) {
                    this.handleSubmitSingle();
                }
                if (this.submitType === SUBMIT_TYPE.TASK) {
                    this.handleSubmitTask();
                }
            },
            async handleSubmitSingle() {
                const config = this.useDefaultConfig ? undefined : this.$refs['writConfig'].getSendConfig();
                const useDefault = this.useDefaultConfig;
                const writId = this.currentWritId;
                let received = await this.$api.postWritReport({useDefault, config, writId});
                if (received) {
                    this.$message.success({message: `已提交，等待生成${writId}号文书报告`, duration: 1500});
                    this.$refs['overallWritList'].changeStatus(this.currentWritIndex, 'waiting');
                    this.currentWritId = null;
                    this.currentWritIndex = null;
                }
                this.dialogSubmitVisible = false;
            },
            getSendWrits() {
                let result = [];
                this.selectData.forEach(item => result.push(item.id));
                return result;
            },
            async handleSubmitTask() {
                const title = this.title;
                const useDefault = this.useDefaultConfig;
                const config = this.useDefaultConfig ? undefined : this.$refs['writConfig'].getSendConfig();
                const writs = this.getSendWrits();
                let received = await this.$api.postTask({title, useDefault, config, writs});
                if (received) {
                    this.$message.success({message: `已提交任务`, duration: 1500});
                    this.selectData.forEach(item => item.status = "waiting");
                    this.$refs['overallWritList'].clearSelection();
                }
                this.dialogSubmitVisible = false;
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    .tool-container {
        display: flex;
        justify-content: center;
        align-items: center;
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
            .status-searcher {
                width: 150px !important;
            }
        }

        .tool-button-container {
            .my-badge{
                margin-left: 10px;
                /deep/ .el-badge__content {
                    z-index: 1 !important;
                }
            }
        }
    }

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
    }

    @media screen and (max-width: 1200px), screen and (orientation: portrait) {
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

    .default-config-switch-container {
        font-weight: bolder;
        width: 400px;
        padding-left: 1rem;
        padding-right: 1rem;
        margin-bottom: 1rem;
    }

    .task-title-container {
        width: 400px;
        margin-bottom: 1rem;
    }
</style>