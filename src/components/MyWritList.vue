<template lang="pug">
    //表的总min-width应该等于project-max-width（见global.less）
    el-table.my-writ-or-task-table(ref="myWritTable" :data="writs" v-loading="loading" height="70%" @selection-change="handleSelectionChange" border stripe)
        //总的min-width加上最右侧的gutter应当比projectMinWidth还小一些
        el-table-column(v-if="!taskId" type="selection" :selectable="checkSelectable" min-width="40" align="center" fixed)
        el-table-column(prop="id" label="文书id" min-width="70" align="center" fixed)
        //这里name是标题
        el-table-column(prop="title" label="文书标题" :min-width="taskId?165:125")
        el-table-column(label="上传时间" min-width="120")
            template(slot-scope="scope") {{scope.row.time.toLocaleString()}}
        el-table-column(prop="length" label="文书长度"  min-width="80")
        el-table-column(label="文书状态" min-width="80" align="center")
            template(v-slot="{row}")
                div(v-if="row.status==='untested'")
                    el-tag
                        i.el-icon-question
                        span {{statusTable[row.status]}}
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
                div(v-if="row.status==='wrong'")
                    el-tag(type="danger")
                        i.el-icon-error
                        span {{statusTable[row.status]}}
                div(v-if="row.status==='accident'")
                    el-tag(type="warning")
                        i.el-icon-warning
                        span {{statusTable[row.status]}}
        el-table-column(label="操作"  min-width="80" align="center" fixed="right")
            template(v-slot="{row, $index}")
                div(v-if="row.status==='untested'")
                    el-button.my-button(icon="el-icon-s-promotion" @click="handleTest(row.id, $index)") 单独检测
                div(v-if="row.status==='waiting'||row.status==='ongoing'")
                    //row必须有fetching属性才行，下面用了map的方法。其实这里有个tricky的方法：row.fetching===undefined?false&&(row.fetching=false):row.fetching
                    el-button.my-button(icon="el-icon-sort" :loading="row.fetching" @click="updateStatus(row.id, $index)") 更新状态
                div(v-if="row.status==='finished'")
                    el-button.my-button(icon="el-icon-view" type="success" @click="checkSingleResult(row.id)") 查看结果
                div(v-if="row.status==='wrong'")
                    el-button.my-button(icon="el-icon-document-delete" disabled) 无法查看
                div(v-if="row.status==='accident'")
                    el-button.my-button(icon="el-icon-refresh" @click="handleTest(row.id, $index)") 重新检测
</template>

<script>
    /*
    untested: 未检测，单独检测
    waiting: 任务中，等待检测
    ongoing: 检测中，等待结果
    finished: 检测完成，查看结果
    wrong: 解析错误
    accident: 意外中断，点击重试
     */
    export default {
        name: "MyWritList",
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
            taskId: {
                type: String,
                default: null
            }
        },
        async beforeMount() {
            //结构参数需要传一个空对象，否则会undefined.undefined
            if (this.preLoad) {
                this.loadWrits();
            }
        },
        data() {
            return {
                statusTable: {
                    untested: '尚未检测',
                    waiting: '等待检测',
                    ongoing: '在检测中',
                    finished: '检测完成',
                    wrong: '解析错误',
                    accident: '意外中断',
                },
                loading: false,
                writs: []
            }
        },
        methods: {
            async updateStatus(writId, index) {
                this.writs[index].fetching = true;
                const status = await this.$api.getWritStatus(writId);
                if (status) {
                    this.$message.success({message: `${writId}号文书状态为"${this.statusTable[status]}"`, duration: 1500});
                    this.writs[index].status = status;
                }
                this.writs[index].fetching = false;
            },
            async handleLoad(nameStr, startDate, endDate, taskId) {
                this.loading = true;
                const data = await this.$api.getWrits({nameStr, startDate, endDate, taskId});
                if (data) {
                    data.forEach(item => item.fetching = false);
                    this.writs = data;
                }
                await this.$nextTick();
                this.loading = false;
            },
            loadWrits() {
                this.handleLoad(this.nameStr, this.startDate, this.endDate, this.taskId)
            },
            refreshWrits() {
                this.handleLoad();
            },
            checkSingleResult(writId) {
                const url = `/resources/writ-report/${writId}`;
                if (this.taskId) {
                    const protocol = location.protocol;
                    const host = location.host;
                    const prefix = protocol + '//' + host;
                    open(prefix + url, "_blank");
                } else {
                    this.$router.push(url);
                }
            },
            handleSelectionChange(val) {
                this.$emit('selection-change', val)
            },
            checkSelectable(row) {
                return row.status === 'untested' || row.status === 'accident'
            },
            handleTest(writId, $index) {
                this.$emit('handle-test', writId, $index);
            },
            clearSelection() {
                this.$refs['myWritTable'].clearSelection();
            },
            changeStatus($index, status) {
                this.writs[$index].status = status;
            }
        }
    }
</script>