<template>
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
</template>

<script>
    import VTable from "@/components/Table";
    export default {
        name: "studentassign.vue",
        props: ["examstudents"],
        components: {
            VTable
        },
    }
</script>

<style scoped>

</style>