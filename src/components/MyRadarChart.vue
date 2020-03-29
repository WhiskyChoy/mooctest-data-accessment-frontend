<template lang="pug">
    div(ref="radar" style="width: 480px; height:480px;")
</template>

<script>
    import echarts from 'echarts'

    const tranform = (arr) => {
        let indicator = [];
        let value = [];
        for (let item of arr) {
            indicator.push({
                name: item['metric'],
                max: item['total']
            });
            value.push(item['score'])
        }
        return {indicator, value}
    };

    export default {
        name: "MyRadarChart",
        props: {
            rawArr: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            legend: {
                type: String,
                required: true
            }
        },
        beforeMount() {
            this.option.title.text = this.title;
            this.option.legend.data = [this.legend];
            const {indicator, value} = tranform(this.rawArr);
            this.option.radar.indicator = indicator;
            this.option.series[0].data = [{
                value,
                name: this.legend
            }];
        },
        async mounted() {
            await this.$nextTick();
            const radar = this.$refs['radar'];
            const chart = echarts.init(radar);
            chart.setOption(this.option);
        },
        data() {
            return {
                option: {
                    title: {
                        text: ''
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data: []
                    },
                    radar: {
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: []
                    },
                    series: [{
                        type: 'radar',
                        data: [
                            {
                                value: [],
                                name: ''
                            }
                        ]
                    }]
                }
            }
        }
    }
</script>

<style scoped lang="less">

</style>