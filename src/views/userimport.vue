<template>
    <div>
        <Loading v-if="loading"></Loading>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <card>
                    <label class="typo__label">Dosya Seçin</label>
                    <input type="file" id="file" ref="file" accept=".xlsx,.csv" v-on:change="handleFileUpload()"/>

                <base-button type="success" @click="save"
                >Yükle
                </base-button>
            </card>
        </base-header>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import appPlugin from "../plugins/appPlugin";
    import Loading from "../components/Loading";
    export default {
        computed:{
            ...mapGetters({errmessage: "errmessage", successmessage: "successmessage"})
        },
        components: {
            Loading
        },
        data(){
            return {
                loading: false,
                file:null,
            }
        },
        methods:{
            async handleFileUpload(){
                this.file = await this.$refs.file.files[0];
            },
            async save() {
                this.loading = true;
                const formData = new FormData();
                formData.append(`file`, this.file);
                const result = await this.$store.dispatch("userImport", formData);
                if(result){
                    this.loading= false;
                    appPlugin.showalert("Başarılı", this.successmessage, "success", "Tamam")
                } else {
                    this.loading= false;
                    appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                }
            }
        }
    }
</script>