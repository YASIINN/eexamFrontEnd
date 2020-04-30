<template>
    <div class="row">
        <Loading v-if="loading"/>
        <card>
            <base-alert v-if="dbexam.groupusers && dbexam.groupusers.length === 0" type="warning">
                <span class="alert-inner--icon"><i class="ni ni-like-2"></i></span>
                <span class="alert-inner--text"><strong>Uyarı!</strong>
                        Bu sınavın öğrenci-grup ataması aşağıdaki gibi olacaktır. Kontrol ettikten sonra listenin sonunda <strong>Öğrenci Grup Atamasını Onayla!</strong>
                        butonuna tıklayarak atamayı kaydedebilirsiniz.
                    </span>
            </base-alert>
            <v-table
                    :columns="[
                       {
                name: 'Öğrenci',
                display: 'name'
          },
             {
                name: 'Okul',
                display: 'school'
             },
             {
                name: 'Sınıf',
                display: 'class'
          }, {
                name: 'Şube',
                display: 'branch'
             },
             {
                name: 'Grup Ataması',
                display: 'g_name'
             }
          ]"
                    :rows="examstudents"
                    :table-title="[
                       {
                name: 'Öğrenci',
                display: 'name'
          },
             {
                name: 'Okul',
                display: 'school'
          },
             {
                name: 'Sınıf',
                display: 'class'
          }, {
                name: 'Şube',
                display: 'class'
             },
             {
                name: 'Grup Ataması',
                display: 'g_name'
             }
          ]"

            ></v-table>
            <div v-if="actionstatus != 'detail'">
                <base-button v-if="dbexam.groupusers && dbexam.groupusers.length > 0" type="danger" class="float-right"
                             @click="removeGroupUser">Atamayı Sil
                </base-button>
                <base-button v-if="dbexam.groupusers && dbexam.groupusers.length === 0" type="success" class="float-right"
                             @click="save">Öğrenci Grup Atamasını Onayla
                </base-button>
            </div>
        </card>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
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
            ...mapGetters({exam:"exam", dbexam: "dbexam", examstudents: "examstudents", errmessage: "errmessage", successmessage: "successmessage"})
        },
        components: {
            VTable, Loading
        },
        data(){
            return {
                loading: true,
                studentgroups: [],
                exist: false,
            }
        },
        async created() {
            await this.onrefreshPage();
        },
        methods: {
            async onrefreshPage(){
                await this.$store.dispatch("fetchDbExam", {id: this.exam.id});
                console.log(this.dbexam);
                if(this.dbexam.groupusers.length === 0 ) {
                    if (this.dbexam.groups.length > 0 && this.dbexam.partials.length > 0) {
                        const query = {
                            exam_id: this.exam.id,
                            school_id: this.exam.school_id,
                            class_id: this.exam.class_id,
                            branch_id: this.exam.branch.name == '-' ? 0 : this.exam.branch.id,
                        }
                        let result = await this.$store.dispatch("fetchStudentsExamList", query);
                        if (!result) {
                            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                        }

                    } else {
                        this.$store.commit("setExamStudents", []);
                        appPlugin.showalert("Uyarı", "Bu işlem için, sınava öncelikle bölüm ve grup eklemeniz gerekmektedir.", "warning", "Tamam")
                    }
                } else {
                    this.$store.commit("setExamStudents", this.dbexam.groupusers);
                }
                this.loading = false;
            },
            async save(){
                if(this.actionstatus === 'detail'){
                    appPlugin.showalert("Uyarı", "Bu sınav yapıldığı için değişiklik yapılamaz.", "warning", "Tamam")
                } else {
                    this.loading = true;
                    const payload = this.examstudents.map(es => ({
                        user_id: es.id,
                        exam_group_id: es.exam_group_id
                    }))
                    const result = await this.$store.dispatch("createUserExamGroup", payload);
                    if (result) {
                        appPlugin.showalert("Başarılı", this.successmessage, "success", "Tamam")
                        if(this.actionstatus === 'create'){
                            await this.$store.commit("setDbExam", {});
                            this.$router.push({name: "exams"})
                        } else {
                            await this.onrefreshPage();
                        }
                    } else {
                        appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                    }
                    this.loading = false;
                }
            },
            removeGroupUser(){
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
                                let groups = this.dbexam.groupusers.map(gu=>({
                                    id: gu.exam_group_id,
                                }))
                                let result = await this.$store.dispatch("deleteExamGroupUser", groups);
                                if(!result){
                                    appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                                } else {
                                    await this.onrefreshPage();
                                }
                                this.loading = false;
                            }
                        });
                }

            }
        },
    }
</script>