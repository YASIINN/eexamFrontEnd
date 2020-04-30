<template>
    <div>
        <Loading v-if="loading"/>
            <card>
                <slot name="header">
                    <p>Sınav Güncelleme</p>
                </slot>
                <div class="row">
                    <div class="col-md-12">
                        <card>
                            <div class="row">
                                <div class="col-md-4">
                                    <label class="typo__label">Sınav Adı</label>
                                    <base-input placeholder="Sınava bir ad verin" v-model="examModel.name"></base-input>
                                </div>
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
                                <div class="col-md-2">
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
                                <div class="col-md-2">
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
                            <br>
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
    import TimeInput from "../../components/TimeInput";
    import flatPicker from "vue-flatpickr-component";
    import "flatpickr/dist/flatpickr.css";
    import { Turkish } from 'flatpickr/dist/l10n/tr.js';
    import {mapGetters} from "vuex";
    export default {
        computed: {
            ...mapGetters({
                errmessage: "errmessage", successmessage: "successmessage",
               examModel: "exam"}),
        },
        async created() {
            this.loading = false;
        },
        data() {
            return {
                updateMode: true,
                loading: true,
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
                }
                else {
                    this.examModel.checkExam = this.examModel.school_id + ''+ this.examModel.class_id +
                        ''+this.examModel.examDate + '' + this.examModel.beginHour + '' + this.examModel.endHour;
                    let payload = {
                        id: this.examModel.id,
                        name: this.examModel.name,
                        examDate: this.examModel.examDate,
                        beginHour: this.examModel.beginHour,
                        endHour: this.examModel.endHour,
                        checkExam: this.examModel.checkExam
                    };
                    const result = await this.$store.dispatch("updateExam", payload);
                    if(result){
                        appPlugin.showalert("Başarılı", this.successmessage, "success", "Tamam");
                        this.$emit("updateTable");
                    } else {
                        appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam")
                    }
                }
                this.loading = false;
            }
        },
        components: {
            Loading, TimeInput, flatPicker
        }
    };
</script>
<style></style>
