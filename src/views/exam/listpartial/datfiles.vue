<template>
    <div>
        <div v-for="(item, i) in  files" :key="i">
            {{item.path}}
            <a :href="item.path">İndşir</a>
            <base-button @click="down(item)">İndir</base-button>
        </div>
    </div>
</template>

<script>
    import * as axios from "axios";

    export default {
        name: "datfiles",
        data(){
            return {
                files: [],
            }
        },
        methods:{
            down(item){
                axios.post("/downexamdatfiles", {path:item.path}, {responseType: 'arraybuffer'})
                    .then(response => {
                        console.log(response);
                        this.forceFileDownload(response)

                    })
                    .catch(() => console.log('error occured'))
            },
            forceFileDownload(response){
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'file.dat') //or any other extension
                document.body.appendChild(link)
                link.click()
            },
        },
        async created() {
            axios.post("/getexamdatfiles", {id: 65}).then(res=>{
                this.files = res.data;
            })
        }
    }
</script>

<style scoped>

</style>