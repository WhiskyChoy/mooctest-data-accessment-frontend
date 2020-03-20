<template lang="pug">
    div.center-view-container
        div.center-view-header
            h1.center-view-title 上传新文书
            div.tool-container
                el-button(@click="handleClear" icon="el-icon-refresh") 清空
                el-button(@click="handleUpload" type="primary" :loading="loading" icon="el-icon-upload2") 提交
                div.my-switch-container
                    label.my-label-replace 替换同名文件
                    el-switch(v-model="replace")
        div.center-view-body
            el-upload.my-upload(action="" ref="myUpload" drag multiple v-scrollable.el-upload :auto-upload="false"
            :on-change="handleChange" :http-request="httpRequest" :on-error="handleError"
            accept="text/xml, application/xml, application/zip, application/x-zip-compressed")
                i.el-icon-upload
                div 将zip/xml文件拖至此处，或 #[em.upload-click 点此上传]

</template>

<script>

    const getFileIndex = (file, fileList) => {
        //新加入的追加到最后一个了，要-1
        for (let i = 0; i < fileList.length - 1; i++) {
            const item = fileList[i];
            if (file.raw.name === item.raw.name) {
                return i;
            }
        }
        return -1;
    };

    //如果传入方法是属性不能用@，要用:
    export default {
        name: "WritUpload",
        methods: {
            handleClear() {
                this.$refs['myUpload'].clearFiles();
            },
            handleUpload() {
                this.$refs['myUpload'].submit();
            },
            handleError(e, file) {
                const rawFile = file.raw;
                const fileName = rawFile.name;
                this.handleMsg(`上传文件“${fileName}”失败`, 'error')
            },
            handleMsg(message, type = 'info') {
                const duration = 3500;
                //一定要this.msgPromise = XXX才有用，这样后调用的才会.then接到后面
                //Promise.then().then()和Promise.then(); Promise.then();是不一样的，前者是真串行
                this.msgPromise = this.msgPromise.then(() => {
                    this.$message({message, type, duration});
                });
            },
            handleChange(file, fileList) {
                //这表示是添加行为
                if (file.status === 'ready') {
                    let myFile = file.raw;

                    const type = myFile.type.toLowerCase();
                    const isXML = type === 'text/xml' || type === 'application/xml';
                    const isZip = type === 'application/zip' || type === 'application/x-zip-compressed';
                    if (!(isXML || isZip)) {
                        fileList.pop();
                        this.handleMsg('上传的文件格式不正确', 'error');
                        // 无论是不是增加新文件都更新长度信息
                        return;
                    }

                    const fileIndex = getFileIndex(file, fileList);
                    if (fileIndex >= 0) {
                        if (this.replace) {
                            const oldFileRawStatus = fileList[fileIndex].status;
                            const suggestion = oldFileRawStatus === 'success' ? '已提交，覆盖后需重新上传' : '重复，已覆盖该文件';
                            fileList[fileIndex] = file;
                            fileList.pop();
                            this.handleMsg(`文件“${myFile.name}”${suggestion}`);
                        } else {
                            fileList.pop();
                            this.handleMsg(`文件“${myFile.name}”重复，未覆盖该文件`);
                        }
                        // 下面的代码无法这么做，因为允许一次上传多个，如果多次重复的话不好进行多次阻塞，考虑用一个switch
                        // const msg = '该文档已存在，是否覆盖';
                        // const title = '提示';
                        // const options = {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        // };
                        // this.$confirm(msg, title, options).then(() => {
                        //     fileList[fileIndex] = file;
                        //     cancelAdd(fileList);
                        //     this.$message.info({message: '已覆盖', duration: 1500});
                        // }).catch(() => {
                        //     cancelAdd(fileList);
                        //     this.$message.info({message: '已取消覆盖', duration: 1500});
                        // });

                        //如果 if (fileIndex >= 0)后有下个if，这里要提前return
                    }
                }
            },
            async httpRequest({file, onProgress, onSuccess, onError}) {
                let received = await this.$api.postWrit({file, onProgress});
                if (received) {
                    onSuccess();
                } else {
                    onError();
                }
            }

        },
        data() {
            return {
                loading: false,
                replace: true,
                //这是一个专用队列
                //用异步方法的话要递归await，反而不清晰了，不是什么时候都适用的
                msgPromise: Promise.resolve(),
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/global";

    .center-view-body {
        margin-top: @navHeight+@reportHeaderMargin*2+10px+40px+40px !important;
    }

    .upload-click {
        color: dodgerblue;
    }

    .upload-tip {
        overflow: hidden;
        text-align: center;
        color: gray;
    }

    .tool-container .my-switch-container {
        margin-top: 1rem;
        .my-label-replace {
            color: gray;
            margin-right: 1rem;
        }
    }

    @media screen and (min-width: 800px) {
        .my-upload {
            display: flex;
            flex-direction: row;
        }
    }

    .my-upload /deep/ .upload-list-container {
        position: relative;
        height: 180px;
    }

    //防止X被滚动条挡道了按不到
    .my-upload /deep/ ul li [class^=el-icon-upload], .my-upload /deep/ ul li .el-icon-close {
        margin-right: 1rem;
    }
</style>