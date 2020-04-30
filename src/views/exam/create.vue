<template>
    <div>
        <Loading v-if="loading"></Loading>
        <add-exam></add-exam>
        <div v-if="exam.id > 0" class="container-fluid mt--7">
            <add-partial></add-partial>
        </div>

    </div>
</template>
<script>
    import AddExam from "./addexam";
    import AddPartial from "./partial/index";
    import {mapGetters} from "vuex";
    import moment from "moment";
    import Loading from "../../components/Loading";
    export default {
        computed: {
            ...mapGetters({exam: "exam"}),
        },
        data(){
            return {
                loading: true,
            }
        },
        async created() {
            const examModel = {
                id:0,
                name: "",
                optCount:4,
                qCount:10,
                beginHour:"10:00",
                endHour: "12:00",
                examDate: moment().format("YYYY-MM-DD"),
                exam_type_id:0,
                exam_type: {},
                lesson_id:0,
                lesson:{},
                school_id:0,
                school: {},
                class_id:0,
                class:{},
                branch_id:0,
                branch:{},
                beginDate: "",
                endDate:"",
                checkExam: "",
            }
            await this.$store.commit("setExamModel", examModel);
            this.loading = false;
        },
        components: {
            AddExam, AddPartial,Loading
        }
    };
</script>
<style></style>
