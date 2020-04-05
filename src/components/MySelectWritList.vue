<template lang="pug">
    div.my-table-container
        el-table.my-select-writ-table(:data="result" v-loading="loading" height="60%" border stripe)
            //总的min-width加上最右侧的gutter应当比projectMinWidth还小一些
            el-table-column(prop="id" label="文书id" min-width="70" align="center" fixed)
            //这里name是标题
            el-table-column(prop="title" label="文书文件名" min-width="165")
            el-table-column(label="上传时间" min-width="120")
                template(v-slot="{row}") {{row.time.toLocaleString()}}
            el-table-column(prop="length" label="文书长度"  min-width="80")
            el-table-column(label="操作"  min-width="100" align="center" fixed="right")
                template(v-slot="{$index}")
                    el-button(@click="removeSelect($index)" type="text") 取消选择
        el-pagination.my-pagination(
        @current-change="handleChangePage"
        @size-change="handleChangeSize"
        :disabled="loading"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
</template>

<script>
    const pageSizes = [30, 50, 100];

    export default {
        name: "MySelectWritList",
        props: {
            result: {
                type: Array,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                currentPage: 1,
                pageSizes,
                pageSize: pageSizes[0],
                loading: false
            }
        },
        methods: {
            handleChangePage() {
                if (!this.loading) {
                    this.handleChange();
                }
            },
            handleChangeSize() {
                this.loading = true;
                this.currentPage = 1;
                this.handleChange();
            },
            async handleChange() {
                this.loading = true;
                this.$emit('update-result', this.currentPage, this.pageSize);
                await this.$nextTick();
                this.loading = false;
            },
            removeSelect(index) {
                const actualIndex = (this.currentPage - 1) * this.pageSize + index;
                this.$emit('remove-select', actualIndex);
                this.handleChange();
            },
            reset() {
                this.loading = true;
                this.currentPage = 1;
                this.pageSize = pageSizes[0];
                this.handleChange();
            }
        },
        watch: {
            result: {
                handler: function (val) {
                    //长度为0了就退回到上一页
                    if (val.length === 0 && this.currentPage > 1) {
                        this.loading = true;
                        this.currentPage -= 1;
                        this.handleChange();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="less">
    .my-table-container {
        width: 100%;

        .my-select-writ-table {
            min-height: 450px;
            max-height: 450px;
            margin-bottom: 1rem;
        }

        .my-pagination {
            display: flex;
            justify-content: center;
        }
    }
</style>