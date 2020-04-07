<template lang="pug">
    //下面的内容和TaskOverall重复很多，但为了快速做出第一个原型，就先算了
    div.center-view-container
        div.center-view-header
            h1.center-view-title 我创建的任务
            div.tool-container
                div.search-container
                    el-input.input-searcher(v-model="searchName" prefix-icon="el-icon-edit-outline" clearable placeholder="任务名称（部分）"  @keyup.enter.native="handleSearch" @clear="handleSearch")
                    el-date-picker.date-searcher(v-model="searchTime" type="datetimerange" :clearable="false" start-placeholder="开始时间" end-placeholder="结束时间" @change="handleSearch")
                    el-select.status-searcher( v-model="searchStatus" placeholder="按状态筛选" @change="handleSearch" clearable)
                        el-option(v-for="item of options" :key="item.value" :label="item.label" :value="item.value")
                div.tool-button-container
                    div.long
                        el-button(type="primary" icon="el-icon-search" @click="handleSearch" :disabled="noMsg||loading")
                        el-button(type="primary" icon="el-icon-refresh" @click="handleRefresh" :disabled="loading")
                    div.short
                        el-button(type="primary" icon="el-icon-search" @click="handleSearch" :disabled="noMsg||loading") 查找任务
                        el-button(type="primary" icon="el-icon-refresh" @click="handleRefresh" :disabled="loading") 刷新所有
        div.center-view-body
            my-task-list(ref="overallTaskList" :name-str="searchName" :start-date="searchTime[0]" :end-date="searchTime[1]" :status="searchStatus")

</template>

<script>
    import MyTaskList from "@/components/MyTaskList";
    import {taskStatusList} from "@/utils/infoUtil";

    export default {
        name: "TaskOverall",
        components: {MyTaskList},
        computed: {
            noMsg() {
                return !(this.searchName || (this.searchTime && this.searchTime.length > 0) || this.searchStatus)
            }
        },
        data() {
            return {
                searchName: '',
                searchTime: [],
                options: taskStatusList,
                searchStatus: null,
                loading: false
            }
        },
        methods: {
            async handleSearch() {
                await this.$nextTick();
                this.loading = true;
                await this.$refs['overallTaskList'].loadTasks();
                this.loading = false;
            },
            async handleRefresh() {
                this.searchName = '';
                this.searchTime = [];
                this.status = null;
                await this.$nextTick();
                this.loading = true;
                await this.$refs['overallTaskList'].refreshTasks();
                this.loading = false;
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    //同样的，下面的内容和TaskOverall重复很多

    .tool-container {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;

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
        .short {
            display: none;
        }
    }

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
    }

    @media screen and (max-width: 1000px), screen and (orientation: portrait) {
        .center-view-body {
            margin-top: @navHeight+@reportHeaderMargin*2+10px+40px+40px+15px !important;
        }

        .tool-container {
            flex-direction: column;
        }

        .tool-button-container {
            margin-top: 15px;
        }

        .tool-button-container {
            .short {
                display: block;
            }
            .long {
                display: none;
            }
        }
    }
</style>