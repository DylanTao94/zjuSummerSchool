
<template>
  <v-main>
    <v-container class="fill-height" fluid v-if="newUserFlag && !loadingPage">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>个人信息</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon target="_blank" v-on="on">
                    <v-icon>mdi-help</v-icon>
                  </v-btn>
                </template>
                <span>填写以下信息，可以帮助您更快的选择合适的课程哦😊</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-alert type="error" :value="submitFailed" dismissible transition="scale-transition">输入信息有误</v-alert>
              <v-form>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select v-model="selectedData.selectedState" :items="states" label="所在地区"></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    :items="universities[selectedData.selectedState]"
                    v-model="selectedData.selectedUniversity"
                    label="所在学校"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    :items="educationLevels"
                    label="当前学历"
                    v-model="selectedData.selectedEducationLevel"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select :items="majorCats" v-model="selectedData.selectedCat" label="专业类别"></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    :items="majors[selectedData.selectedCat]"
                    label="专业"
                    v-model="selectedData.selectedMajor"
                  ></v-select>
                </v-col>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submit()">
                <span v-if="!submitting">提交</span>

                <v-progress-circular
                  :size="20"
                  color="white"
                  indeterminate
                  :width="1.5"
                  v-if="submitting"
                ></v-progress-circular>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height" fluid v-if="(!newUserFlag || submitSuccess) && !loadingPage">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>个人信息</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert outlined type="success" text dismissible :value="submitSuccess" transition="scale-transition">信息提交成功！</v-alert>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>所在地区</v-list-item-title>
                  <v-list-item-subtitle>{{selectedData.selectedState}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>所在学校</v-list-item-title>
                  <v-list-item-subtitle>{{selectedData.selectedUniversity}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>当前学历</v-list-item-title>
                  <v-list-item-subtitle>{{selectedData.selectedEducationLevel}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>专业类别</v-list-item-title>
                  <v-list-item-subtitle>{{selectedData.selectedCat}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>专业名</v-list-item-title>
                  <v-list-item-subtitle>{{selectedData.selectedMajor}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <router-link to="/">
                <v-btn color="primary" @click="submit()">返回首页</v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
export default {
  name: "PersonalInfo",
  components: {},
  methods: {
    submit: function () {
      let _this = this;
      _this.submitting = true;
      _this.submitFailed = false;
      console.log("now, is submitting.....")
      console.log(this.$store.state.openId)
      axios
        .post("https://0e5d1870886e.ngrok.io/savePersonalInfo", {
          selectedData: _this.selectedData,
          openId: _this.$store.state.openId,
        })
        .then(function (response) {
          console.log(response);
          console.log("summitted");
          if(response.data.success == 0) {
            console.log("summitt failed");
            console.log(_this.submitFailed);
            _this.submitFailed = true;
            console.log();
          } else {
            _this.submitSuccess = true;
            _this.newUserFlag = false;
          }
          _this.submitting = false;
        });
    },
  },
  created() {
    let _this = this;
    axios
        .get("https://0e5d1870886e.ngrok.io/getPersonalInfo?openId="+this.$store.state.openId)
        .then(res=>{
          _this.loadingPage = false;
          console.log(`get info success and this is a success = ${res.data.success} user, where 0 represent new user, and 1 represent registed user`);
          if (res.data.success == 1) {
            // console.log(res.data)
            // console.log("enter success")
            _this.selectedData = res.data.result[0].selectedData
            _this.hasInfo = true;
            _this.newUserFlag = false;
          } else {
            _this.newUserFlag = true;
          }
        });
  },
  data() {
    return {
      loadingPage: true,
      newUserFlag: false,
      submitSuccess: false,
      submitting: false,
      submitFailed: false,
      selectedData: {
        selectedState: "",
        selectedCat: "",
        selectedEducationLevel: "",
        selectedUniversity: "",
        selectedMajor: "",
      },
      id: this.$route.params.id,
      states: ["New South Wales", "Victoria", "Queensland"],
      universities: {
        "New South Wales": ["UNSW", "USYD", "UTS", "UMQ", "UoN", "UoW"],
        Victoria: ["RMIT", "迪肯", "墨尔本大学", "莫纳什大学", "乐卓博大学"],
      },
      educationLevels: ["Bachelor", "Master"],
      majorCats: ["Commence", "Computer Science", "Engineering"],
      majors: {
        Commence: ["Finance", "Accounting", "Marketing"],
        "Computer Science": [
          "Information Technology",
          "Computer Science",
          "Data Science",
        ],
        Engineering: [
          "Civil Engineering",
          "Environmental Engineering",
          "Electrical Engineering",
        ],
      },
    };
  },
};
</script>