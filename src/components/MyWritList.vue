<template lang="pug">
    //表的总min-width应该等于project-max-width（见global.less）
    div.my-table-container
        el-table.my-writ-or-task-table(ref="myWritTable" :data="writs" v-loading="loading" height="60%" border stripe)
            //总的min-width加上最右侧的gutter应当比projectMinWidth还小一些
            // debug de了半天，原来是type="selection"没删掉
            el-table-column(v-if="!taskId" min-width="40" align="center" fixed)
                template(slot="header" slot-scope="scope")
                    el-checkbox(:indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange")
                template(v-slot="{row,$index}")
                    el-checkbox(v-model="row.checked" @change="(val)=>{handleCheck(getWrit($index),val);handleSelectionChange()}" :disabled="!selectable(row)")
            el-table-column(prop="id" label="文书id" min-width="70" align="center" fixed)
            //这里name是标题
            el-table-column(prop="title" label="文书文件名" :min-width="taskId?165:125")
            el-table-column(label="上传时间" min-width="120")
                template(v-slot="{row}") {{row.time.toLocaleString()}}
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
        el-pagination.my-pagination(
        @current-change="handleChangePage"
        @size-change="loadWrits"
        :disabled="loading"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
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
    import {getBaseURL} from "@/utils/urlUtil";
    import {writStatusTable} from "@/utils/infoUtil";

    const pageSizes = [30, 50, 100];

    class WritSet {
        constructor() {
            this.writs = []
        }

        indexOf(writ) {
            for (let i = 0; i < this.writs.length; i++) {
                let item = this.writs[i];
                if (item.id === writ.id) {
                    return i;
                }
            }
            return -1;
        }

        add(writ) {
            if (this.indexOf(writ) === -1) {
                this.writs.push(writ);
                return true;
            }
            return false;
        }

        remove(writ) {
            let index = this.indexOf(writ);
            if (index !== -1) {
                this.writs.splice(index, 1);
                return true;
            }
            return false;
        }

        getWrits() {
            return this.writs;
        }

        clear() {
            this.writs = [];
        }

        removeByIndex(index) {
            if (index < this.writs.length) {
                this.writs[index].checked = false;
                this.writs.splice(index, 1);
                return true;
            }
            return false;
        }

        getByIndex(index) {
            if (index < this.writs.length) {
                return this.writs[index];
            }
        }
    }

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
            },
            status: {
                type: String,
                default: null
            }
        },
        beforeMount() {
            //结构参数需要传一个空对象，否则会undefined.undefined
            if (this.preLoad) {
                this.loadWrits();
            }
        },
        data() {
            return {
                statusTable: writStatusTable,
                loading: false,
                writs: [],
                checkedCache: new WritSet(),
                checkAll: false,
                isIndeterminate: false,
                checkedCounter: 0,
                currentPage: 1,
                pageSizes,
                pageSize: pageSizes[0],
                total: 0,
                fromPage: true
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.writs.forEach(item => {
                    this.handleCheck(item, val)
                });
                this.isIndeterminate = this.checkedCounter > 0 && this.checkedCounter < this.writs.length;
                this.handleSelectionChange();
            },
            getWrit(index) {
                return this.writs[index]
            },
            handleCheck(writ, val) {
                if (this.selectable(writ)) {
                    if (writ.checked !== val) {
                        writ.checked = val;
                    }
                    if (val) {
                        this.checkedCache.add(writ) && this.checkedCounter++;
                    } else {
                        this.checkedCache.remove(writ) && this.checkedCounter--;
                    }
                    this.checkAll = this.checkedCounter === this.writs.length;
                    this.isIndeterminate = this.checkedCounter > 0 && this.checkedCounter < this.writs.length;
                }
            },
            removeByIndex(index) {
                this.checkedCache.removeByIndex(index) && this.checkedCounter--;
                this.checkAll = this.checkedCounter === this.writs.length;
                this.isIndeterminate = this.checkedCounter > 0 && this.checkedCounter < this.writs.length;
                this.handleSelectionChange();
            },
            async updateStatus(writId, index) {
                this.writs[index].fetching = true;
                const status = await this.$api.getWritStatus(writId);
                if (status) {
                    this.$message.info({message: `${writId}号文书状态为"${this.statusTable[status]}"`, duration: 1500});
                    this.writs[index].status = status;
                }
                this.writs[index].fetching = false;
            },
            async handleLoad(nameStr, startDate, endDate, taskId, pageIndex, pageSize, status) {
                this.loading = true;
                const data = await this.$api.getWrits({nameStr, startDate, endDate, taskId, pageIndex, pageSize, status});
                if (data && data.result) {
                    let tempCounter = 0;
                    for (let i = 0; i < data.result.length; i++) {
                        let item = data.result[i];
                        const index = this.checkedCache.indexOf(item);
                        const found = index !== -1;
                        if (found) {
                            let original = this.checkedCache.getByIndex(index);
                            //找到了就更新cache状态，置为cache里的
                            original.status = item.status;
                            original.fetching = item.fetching || false;
                            data.result[i] = original;
                            tempCounter++;
                        } else {
                            item.checked = false;
                            item.fetching = false;
                        }
                        item.time = new Date(item.time);
                    }
                    this.writs = data.result;
                    this.checkedCounter = tempCounter;
                    this.total = data.total || 0;
                    this.checkAll = this.checkedCounter === this.writs.length;
                    this.isIndeterminate = this.checkedCounter > 0 && this.checkedCounter < this.writs.length;
                }
                await this.$nextTick();
                this.loading = false;
            },
            async loadWrits() {
                if(!this.loading) {
                    this.loading = true;
                    this.currentPage = 1;
                    await this.handleLoad(this.nameStr, this.startDate, this.endDate, this.taskId, this.currentPage, this.pageSize, this.status);
                }else{
                    this.$message.warning('请在加载结束后再检索');
                }
            },
            async handleChangePage() {
                if (!this.loading) {
                    await this.handleLoad(this.nameStr, this.startDate, this.endDate, this.taskId, this.currentPage, this.pageSize, this.status);
                }
            },
            async refreshWrits() {
                if(!this.loading) {
                    this.loading = true;
                    this.currentPage = 1;
                    this.pageSize = pageSizes[0];
                    await this.handleLoad();
                }else{
                    this.$message.warning('请在加载结束后再检索');
                }
            },
            checkSingleResult(writId) {
                const url = `/resources/writ-report/${writId}`;
                if (this.taskId) {
                    open(getBaseURL() + url, "_blank");
                } else {
                    this.$router.push(url);
                }
            },
            handleSelectionChange() {
                this.$emit('selection-change', this.checkedCache.getWrits())
            },
            selectable(row) {
                return row.status === 'untested' || row.status === 'accident';
            },
            handleTest(writId, $index) {
                this.$emit('handle-test', writId, $index);
            },
            clearSelection() {
                this.checkedCache.clear();
                this.handleSelectionChange();
            },
            changeStatus($index, status) {
                this.writs[$index].status = status;
            },
        }
    }
</script>