<template lang="pug">
    div.home
        HelloWorld(msg="Welcome to the home page!")
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'Home',
        components: {
            HelloWorld
        }
    }
</script>
