<template>
  <div>
    <Loading v-if="loading" />
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <card>
        <slot name="header">
          <p v-if="!starttime">Sınavlar</p>
        </slot>
        <section
          id="app"
          class="hero is-info is-fullheight is-bold"
          v-if="starttime"
        >
          <div class="hero-body">
            <div class="container has-text-centered">
              <h2 class="title is-6">{{ title }}</h2>

              <div id="timer">
                <span id="minutes">{{ minutes }}</span>
                <span id="middle">:</span>
                <span id="seconds">{{ seconds }}</span>
              </div>
            </div>
          </div>
        </section>
      </card>
    </base-header>

    <div class="container-fluid mt--7">
      <card>
        <slot name="header" v-if="!starttime">
          <p>Sınav Listesi</p>
        </slot>
        <div class="row">
          <div class="col">
            <table
              class="table table-hover table-striped table-bordered table-responsive"
              v-if="!starttime"
            >
              <thead>
                <th>Sınav Adı</th>
                <th>Sınav Türü</th>

                <th>Soru Sayısı</th>
                <th>Seçenek Sayısı</th>
                <th>Sınav Tarihi</th>
                <th>Sınav Başlama Saati</th>
                <th>Sınav Bitiş Saati</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(item, i) in userExamData">
                  <td>{{ item.eName }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.qCount }}</td>
                  <td>{{ item.optCount }}</td>
                  <td>{{ item.examDate | formatToday }}</td>
                  <td>{{ item.beginHour }}</td>
                  <td>{{ item.endHour }}</td>
                  <td>
                    <base-button size="sm" @click="checkExamDate(item)"
                      >Sınava Gir</base-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <h3
              class="text text-center text-black-50"
              v-if="userExamData.length < 1"
            >
              Bugun Sınav Yok
            </h3>
          </div>
        </div>
        <div class="row" v-if="starttime">
          <div class="col">
            <h3 class="text text-center">Sınav Bilgileri</h3>
            <p>Sınav Adı : {{ examDetail[0].examgroupuser[0].exam.name }}</p>
            <p>
              Seçenek Sayısı :
              {{ examDetail[0].examgroupuser[0].exam.optCount }}
            </p>
            <p>
              Soru Sayısı : {{ examDetail[0].examgroupuser[0].exam.qCount }}
            </p>
            <p>
              Sınav Türü :
              {{ examDetail[0].examgroupuser[0].exam.examtype.name }}
            </p>
            <p>
              Sınav Grubu : {{ examDetail[0].examgroupuser[0].groups.name }}
            </p>

            <p
              v-if="examDetail[0].examgroupuser[0].exam.exampartial.length < 1"
            >
              Ders Adı : {{ examDetail[0].examgroupuser[0].exam.lesson.name }}
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <p class="text text-center" v-if="examDetail.length > 0">
              “Sınavınızın yüklenmesi için kısa bir süre bekleyiniz.”
            </p>
            <div id="example1"></div>
          </div>
          <div
            class="col-lg-4 col-md-4 col-sm-4 anyClass"
            id="opticform"
            v-if="examDetail.length > 0"
          >
            <div
              class="row"
              v-for="(partial, p) in examDetail[0].examgroupuser[0].exam
                .exampartial"
              v-if="examDetail[0].examgroupuser[0].exam.exampartial.length > 0"
            >
              <div
                v-for="(item,
                i) in examDetail[0].examgroupuser[0].question.slice(
                  partial.startQ - 1,
                  partial.endQ
                )"
              >
                <div
                  class="col-lg-12 col-md-12 col-sm-12"
                  v-if="
                    examDetail[0].examgroupuser[0].exam.exampartial.length > 0
                  "
                >
                  <p v-if="i == 0" class="text text-center">
                    {{
                      examDetail[0].examgroupuser[0].exam.exampartial[p].chapter
                        .name
                    }}
                  </p>
                </div>
                <div class="form-check form-check-inline">
                  <p>{{ i + 1 }}</p>
                </div>
                <div
                  class="form-check form-check-inline ml-1"
                  v-for="(opt, j) in examOpt"
                >
                  <input
                    class="form-check-input"
                    type="radio"
                    @click="
                      onClickPartialsRadio(item, partial.startQ + i - 1, opt, j)
                    "
                    @change="onChangeOption(item, i, opt, j)"
                    v-model="
                      examDetail[0].examgroupuser[0].question[
                        partial.startQ + i - 1
                      ].qAnswer
                    "
                    :name="p + '.' + i + '.' + j"
                    :id="p + '.' + i + '.' + j"
                    :value="opt.id"
                  />
                  <label class="form-check-label" :for="p + '.' + i + '.' + j">
                    {{ opt.name }}
                  </label>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-for="(item, i) in examDetail[0].examgroupuser[0].question"
              v-if="examDetail[0].examgroupuser[0].exam.exampartial.length < 1"
            >
              <div class="form-check form-check-inline">{{ i + 1 }}</div>
              <div
                class="form-check form-check-inline ml-1"
                v-for="(opt, j) in examOpt"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  @click="onClickRadio(item, i, opt, j)"
                  @change="onChangeOption(item, i, opt, j)"
                  v-model="examDetail[0].examgroupuser[0].question[i].qAnswer"
                  :name="i + '.' + j"
                  :id="i + '.' + j"
                  :value="opt.id"
                />
                <label class="form-check-label" :for="i + '.' + j">
                  {{ opt.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div class="row mt-5">
          <div class="col">
            <base-button
              block
              type="success"
              @click="onCreateUserExamContent('show')"
              v-if="starttime"
              >Sınavı Bitir</base-button
            >
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import PDFObject from "pdfobject";
import appPlugin from "../plugins/appPlugin";
import _ from "underscore";
import Swal from "sweetalert2";

export default {
  name: "StudentExam",

  data() {
    return {
      userfill: false,
      qnumber: 0,
      timer: null,
      totalTime: "",
      title: "Sınav Bitimi İçin Kalan Süre",
      starttime: false,
      userExamData: [],
      examDetail: [],
      examOpt: [],
      loading: false,
    };
  },
  beforeMount() {},
  watch: {
    seconds(val) {
      if (val == "00" && this.minutes == "00") {
        debugger;
        this.onCreateUserExamContent();
        appPlugin.showalert(
          "Bilgilendirme",
          "Sınav Süreniz Bitmiştir Sınavınız Kayıt Edilecektir",
          "info",
          "Tamam"
        );
        //süre bitti sınav bitti storageden al
      }
    },
  },
  computed: {
    minutes: function() {
      const minutes = Math.floor(this.totalTime / 60);
      return this.padTime(minutes);
    },
    seconds: function() {
      const seconds = this.totalTime - this.minutes * 60;
      return this.padTime(seconds);
    },
  },
  methods: {
    onClickPartialsRadio(item, i, opt, j) {
      if (item.qAnswer != "" || item.qAnswer != null) {
        if (
          this.examDetail[0].examgroupuser[0].question[i].qAnswer ==
          item.qAnswer
        ) {
          this.examDetail[0].examgroupuser[0].question[i].qAnswer = null;
          localStorage.setItem("nowExam", JSON.stringify(this.examDetail[0]));
        }
      }
    },
    CreateExamContent() {
      this.stopTimer();
      let data = [];
      this.loading = true;
      this.examDetail[0].examgroupuser[0].question.forEach((item) => {
        //cevap boşsa 6 değeri girilecek
        data.push({
          userid: this.$store.getters.getUser.id,
          questionid: item.id,
          optionid:
            item.qAnswer == null || item.qAnswer == "" ? 6 : item.qAnswer,
          examgroupid: this.examDetail[0].examgroupuser[0].id,
        });
      });
      this.$store
        .dispatch("createStudentExam", { examList: data })
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            var data = document.getElementById("example1");
            data.innerHTML = "";
            data.setAttribute("class", "");
            appPlugin.showalert(
              "Bilgilendirme",
              "Sınav Bilgileri Başarıyla Kayıt Edildi",
              "success",
              "Tamam"
            );
            this.examDetail = [];
            localStorage.removeItem("nowExam");
            this.starttime = !this.starttime;
          }
        })
        .catch((err) => {
          this.loading = false;
          appPlugin.showalert(
            "Uyarı",
            "Sınav Bilgileriniz Kayıt Edilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
            "error",
            "Tamam"
          );
        });
      //Localstorageden silinecek
      //sınav bitti bilgiler kayıt edilecek
    },
    onCreateUserExamContent(param) {
      if (param) {
        debugger;
        Swal.fire({
          title: "Bilgilendirme",
          text: "Sınavınızı Bitirmek İstediğinize Emin Misiniz ?",
          confirmButtonText: "Evet",
          confirmButtonColor: "green",
          cancelButtonText: "Hayır",
          icon: "info",
          showCancelButton: true,
        }).then((res) => {
          if (res.value) {
            this.CreateExamContent();
          } else {
            console.log("hayır");
          }
        });
      } else {
        this.CreateExamContent();
      }
    },
    onClickRadio(item, i, opt, j) {
      debugger;
      if (item.qAnswer != "" || item.qAnswer != null) {
        if (
          this.examDetail[0].examgroupuser[0].question[i].qAnswer ==
          item.qAnswer
        ) {
          this.examDetail[0].examgroupuser[0].question[i].qAnswer = null;
          localStorage.setItem("nowExam", JSON.stringify(this.examDetail[0]));
        }
      }
    },
    onChangeOption(item, i, opt, j) {
      localStorage.setItem("nowExam", JSON.stringify(this.examDetail[0]));
    },
    startTimer: function() {
      this.timer = setInterval(() => this.countdown(), 1000);
    },
    stopTimer: function() {
      clearInterval(this.timer);
      this.timer = null;
    },
    padTime: function(time) {
      return (time < 10 ? "0" : "") + time;
    },
    countdown: function() {
      if (this.totalTime >= 1) {
        this.totalTime--;
      } else {
        this.totalTime = 0;
        this.stopTimer();
      }
    },
    checkExamDate(data) {
      this.loading = true;

      this.$store
        .dispatch("checkExamDate", { id: data.exam_id })
        .then((res) => {
          if (res.data.time && res.data.date) {
            let nowtoday = res.data.date;
            let nowhour = res.data.time;
            this.$store
              .dispatch("fetchOptions")
              .then((res) => {
                let options = res.data;
                this.$store
                  .dispatch("fetchExam", {
                    examid: data.exam_id,
                    userid: this.$store.getters.getUser.id,
                  })
                  .then((res) => {
                    this.loading = false;
                    //exam_group_id
                    let userexam = [];
                    userexam = res.data[0].examgroupuser.filter((item, i) => {
                      return item.exam_id == data.exam_id;
                    });
                    res.data[0].examgroupuser = userexam;
                    let userhave = _.where(
                      res.data[0].examgroupuser[0].examcontent,
                      {
                        user_id: this.$store.getters.getUser.id,
                        exam_group_id: data.exam_group_id,
                      }
                    );
                    if (userhave.length < 1) {
                      if (localStorage.getItem("nowExam") == null) {
                        this.examDetail = res.data;
                      } else {
                        if (
                          JSON.parse(localStorage.getItem("nowExam"))
                            .examgroupuser[0].exam_id == data.exam_id
                        ) {
                          this.examDetail = [
                            JSON.parse(localStorage.getItem("nowExam")),
                          ];
                        } else {
                          this.examDetail = res.data;
                        }
                      }
                      this.examOpt = options.slice(
                        0,
                        res.data[0].examgroupuser[0].exam.optCount
                      );
                      // bakılacak
                      //serverdan tarih al
                      let date = nowtoday.split("-");
                      console.log(date);

                      //new Date().toLocaleDateString().split(".");
                      console.log("today", nowtoday);
                      //
                      var date1 = new Date(
                        date[1] +
                          "/" +
                          date[0] +
                          "/" +
                          date[2] +
                          " " +
                          res.data[0].examgroupuser[0].exam.endHour +
                          ":00"
                      );
                      var date2 = new Date(
                        date[1] + "/" + date[0] + "/" + date[2] + " " + nowhour
                      );
                      var diff = date1.getTime() - date2.getTime();
                      var msec = diff;
                      var hh = Math.floor(msec / 1000 / 60 / 60);
                      msec -= hh * 1000 * 60 * 60;
                      var mm = Math.floor(msec / 1000 / 60);
                      msec -= mm * 1000 * 60;
                      var ss = Math.floor(msec / 1000);
                      msec -= ss * 1000;
                      let hour = hh;
                      let minutes = mm + 1;
                      if (hour > 0) {
                        hour = hour * 60;
                      }
                      let total = hour + minutes;
                      this.totalTime = total * 60;
                      this.stopTimer();
                      this.startTimer();
                      PDFObject.embed(
                        res.data[0].examgroupuser[0].file.path,
                        "#example1",
                        {
                          pdfOpenParams: {
                            toolbar: 0,
                            view: "Fit",
                          },
                        }
                      );
                      this.starttime = true;
                    } else {
                      this.loading = false;
                      appPlugin.showalert(
                        "Uyarı",
                        "Aynı Sınava 2.Kez Girilemez",
                        "error",
                        "Tamam"
                      );
                      //sınava girmiş giremez
                    }
                  })
                  .catch((err) => {
                    this.loading = false;
                    appPlugin.showalert(
                      "Uyarı",
                      "Sınav Bilgileri Getirilirken Hata Gerçekleşti",
                      "error",
                      "Tamam"
                    );
                  });
              })
              .catch((err) => {
                this.loading = false;
                appPlugin.showalert(
                  "Uyarı",
                  "Sınav Seçenekleri Getirilirken Hata Gerçekleşti",
                  "error",
                  "Tamam"
                );
              });
          } else {
            this.loading = false;
            appPlugin.showalert("Uyarı", res.data, "info", "Tamam");
          }
        })
        .catch((err) => {
          this.loading = false;
          appPlugin.showalert(
            "Uyarı",
            "Sınav Zamanı Kontrol Edilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
            "error",
            "Tamam"
          );
        });
    },
  },
  created() {
    this.$store
      .dispatch("fetchStudentExam", {
        userid: this.$store.getters.getUser.id,
      })
      .then((res) => {
        this.userExamData = res.data;
      })
      .catch((err) => {
        appPlugin.showalert(
          "Uyarı",
          "Sınavlar Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
          "error",
          "Tamam"
        );
      });
  },
  mounted() {},
  components: {
    Loading,
  },
};
</script>
<style>
.anyClass {
  height: 500px;
  overflow-y: scroll;
}

.pdfobject-container {
  height: 100%;
  min-height: 1000px;
  width: 100%;
  border: 1rem solid rgba(0, 0, 0, 0.1);
}

#message {
  color: #ddd;
  font-size: 50px;
  margin-bottom: 20px;
}

#timer {
  font-size: 200px;
  line-height: 1;
  margin-bottom: 40px;
}
</style>
