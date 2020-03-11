<template lang="pug">
    span(v-if="sequence")
        span.my-gradient-text(v-for="item of sequence" :style="getBackground(item.startVal, item.endVal)") {{item.char}}
</template>

<script>
    const HSL_MAX = {
        H: 360,
        S: 100,
        L: 100,
    };

    const L_VISUAL_MAX = HSL_MAX.L / 2;

    const getSequence = (sentence, sentenceStartVal, sentenceEndVal) => {
        let sequence = [];
        const chars = sentence.split('');
        const length = chars.length;
        const delta = (sentenceEndVal - sentenceStartVal) / length;
        for (let i = 0; i < length; i++) {
            let char = chars[i];
            let startVal = sentenceStartVal + i * delta;
            let endVal = sentenceStartVal + (i + 1) * delta;
            sequence.push({char, startVal, endVal})
        }
        return sequence;
    };

    export default {
        name: "MySentenceColorGradient",
        props: {
            sentence: {
                type: String,
                required: true
            },
            startVal: {
                type: Number,
                required: true
            },
            endVal: {
                type: Number,
                required: true
            },
            hVal:{
                type: Number,
                default: 0
            }
        },
        beforeMount() {
            this.sequence = getSequence(this.sentence, this.startVal, this.endVal)
        },
        methods: {
            getBackground(startVal, endVal){
                return `background: linear-gradient(to right, hsl(${this.hVal}, 100%, ${startVal * L_VISUAL_MAX}%), hsl(${this.hVal}, 100%, ${endVal * L_VISUAL_MAX}%))`
            }
        },
        data() {
            return {
                sequence: null
            }
        }
    }
</script>

<style scoped lang="less">
    .my-gradient-text {
        text-transform: uppercase;
        -webkit-background-clip:text!important;
        -webkit-text-fill-color: transparent;
    }
</style>