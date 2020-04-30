<template>
    <div>
        <Loading v-if="loading"/>
        <card>
            <slot name="header">
                <p>Sınav Güncelleme</p>
            </slot>
            <div class="row">
                <div class="col-md-6">
                    <card>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="typo__label">Sınav Adı</label>
                                <base-input placeholder="Sınava bir ad verin" v-model="examModel.name"></base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="typo__label">Soru Sayısı</label>
                                <multiselect v-model="examModel.qCount" :options="getQCount" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                            <div class="col-md-6">
                                <label class="typo__label">Seçenek Sayısı</label>
                                <multiselect v-model="examModel.optCount" :options="[3,4,5]" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-4">
                                <label>Sınav Tarihi</label>
                                <time-input addon-left-icon="ni ni-calendar-grid-58">
                                    <flat-picker slot-scope="{focus, blur}"
                                                 @on-open="focus"
                                                 @on-close="blur"
                                                 :config="config"
                                                 class="form-control datepicker"
                                                 v-model="examModel.examDate">
                                    </flat-picker>
                                </time-input>
                            </div>
                            <div class="col-md-4">
                                <label>Başlama Saati</label>
                                <time-input addon-left-icon="ni ni-calendar-grid-58">
                                    <flat-picker slot-scope="{focus, blur}"
                                                 @on-open="focus"
                                                 @on-close="blur"
                                                 :config="configHour"
                                                 class="form-control datepicker"
                                                 v-model="examModel.beginHour">
                                    </flat-picker>
                                </time-input>
                            </div>
                            <div class="col-md-4">
                                <label>Bitiş Saati</label>
                                <time-input addon-left-icon="ni ni-calendar-grid-58">
                                    <flat-picker slot-scope="{focus, blur}"
                                                 @on-open="focus"
                                                 @on-close="blur"
                                                 :config="configHour"
                                                 class="form-control datepicker"
                                                 v-model="examModel.endHour">
                                    </flat-picker>
                                </time-input>
                            </div>

                        </div>
                    </card>
                </div>
                <div class="col-md-6">
                    <card>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="typo__label">Sınav Türü</label>
                                <multiselect v-model="examModel.exam_type" :options="examtypes" label="name" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                            <div v-if="examModel.exam_type.id === 5 || examModel.exam_type.id === 6 || examModel.exam_type.id === 7" class="col-md-6">
                                <label class="typo__label">Ders </label>
                                <multiselect v-model="examModel.lesson" :options="lessons" label="name" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                        </div>
                        <br>
                        <div>
                            <label class="typo__label">Okul</label>
                            <multiselect v-model="examModel.school" :options="getFilterSchool" label="name" :searchable="true" :allow-empty="false"  placeholder="Seç"></multiselect>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="typo__label">Sınıf</label>
                                <multiselect :disabled="classes.length == 0" v-model="sclass" label="name" :options="classes" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                            <div class="col-md-6">
                                <label class="typo__label">Şube</label>
                                <multiselect :disabled="branches.length == 0" v-model="sbranch" label="name" :options="branches" :searchable="true" :allow-empty="false" placeholder="Seç"></multiselect>
                            </div>
                        </div>


                    </card>
                </div>
            </div>
            <base-button type="success" class="float-right"
                         @click="save">Güncelle
            </base-button>
        </card>
    </div>
</template>
<script>
    import Loading from "@/components/Loading";
    import appPlugin from "@/plugins/appPlugin";
    import Multiselect from 'vue-multiselect'
    import TimeInput from "../../components/TimeInput";
    import flatPicker from "vue-flatpickr-component";
    import "flatpickr/dist/flatpickr.css";
    import { Turkish } from 'flatpickr/dist/l10n/tr.js';
    import {mapGetters} from "vuex";
    import _ from "lodash";
    export default {
        computed: {
            ...mapGetters({examtypes: "getExamType", scblists: "scblists",
                errmessage: "errmessage", successmessage: "successmessage",
                lessons: "getLessons", allbranches:"getBranches", examModel: "exam"}),
            getQCount(){
                let qCount = [];
                for (let i = 10; i <= 150; i += 5) {
                    qCount.push(i);
                }
                return qCount;
            },
            getFilterSchool(){
                return this.scblists.map(scb=>({
                    id: scb.id,
                    name: scb.name
                }));
            },
        },
        watch: {
            "examModel.lesson"(){
                this.examModel.lesson_id = this.examModel.lesson.id;
            },
            "examModel.school"(){
                this.sclass = {}
                this.sbranch = {};
                this.loading = true;
                const school= this.scblists.find(scb=>scb.id ===this.examModel.school.id);
                this.classes = school.classes.map(cb=>({
                    id: cb.id,
                    name: cb.name
                }));
                this.examModel.school_id = school.id;
                this.loading = false;
            },
            sclass(){
                if(!_.isEmpty(this.sclass)){

                    this.loading = true;
                    const school = this.scblists.find(scb=>scb.id ===this.examModel.school.id);
                    const classes = school.classes.find(cb=>cb.id ===this.sclass.id);
                    this.branches = classes.branches.map(cb=>({
                        id: cb.id,
                        name: cb.name
                    }))
                    this.examModel.class = this.sclass;
                    this.examModel.class_id = this.sclass.id;
                    this.loading = false;
                }
            },
            "sbranch"(){
                if(!_.isEmpty(this.sbranch)) {
                    this.examModel.branch = this.sbranch;
                    this.examModel.branch_id = this.examModel.branch.id;
                }
            },
        },
        async created() {
            await this.$store.dispatch("fetchExamType");
            await this.$store.dispatch("fetchSCBLists");
            await this.$store.dispatch("fetchLesson");
            await this.$store.dispatch("fetchBranches");
            this.sclass = this.examModel.class;
            this.sbranch = this.examModel.branch;
            const school= this.scblists.find(scb=>scb.id ===this.examModel.school.id);
            this.classes = school.classes.map(cb=>({
                id: cb.id,
                name: cb.name
            }));
            this.loading = false;
        },
        mounted() {
            this.sbranch = this.examModel.branch;
        },
        data() {
            return {
                updateMode: false,
                loading: true,
                date: null,
                sclass: {},
                sbranch: {},
                classes: [],
                branches: [],
                startHour:'10:00',
                configHour: {
                    enableTime: true,
                    locale: Turkish,
                    noCalendar: true,
                    dateFormat: 'H:i',
                    time_24hr: true
                },
                config: {
                    locale: Turkish,
                    minDate: "today",
                    dateFormat: 'Y-m-d',
                },
            };
        },
        methods: {
            async save(){
                this.loading = true;
                if (this.examModel.name.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Sınav Adı Giriniz", "warning", "Tamam")
                } else if (this.examModel.class_id === 0) {
                    appPlugin.showalert("Uyarı", "Lütfen Sınıf Seçimi Yapınız.", "warning", "Tamam")
                } else {
                    if (this.examModel.branch_id === 0) {
                        const branch = this.allbranches.find(l=>l.name === '-');
                        this.examModel.branch_id = branch.id;
                        this.examModel.branch = branch;
                    }
                    if (this.examModel.lesson_id === 0) {
                        const lesson = this.lessons.find(l=>l.name === '-');
                        this.examModel.lesson_id = lesson.id;
                        this.examModel.lesson = lesson;
                    }

                    this.examModel.checkExam = this.examModel.school_id + ''+ this.examModel.class_id +
                        ''+this.examModel.examDate + '' + this.examModel.beginHour + '' + this.examModel.endHour;
                    console.log(this.examModel);
                    this.examModel.exam_type_id = this.examModel.exam_type.id;
                    const result = await this.$store.dispatch("createExam", this.examModel);
                    if(result){
                        appPlugin.showalert("Başarılı", this.successmessage, "success", "Tamam")
                    } else {
                        appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                    }
                }
                this.loading = false;
            }
        },
        components: {
            Loading, Multiselect, TimeInput, flatPicker
        }
    };
</script>
<style></style>
