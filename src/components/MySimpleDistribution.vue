<template lang="pug">
    div(ref="line" style="width: 480px; height:480px;")
</template>

<script>
    import echarts from 'echarts'

    const minStr = '最小值';
    const maxStr = '最大值';
    const avgStr = '平均值';

    export default {
        name: "MySimpleDistribution",
        props: {
            title: {
                type: String,
                required: true
            },
            rawData: {
                type: Object,
                required: true
            }
        },
        beforeMount() {
            this.option.title.text = this.title;
            let xAxis = this.option.xAxis[0];
            xAxis.data = this.rawData && this.rawData.x_axis_data ? this.rawData.x_axis_data : [];
            xAxis.axisLabel.interval = xAxis.data.length <= 8 ? 0 : 'auto';
            xAxis.axisLabel.show = xAxis.data.length <= 8;
            const series = this.rawData && this.rawData.series ? this.rawData.series : [];
            let legend_data = [];
            series.forEach(item => {
                item.name && legend_data.push(item.name);
                item.type || (item.type = 'bar');
                item.data || (item.data = []);
                item.markPoint = {
                    data: [
                        {type: 'max', name: maxStr},
                        {type: 'min', name: minStr}
                    ]
                };
                item.markLine = {
                    data: [
                        {type: 'average', name: avgStr}
                    ]
                }
            });
            this.option.legend.data = legend_data;
            this.option.series = series;
        },
        async mounted() {
            await this.$nextTick();
            const radar = this.$refs['line'];
            const chart = echarts.init(radar);
            chart.setOption(this.option);
            chart.on('click', ({name, seriesIndex}) => {
                if (/(\d{4})?年/.test(name)) {
                    const year = RegExp.$1;
                    this.$emit('year-click', year);
                    return;
                }
                if(seriesIndex===0) {
                    if (name === maxStr) {
                        this.$emit('max-click');
                        return;
                    }
                    if (name === minStr) {
                        this.$emit('min-click');
                        return;
                    }
                    if (name === avgStr) {
                        this.$emit('avg-click', seriesName);
                    }
                }
            });
        },
        data() {
            return {
                option: {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: [],
                            axisLabel: {
                                show: true,
                                interval: 'auto'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: []
                }
            }
        }
    }
</script>

<style scoped lang="less">

</style>