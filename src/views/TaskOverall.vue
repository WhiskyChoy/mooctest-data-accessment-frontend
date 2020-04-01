<template lang="pug">
    //下面的内容和TaskOverall重复很多，但为了快速做出第一个原型，就先算了
    div.center-view-container
        div.center-view-header
            h1.center-view-title 我创建的任务
            div.tool-container
                div.search-container
                    el-input.input-searcher(v-model="searchName" prefix-icon="el-icon-edit-outline" clearable placeholder="任务名称（部分）")
                    el-date-picker.date-searcher(v-model="searchTime" type="datetimerange" :clearable="false" start-placeholder="开始时间" end-placeholder="结束时间")
                div.tool-button-container
                    div.long
                        el-button(type="primary" icon="el-icon-search" @click="handleSearch" :disabled="noMsg")
                        el-button(type="primary" icon="el-icon-refresh" @click="handleRefresh")
                    div.short
                        el-button(type="primary" icon="el-icon-search" @click="handleSearch" :disabled="noMsg") 查找任务
                        el-button(type="primary" icon="el-icon-refresh" @click="handleRefresh") 刷新所有
        div.center-view-body
            my-task-list(ref="overallTaskList" :name-str="searchName" :start-date="searchTime[0]" :end-date="searchTime[1]")

</template>

<script>
    import MyTaskList from "@/components/MyTaskList";
    export default {
        name: "TaskOverall",
        components: {MyTaskList},
        computed: {
            noMsg() {
                return !(this.searchName || (this.searchTime && this.searchTime.length > 0))
            }
        },
        data() {
            return {
                searchName: '',
                searchTime: [],
            }
        },
        methods: {
            handleSearch() {
                this.$refs['overallTaskList'].loadTasks();
            },
            handleRefresh() {
                this.searchName = '';
                this.searchTime = [];
                this.$refs['overallTaskList'].refreshTasks();
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
        .short {
            display: none;
        }
    }

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px !important;
    }

    @media screen and (max-width: 1000px), screen and (orientation : portrait){
        .center-view-body {
            margin-top: @navHeight+@reportHeaderMargin*2+10px+40px+40px+15px !important;
        }

        .tool-container {
            flex-direction: column;
        }

        .tool-button-container {
            margin-top: 15px;
        }

        .tool-button-container{
            .short {
                display: block;
            }
            .long{
                display: none;
            }
        }
    }
</style>