<template>
    <div>
        <update-exam @updateTable="updateTable"></update-exam>
        <exam-detail :actionstatus="'edit'"></exam-detail>
    </div>
</template>
<script>
    import UpdateExam from "./updateexam";
    import ExamDetail from "./partial/index";
    export default {
        components: {
            UpdateExam, ExamDetail
        },
        methods: {
            updateTable(){
                this.$emit("updateTable");
            }
        },

    }
</script>