<template lang="pug">
    //表的总min-width应该等于project-max-width（见global.less）
    el-table.my-writ-or-task-table(v-scrollable.el-table :data="tasks" v-loading="loading" height="70%" max-height="600" border stripe)
        //总的min-width加上最右侧的gutter应当比projectMinWidth还小一些
        el-table-column(prop="id" label="任务id" min-width="45" align="center")
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
        el-table-column(label="操作"  min-width="80" align="center")
            template(v-slot="{row, $index}")
                div(v-if="row.status==='waiting'||row.status==='ongoing'")
                    //row必须有fetching属性才行，下面用了map的方法。其实这里有个tricky的方法：row.fetching===undefined?false&&(row.fetching=false):row.fetching
                    el-button.my-button(icon="el-icon-sort" :loading="row.fetching" @click="updateStatus(row.id, $index)") 更新状态
                div(v-if="row.status==='finished'")
                    el-button.my-button(icon="el-icon-view" type="success" @click="checkTaskResult(row.id)") 查看结果
                div(v-if="row.status==='failed'")
                    el-button.my-button(icon="el-icon-document-delete" disabled) 检测失败
</template>

<script>
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
            }
        },
        async beforeMount() {
            //结构参数需要传一个空对象，否则会undefined.undefined
            if (this.preLoad) {
                this.loadTasks();
            }
        },
        data() {
            return {
                statusTable: {
                    waiting: '等待检测',
                    ongoing: '在检测中',
                    finished: '检测完成',
                    failed: '检测失败',
                },
                loading: false,
                tasks: []
            }
        },
        methods: {
            async updateStatus(taskId, index) {
                this.tasks[index].fetching = true;
                const status = await this.$api.getTaskStatus(taskId);
                if (status) {
                    this.$message.success({message: `${taskId}号任务状态为"${this.statusTable[status]}"`, duration: 1500});
                    this.tasks[index].status = status;
                }
                this.tasks[index].fetching = false;
            },
            async handleLoad(nameStr, startDate, endDate) {
                this.loading = true;
                const data = await this.$api.getTasks({nameStr, startDate, endDate});
                if (data) {
                    data.forEach(item => item.fetching = false);
                    this.tasks = data;
                }
                this.loading = false;
            },
            loadTasks() {
                this.handleLoad(this.nameStr, this.startDate, this.endDate)
            },
            refreshTasks() {
                this.handleLoad();
            },
            checkTaskResult(writId) {
                this.$router.push(`task-report/${writId}`);
            },

        }
    }
</script>