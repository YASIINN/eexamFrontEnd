<template>
   <card class="row">
       <tabs fill class="flex-column flex-md-row">
           <card shadow>
               <tab-pane @getId="getId" :id="1" title="Sınav Bölümleri">
                   <add-chapter  v-if="currentTab === 1" :actionstatus="actionstatus"></add-chapter>
               </tab-pane>

               <tab-pane @getId="getId" :id="2" title="Sınav Grup ve Dosyaları">
                   <add-group-file v-if="currentTab === 2" :actionstatus="actionstatus"></add-group-file>
               </tab-pane>


               <tab-pane @getId="getId" :id="3" title="Öğrenci Atama">
                   <assign-student v-if="currentTab === 3" :actionstatus="actionstatus"></assign-student>
               </tab-pane>


               <tab-pane v-if="actionstatus === 'detail'" @getId="getId" :id="4" title="Veri Dosyası">
                   <dat-files v-if="currentTab === 4"></dat-files>
               </tab-pane>
           </card>
       </tabs>
   </card>
</template>
<script>
    import AddChapter from "./addchapter";
    import AddGroupFile from "./addgroupandfile";
    import AssignStudent from "./assignstudent";
    import DatFiles from "./datfiles";
    export default {
        props: {
            actionstatus : {
                type: String,
                default: 'create',
            }
        },
        components: {
            AddChapter, AddGroupFile, AssignStudent, DatFiles
        },
        data(){
            return {
                currentTab: 1,
            }
        },
        methods: {
            getId(id){
                this.currentTab = id;
            }
        }
    }
</script>