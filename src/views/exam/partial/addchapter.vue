<template>
  <div class="row">
    <Loading v-if="loading"/>
    <card v-if="actionstatus != 'detail'" class="col-md-6">
      <slot name="header">
        <p>Sınav Bölümü Oluştur</p>
      </slot>
      <div class="row">
        <div class="col-md-12">
          <label class="typo__label">Bölüm</label>
          <multiselect
            v-model="chapterModel.chapter"
            :options="chapters"
            label="name"
            :searchable="true"
            :allow-empty="false"
            placeholder="Seç"
          ></multiselect>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-md-6">
          <label class="typo__label">Başlangıç Soru No</label>
          <multiselect
            v-model="chapterModel.startQ"
            :options="getQCount"
            :searchable="true"
            :allow-empty="false"
            placeholder="Seç"
          ></multiselect>
        </div>
        <div class="col-md-6">
          <label class="typo__label">Bitiş Soru No</label>
          <multiselect
            v-model="chapterModel.endQ"
            :options="getQCount"
            :searchable="true"
            :allow-empty="false"
            placeholder="Seç"
          ></multiselect>
        </div>
      </div>
      <br />
      <base-button type="success" class="float-right" @click="save"
        >Ekle
      </base-button>
    </card>
    <card class="col-md-6">
      <slot name="header">
        <p>Sınav Bölümleri Listesi</p>
      </slot>
      <v-table
        :del-visible="true"
        @delClick="deleteClick($event)"
        :columns="[
          {
            name: 'Soru Baş.',
            display: 'startQ'
          },
          {
            name: 'Soru Bitiş',
            display: 'endQ'
          },
          {
            name: 'Bölüm Adı',
            display: 'chapter_name'
          },
          {
            name: '',
            display: ''
          }
        ]"
        :rows="examchapterlists"
        :table-title="[
          {
            name: 'Soru Baş.',
            display: 'startQ'
          },
          {
            name: 'Soru Bitiş',
            display: 'endQ'
          },
          {
            name: 'Bölüm Adı',
            display: 'chapter_name'
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
import echapterModel from "../../../store/models/echapterModel";
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
    ...mapGetters({
      chapters: "getChapter",
      errmessage: "errmessage",
      exam: "exam",
      examchapterlists: "examchapterlists"
    }),
    getQCount() {
      let qCounts = [];
      for (let i = 1; i <= this.exam.qCount; i++) {
        qCounts.push(i);
      }
      return qCounts;
    }
  },
  components: {
    Multiselect,
    VTable,Loading
  },
  async created() {
    await this.$store.dispatch("fetchChapter");
    await this.$store.dispatch("fetchExamChapterLists", { id: this.exam.id });
    this.chapterModel.chapter = this.chapters[0];
    this.loading = false;
  },
  methods: {
    async save() {
      if(this.actionstatus === 'detail'){
        appPlugin.showalert("Uyarı", "Bu sınav yapıldığı için değişiklik yapılamaz.", "warning", "Tamam")

      } else {
        this.loading = true;

        this.chapterModel.exam_id = this.exam.id;
        if (this.chapterModel.startQ >= this.chapterModel.endQ) {
          appPlugin.showalert(
                  "Uyarı",
                  "Başlama Bitişten küçük olmalıdır.",
                  "warning",
                  "Tamam"
          );
        } else if (this.chapterModel.exam_id == 0) {
          appPlugin.showalert(
                  "Uyarı",
                  "Bölüm bir sınıfa bağlı olmalıdır.",
                  "warning",
                  "Tamam"
          );
        } else {
          this.chapterModel.chapter_id = this.chapterModel.chapter.id;
          let result = await this.$store.dispatch(
                  "createExamPartial",
                  this.chapterModel
          );
          if (result) {
            this.chapterModel.startQ = this.chapterModel.endQ + 1;
            this.chapterModel.endQ = this.chapterModel.endQ + 2;
          } else {
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }
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
                    let result = await this.$store.dispatch(
                            "deleteExamPartial",
                            row.item
                    );
                    if (!result) {
                      appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
                    }
                  }
                });
      }
    }
  },
  data() {
    return {
      chapterModel: echapterModel,
      loading: true,
    };
  }
};
</script>
