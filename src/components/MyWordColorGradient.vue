<template lang="pug">
    span(:class="myClassName" ref="my-span" :style="getAdditionalStyle(startVal,endVal)") {{char}}

</template>

<script>
    import {supportCSSNew} from "@/utils/cssChecker";

    const HSL_MAX = {
        H: 360,
        S: 100,
        L: 100,
    };

    const L_VISUAL_MAX = HSL_MAX.L / 2;


    export default {
        name: "MyWordColorGradient",
        computed:{
          myClassName(){
              return this.showAdvance?'my-gradient-text-advance':'my-gradient-text-normal'
          }
        },
        props: {
            char: {
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
            hVal: {
                type: Number,
                default: 0
            },
            showAdvance: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            getAdditionalStyle(startVal, endVal) {
                let result;
                if (this.showAdvance && supportCSSNew('color', 'transparent') && supportCSSNew('background-clip', 'text')) {
                    result = `background: linear-gradient(to right, hsl(${this.hVal}, 100%, ${startVal * L_VISUAL_MAX}%), hsl(${this.hVal}, 100%, ${endVal * L_VISUAL_MAX}%));`;
                } else {
                    result = `color:hsl(${this.hVal}, 100%, ${(startVal + endVal) / 2 * L_VISUAL_MAX}%)`
                }
                return result;
            }
        },
    }
</script>

<style scoped>
    @supports (color:transparent) and ((background-clip: text) or (-webkit-background-clip: text) or (-ms-background-clip: text) or (-o-background-clip: text) or (-moz-background-clip: text)) {
        .my-gradient-text-advance {
            -webkit-background-clip: text !important;
            -moz-background-clip: text !important;
            -o-background-clip: text !important;
            -ms-background-clip: text !important;
            background-clip: text !important;
            color: transparent;
        }
    }

    .my-gradient-text-normal{
        -webkit-background-clip: unset;
        -moz-background-clip: unset;
        -o-background-clip: unset;
        -ms-background-clip: unset;
        background-clip: unset;
        background: none;
    }
</style>