<template lang="pug">
    //表的总min-width应该等于project-max-width（见global.less）
    div.my-table-container
        el-table.my-writ-or-task-table(:data="tasks" v-loading="loading" height="60%" border stripe)
            //总的min-width加上最右侧的gutter应当比projectMinWidth还小一些
            el-table-column(prop="id" label="任务id" min-width="70" align="center" fixed)
            //这里name是标题
            el-table-column(prop="title" label="任务名称" min-width="145")
            el-table-column(label="上传时间" min-width="140")
                template(slot-scope="scope") {{scope.row.time.toLocaleString()}}
            el-table-column(prop="length" label="任务数量"  min-width="80")
            el-table-column(label="任务状态" min-width="80" align="center")
                template(v-slot="{row}")
                    div(v-if="row.status==='waiting'")
                        el-tag(type="info")
                            i.el-icon-folder-opened
                            span {{statusTable[row.status]}}
                    div(v-if="row.status==='ongoing'")
                        el-tag(type="info")
                            i.el-icon-loading
                            span {{statusTable[row.status]}}
                    div(v-if="row.status==='finished'")
                        el-tag(type="success")
                            i.el-icon-success
                            span {{statusTable[row.status]}}
                    div(v-if="row.status==='failed'")
                        el-tag(type="danger")
                            i.el-icon-error
                            span {{statusTable[row.status]}}
            el-table-column(label="操作"  min-width="80" align="center" fixed="right")
                template(v-slot="{row, $index}")
                    div(v-if="row.status==='waiting'||row.status==='ongoing'")
                        //row必须有fetching属性才行，下面用了map的方法。其实这里有个tricky的方法：row.fetching===undefined?false&&(row.fetching=false):row.fetching
                        el-button.my-button(icon="el-icon-sort" :loading="row.fetching" @click="updateStatus(row.id, $index)") 更新状态
                    div(v-if="row.status==='finished'")
                        el-button.my-button(icon="el-icon-view" type="success" @click="checkTaskResult(row.id)") 查看结果
                    div(v-if="row.status==='failed'")
                        el-button.my-button(icon="el-icon-document-delete" disabled) 检测失败
        el-pagination.my-pagination(
        @current-change="handleChangePage"
        @size-change="loadTasks"
        :disabled="loading"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
</template>

<script>
    const pageSizes = [30, 50, 100];
    import {taskStatusTable} from "@/utils/infoUtil";
    /*
    waiting: 任务中，等待检测
    ongoing: 检测中，等待结果
    finished: 检测完成，查看结果
    failed: 检测失败
     */
    export default {
        name: "MyTaskList",
        props: {
            preLoad: {
                type: Boolean,
                default: true
            },
            nameStr: {
                type: String,
                default: null
            },
            startDate: {
                type: Date,
                default: null
            },
            endDate: {
                type: Date,
                default: null
            },
            status: {
                type: String,
                default: null
            }
        },
        beforeMount() {
            //结构参数需要传一个空对象，否则会undefined.undefined
            if (this.preLoad) {
                this.loadTasks();
            }
        },
        data() {
            return {
                statusTable: taskStatusTable,
                loading: false,
                tasks: [],
                currentPage: 1,
                pageSizes,
                pageSize: pageSizes[0],
                total: 0,
            }
        },
        methods: {
            async updateStatus(taskId, index) {
                this.tasks[index].fetching = true;
                const status = await this.$api.getTaskStatus(taskId);
                if (status) {
                    this.$message.info({message: `${taskId}号任务状态为"${this.statusTable[status]}"`, duration: 1500});
                    this.tasks[index].status = status;
                }
                this.tasks[index].fetching = false;
            },
            async handleLoad(nameStr, startDate, endDate, pageIndex, pageSize, status) {
                this.loading = true;
                const data = await this.$api.getTasks({nameStr, startDate, endDate, pageIndex, pageSize, status});
                if (data && data.result) {
                    data.result.forEach(item => {
                        item.fetching = false;
                        item.time = new Date(item.time);
                    });
                    this.tasks = data.result;
                    this.total = data.total || 0;
                }
                await this.$nextTick();
                this.loading = false;
            },
            async loadTasks() {
                if (!this.loading) {
                    this.loading = true;
                    this.currentPage = 1;
                    await this.handleLoad(this.nameStr, this.startDate, this.endDate, this.currentPage, this.pageSize, this.status);
                } else {
                    this.$message.warning('请在加载结束后再检索');
                }
            },
            async handleChangePage() {
                if (!this.loading) {
                    await this.handleLoad(this.nameStr, this.startDate, this.endDate, this.currentPage, this.pageSize, this.status);
                }
            },
            async refreshTasks() {
                if (!this.loading) {
                    this.loading = true;
                    this.currentPage = 1;
                    this.pageSize = pageSizes[0];
                    await this.handleLoad();
                } else {
                    this.$message.warning('请在加载结束后再刷新');
                }
            },
            checkTaskResult(writId) {
                this.$router.push(`/resources/task-report/${writId}`);
            },

        }
    }
</script>