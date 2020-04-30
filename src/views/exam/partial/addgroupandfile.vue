<template>
    <div class="row">
        <Loading v-if="loading"/>
        <card v-if="actionstatus != 'detail'" class="col-md-6">
            <slot name="header">
                <p>Sınav Grup Oluştur</p>
            </slot>
            <div class="row">
                <div class="col-md-6">
                    <label class="typo__label">Grup Seçin</label>
                    <multiselect
                            v-model="groupfileModel.group"
                            :options="groups"
                            :searchable="true"
                            label="name"
                            :allow-empty="false"
                            placeholder="Seç"
                    ></multiselect>
                </div>
                <div class="col-md-6" v-if="view">
                    <label class="typo__label">Dosya Seçin</label>
                    <input type="file" id="file" ref="file" accept="application/pdf" v-on:change="handleFileUpload()"/>
                </div>
            </div>
            <br />
            <base-button type="success" class="float-right" @click="save"
            >Ekle
            </base-button>
        </card>
        <card class="col-md-6">
            <slot name="header">
                <p>Sınav Grup ve Dosyaları Listesi</p>
            </slot>
            <v-table
                    :del-visible="true"
                    @delClick="deleteClick($event)"
                    :down-visible="true"
                    :columns="[
             {
                name: 'Grup Adı',
                display: 'group_name'
          },
           {
                name: '',
             display: ''
        }
          ]"
                    :rows="egroupfilelists"
                    :table-title="[
             {
                name: 'Grup Adı',
                display: 'group_name'
           },
           {
                name: '',
              display: ''
        }
          ]"

            ></v-table>
        </card>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import groupfileModel from "../../../store/models/groupfileModel";
    import Multiselect from "vue-multiselect";
    import appPlugin from "../../../plugins/appPlugin";
    import VTable from "@/components/Table";
    import Loading from "../../../components/Loading";
    export default {
        props: {
            actionstatus : {
                type: String,
                default: 'create',
            }
        },
        computed: {
            ...mapGetters({ groups: "getGroups", errmessage: "errmessage",
                exam: "exam", egroupfilelists: "egroupfilelists"})
        },
        components: {
            Multiselect, VTable, Loading
        },
        async created() {
            await this.$store.dispatch("fetchGroups");
            await this.$store.dispatch("fetchExamGroupFileLists", {id: this.exam.id});
            this.groupfileModel.group = this.groups[0];
            this.loading = false;
        },

        methods: {
            resetData(){
                this.view = false;
                setTimeout(()=>{
                    this.view = true;
                }, 100)
                this.groupfileModel.file =null;
                this.groupfileModel.file_path = "";
                this.groupfileModel.file_id = 0;
            },
            async handleFileUpload(){
                this.groupfileModel.file = await this.$refs.file.files[0];
            },
            async save() {
                if(this.actionstatus === 'detail'){
                    appPlugin.showalert("Uyarı", "Bu sınav yapıldığı için değişiklik yapılamaz.", "warning", "Tamam")

                } else {
                    this.loading = true;
                    this.groupfileModel.exam_id = this.exam.id;
                    if (!this.groupfileModel.file) {
                        appPlugin.showalert("Uyarı", "Sınav dosyası seçilmedi.", "warning", "Tamam")
                    } else if (this.groupfileModel.exam_id == 0) {
                        appPlugin.showalert("Uyarı", "Bölüm bir sınıfa bağlı olmalıdır.", "warning", "Tamam")
                    } else {
                        this.groupfileModel.group_id = this.groupfileModel.group.id;
                        const formData = new FormData();
                        formData.append(`file`, this.groupfileModel.file);
                        await this.$store.dispatch("saveGroupFileImage", formData);
                        this.groupfileModel.qCount = this.exam.qCount;
                        let result = await this.$store.dispatch("createExamGroupFile", this.groupfileModel);
                        if (!result) {
                            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                        }
                        this.resetData();

                    }
                    this.loading = false;
                }
            },
            deleteClick(row) {
                if(this.actionstatus === 'detail'){
                    appPlugin.showalert("Uyarı", "Bu sınav yapıldığı için değişiklik yapılamaz.", "warning", "Tamam")

                } else {
                    appPlugin
                        .showConfirm(
                            "Datayı silmek üzeresiniz. Bu işlemi geri alamaszınız. Onaylıyor musunuz ?"
                        )
                        .then(async res => {
                            if (res.value) {
                                this.loading = true;
                                let result = await this.$store.dispatch("deleteExamGroupFile", row.item);
                                if (!result) {
                                    appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                                }
                                this.resetData();
                                this.loading = false;
                            }
                        });
                }

            }
        },
        data() {
            return {
                view: true,
                groupfileModel: groupfileModel,
                loading: true
            };
        }
    };
</script>
