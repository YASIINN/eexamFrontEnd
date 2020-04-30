<template>
    <div>
        <Loading v-if="loading"></Loading>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        <search @filterExam="getFilter"></search>
        </base-header>
        <div class="container-fluid mt--7">
            <card>
                <exam-list @getExam="getExam" :search="search"></exam-list>
            </card>
        </div>

        <br> <br> <br> <br> <br> <br>
        <div class="container-fluid mt--7">
            <base-alert v-if="title != ''" type="info">
                <span class="alert-inner--icon"><i class="ni ni-like-2"></i></span>
                <span class="alert-inner--text"><strong>Uyarı!</strong>
                    {{views.edit ? 'Düzenlenen Sınav Bilgisi ' : 'Seçilen Sınav Bilgisi'}}: {{title}}
                    </span>
            </base-alert>
            <card v-if="views.detail">
                <exam-detail :actionstatus="'detail'"></exam-detail>
            </card>
            <card v-if="views.edit">
                <edit-exam @updateTable="updateTable"></edit-exam>
            </card>
<!--            <card v-if="views.edit">-->
<!--                <exam-detail :actionstatus="'edit'"></exam-detail>-->
<!--            </card>-->
        </div>

    </div>
</template>
<script>
    import ExamList from "../lists/examlist";
    import Search from "./partial/search";
    import {mapGetters} from "vuex";
    import appPlugin from "../../plugins/appPlugin";
    import Loading from "../../components/Loading";
    import ExamDetail from "./partial/index";
    import EditExam from "./editexam";
    export default {
        computed: {
            ...mapGetters({examstudents: "examstudents", errmessage: "errmessage", successmessage: "successmessage"}),
        },
        data(){
            return {
                loading: false,
                search: 1,
                title: "",
                refs: null,
                views: {
                    detail: false,
                    edit:false,
                }
            }
        },
        methods: {
            getFilter(status){
                this.search = status;
                this.views.detail = false;
                this.views.edit = false;
                this.title = "";
            },
            updateTable(){
                this.refs.vuetable.refresh();
            },
            async assignToModel(exam){
                let payload = {
                    id: exam.id,
                    name: exam.name,
                    optCount:exam.optCount,
                    qCount: exam.qCount,
                    school_id: exam.school_id,
                    class_id: exam.class_id,
                    beginHour:exam.beginHour,
                    endHour: exam.endHour,
                    examDate: exam.examDate,
                    exam_type: exam.examtype,
                    lesson:exam.lesson,
                    school: exam.school,
                    class: exam.class,
                    branch: exam.branch,
                };
                this.title = exam.name + ' - ' + exam.school.code + ' - ' + exam.class.code + ' - ' +
                    exam.examDate + ' - ' + exam.beginHour + ' - ' + exam.endHour;
                await this.$store.commit("setExamModel", payload);
            },
            async getExam(exam, type, refs){
                this.views = {
                    detail: false,
                    edit: false,
                };
                this.title = "";
                await this.assignToModel(exam);
                if(type === 'detail'){
                    this.views.detail = true;
                } else if(type === 'edit'){
                    this.views.edit = true;
                    this.refs = refs;
                }
                else if(type === 'delete'){
                    let result = await this.$store.dispatch("deleteExam", {id: exam.id})
                    if(result){
                        appPlugin.showalert("Başarılı", "Silme işlemi başarılıdır.", "success", "Tamam")
                        refs.vuetable.refresh();

                    } else {
                        appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                    }
                }
            },
            async save(){
                this.loading = true;
                const payload = this.examstudents.map(es=>({
                    user_id: es.id,
                    exam_group_id: es.exam_group_id
                }))
                const result = await this.$store.dispatch("createUserExamGroup", payload);
                if(result){
                    this.loading = false;
                    appPlugin.showalert("Başarılı", this.successmessage, "success", "Tamam")
                } else {
                    appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                }
            },
        },

        components: {
            Search, ExamList, Loading,ExamDetail, EditExam
        }
    };
</script>
<style></style>
