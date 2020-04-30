<template>
    <card>
        <multiselect v-model="search" :options="[{name: 'Tamamlanmıs Sınavlar', status: 1}, {name: 'Tamamlanmamış Sınavlar', status: 0}]" label="name" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
    </card>
</template>
<script>
    import Multiselect from 'vue-multiselect'
    export default {
         components: {
             Multiselect
         },
        watch: {
             search(){
                 this.$emit("filterExam", this.search.status)
             }
        },
        data(){
            return {
                search: {name: 'Tamamlanmıs Sınavlar', status: 1},
            }
        }
    }
</script>
