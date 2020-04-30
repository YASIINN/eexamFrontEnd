<template>
    <div class="row">
        <Loading v-if="loading"/>
        <card v-if="dbexam.files && dbexam.files.length === 0" class="col-md-12">
            <slot name="header">
                <base-alert type="info">
                    <span class="alert-inner--icon"><i class="ni ni-like-2"></i></span>
                    <span class="alert-inner--text"><strong>Bilgi!</strong>
                        Bu sınavın veri dosyasını <strong>Sınavın Veri Dosyasını Oluştur!</strong>
                        butonuna tıklayarak oluşturabilirsiniz.
                    </span>
                </base-alert>
                <base-button type="success" class="float" @click="createDatFile"
                >Sınavın Veri Dosyasını Oluştur
                </base-button>
            </slot>
        </card>
        <card v-if="dbexam.files && dbexam.files.length > 0">
            <base-alert type="success">
                <span class="alert-inner--icon"><i class="ni ni-like-2"></i></span>
                <span class="alert-inner--text"><strong>Bilgi!</strong>
                       Bu sınava ait veri dosyasını<strong>Veri Dosyasını İndir!</strong>
                        butonuna tıklayarak indirebilirsiniz.
                    </span>
            </base-alert>
            <div v-for="(item, i) in  dbexam.files" :key="i">
                <base-button type="success" class="float-left" @click="down(item)"
                >Veri Dosyasını İndir
                </base-button>
                <base-button type="danger" class="float-left" @click="removeDatFile(item)"
                >Veri Dosyasını Sil
                </base-button>
            </div>

        </card>
    </div>
</template>

<script>
    import * as axios from "axios";
    import {mapGetters} from "vuex";
    import Loading from "../../../components/Loading";
    import appPlugin from "../../../plugins/appPlugin";
    export default {
        name: "datfiles",
        computed: {
            ...mapGetters({exam: "exam", dbexam: "dbexam"}),
        },
        components: {
            Loading,
        },
        data(){
            return {
                files: [],
                loading: true,
            }
        },
        methods:{
            down(item){
                axios.post("/downexamdatfiles", {path:item.path}, {responseType: 'arraybuffer'})
                    .then(response => {
                        this.forceFileDownload(response)
                    })
                    .catch(() => console.log('error occured'))
            },
            forceFileDownload(response){
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `sinav${this.dbexam.name}.dat`) //or any other extension
                document.body.appendChild(link)
                link.click()
            },
            async createDatFile(){
                this.loading = true;
                const result = await this.$store.dispatch("createExamDatFiles", {id: this.dbexam.id});
                if(result){
                    await this.$store.dispatch("fetchDbExam", {id: this.exam.id});

                }
                this.loading = false;
            },
            removeDatFile(item){
                appPlugin
                    .showConfirm(
                        "Datayı silmek üzeresiniz. Bu veri dosyasını tekrar oluşturabilirsiniz."
                    )
                    .then(async res => {
                        if (res.value) {
                            this.loading = true;
                            let result = await this.$store.dispatch(
                                "removeExamDatFiles",
                                {id: item.id}
                            );
                            if (!result) {
                                appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
                            } else {
                                await this.$store.dispatch("fetchDbExam", {id: this.exam.id});
                            }
                            this.loading = false;
                        }
                    });
            },
        },
        async created() {
            await this.$store.dispatch("fetchDbExam", {id: this.exam.id});
            this.loading = false;
        }
    }
</script>

<style scoped>

</style>