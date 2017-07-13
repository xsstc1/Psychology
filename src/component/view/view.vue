<template>
<div id="view" class="p30" @keyup.enter="viewSearch">
  <div id="psy-view-content">
    <el-form ref="viewForm" :model="viewForm" label-width="80px" class="loadInFirst">
      <el-row :gutter="20" class="bd-1 p20 bg-color-white m-0">
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="发送日期:" class="f13">
            <el-col :span="24">
              <el-date-picker size="small" v-model="viewForm.dateSend" type="daterange" placeholder="选择日期范围" clearable></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="测评日期:" class="f13">
            <el-col :span="24">
              <el-date-picker size="small" v-model="viewForm.dataEvaluation" type="daterange" placeholder="选择日期范围" clearable></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="测评状态:" class="f13">
            <el-col :span="24">
              <el-select size="small" v-model="viewForm.state" placeholder="请选择状态" clearable>
                <el-option label="全部" value="null"></el-option>
                <el-option label="待测试" value="1"></el-option>
                <el-option label="测试中" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="职位名称:" class="f13">
            <el-col :span="24">
              <el-select filterable size="small" v-model="viewForm.positionName" placeholder="请选择职位名称" clearable>
                <el-option v-for="position in positionData" :key="position" :label="position" :value="position"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="姓名:" class="f13">
            <el-col :span="24">
              <el-autocomplete size="small" class="inline-input" v-model="viewForm.name" :fetch-suggestions="nameSearch" placeholder="请输入姓名"></el-autocomplete>
              <!-- <el-input size="small" v-model="viewForm.name" placeholder="请输入姓名"></el-input> -->
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :sm="8" class="mt-15 psy-view-search-col">
          <el-form-item label="邮箱:" class="f13">
            <el-col :span="24">
              <el-autocomplete size="small" class="inline-input" v-model="viewForm.email" :fetch-suggestions="emailSearch" placeholder="请输入邮箱"></el-autocomplete>
              <!-- <el-input size="small" v-model="viewForm.email" placeholder="请输入邮箱"></el-input> -->
            </el-col>
          </el-form-item>
        </el-col>
        <el-col class="tc mt-25 mb-20" :span="24">
          <el-form-item>
            <el-button type="primary" @click="viewSearch" :loading="viewForm.loading">搜索</el-button>
            <el-button class="color-main fr" @click="resetForm('viewForm')">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <article class="mt-25 psy-view-content loadInFirst" v-if="searchShow">
      <nav class="f13">
        <span :class="{color_red : viewContentZero}">当前共{{viewCounts}}条数据</span>
        <el-button v-show="exportStatus" size="small" class="color-main fr" @click="exportBatch"><i class="iconfont mr-5">&#xe660;</i>批量导出</el-button>
      </nav>
      <section class="mt-30 psy-index-table">
        <header class="p10 psy-index-table-header">
          <el-row :gutter="20" class="tc f14">
            <el-col :span="1">
              <div>
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
              </div>
            </el-col>
            <el-col :span="2">
              <div>序号</div>
            </el-col>
            <el-col :span="2">
              <div>姓名</div>
            </el-col>
            <el-col :span="4">
              <div>邮箱</div>
            </el-col>
            <el-col :span="4">
              <div>测评职位</div>
            </el-col>
            <el-col :span="3">
              <div>电话</div>
            </el-col>
            <el-col :span="3">
              <div>完成时间<i class="change-time-order iconfont f15 ml-5 cp disinblock" @click="changeOrder" :class="{view_order:viewOrder}">&#xe608;</i></div>
            </el-col>
            <el-col :span="5">
              <div>操作</div>
            </el-col>
          </el-row>
        </header>
        <ul class="psy-index-list" v-loading.body="viewContentLoading" v-if="viewContent">
          <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
            <li class="p10" v-for="(viewList, i) in viewTotal">
              <el-row :gutter="20" class="tc f13">
                <el-col :span="1">
                  <div>
                    <el-checkbox :label="viewList"></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div>{{i+1}}</div>
                </el-col>
                <el-col :span="2">
                  <div>{{viewList.name}}</div>
                </el-col>
                <el-col :span="4">
                  <div>{{viewList.email}}</div>
                </el-col>
                <el-col :span="4">
                  <div>{{viewList.positionName}}</div>
                </el-col>
                <el-col :span="3">
                  <div>{{viewList.mobileNumber | emptyMobile}}</div>
                </el-col>
                <el-col :span="3">
                  <div :class="{color_gray : viewList.viewNotFinish}">{{viewList.assessmentFinishTime | formatDateShortView}}</div>
                </el-col>
                <el-col :span="5">
                  <el-col :span="12" class="tr psy-view-conten-btn cp">
                    <el-button :class="{color_gray : viewList.viewNotComplete}" type="text" @click="viewReport(viewList)" class="f13 color-blue">
                      <el-tooltip class="item" effect="dark" content="查看报告" placement="top-start"><i class="iconfont f14 view-btn-show-i">&#xe65c;</i></el-tooltip><span class="view-btn-show"><i class="iconfont f14">&#xe65c;</i>查看报告</span></el-button>
                  </el-col>
                  <el-col :span="12" class="tl psy-view-conten-btn">
                    <el-button :class="{color_gray : viewList.viewNotFinish}" @click="psyCOmpareBtn(viewList)" size="small" class="f13 color-green" type="text">
                      <el-tooltip class="item" effect="dark" content="绩效对比" placement="top-start"><i class="iconfont f14 view-btn-show-i">&#xe664;</i></el-tooltip><span class="view-btn-show"><i class="iconfont f14">&#xe664;</i>绩效对比</span></el-button>
                  </el-col>
                </el-col>
              </el-row>
            </li>
          </el-checkbox-group>
        </ul>
      </section>
      <div class="block tc mt-30 psy-pagination" v-if="viewContentPage">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" small layout="prev, pager, next" :total="viewCounts" :page-size="10"></el-pagination>
      </div>
    </article>
  </div>
</div>
</template>
<script>
export default {
  name: "view",
  data: function data() {
    return {
      viewForm: {
        dateSend: '',
        dataEvaluation: '',
        state: "全部",
        positionName: "",
        name: '',
        email: '',
        loading: false,
        nameArray: []
      },
      positionData: [],
      checkAll: false,
      checkedList: [],
      viewTotal: [],
      viewCounts: 0,
      viewContent: false,
      viewContentPage: false,
      viewOrder: false,
      page: 1,
      viewContentLoading: false,
      searchShow: false,
      viewContentZero: false,
      exportStatus: false,
      nameAll: [],
      emailAll: []
    }
  },
  methods: {
    exportBatch() { //批量导出
      if (this.checkedList.length > 0) {
        const {
          buildExcel
        } = require("../../assets/js/jsonToXlsx.js");
        // console.log(this.checkedList);
        let exportArray = [];
        for (let item in this.checkedList) {
          exportArray.push(this.checkedList[item].userId);
        }
        let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
        let exportData = {
          "userIds": exportArray,
          "companyId": companyId
        }
        // console.log(exportData);
        this.publicFun.httpRequest("post", '/mlams/candidate/exportedAssessmentCandidateInfo', JSON.stringify(exportData), (status, data, message) => {
          if (status == 200) {
            // console.log("导出信息",data);
            let excelData = [
              ["序号", "姓名", "邮箱", "职位", "电话", "行为模式", "IQ", "EQ", "价值观", "动机", "思维模式"],
            ];
            for (let item in data) {
              var excelSaveArray = [parseInt(item) + 1, data[item].name, data[item].email, data[item].positionName, data[item].mobileNumber, data[item].behaviorStyleName, data[item].iqValue, data[item].eqValue, data[item].valueName, data[item].motivationName,
                data[item].thinkingPatternName
              ];
              excelData.push(excelSaveArray);
            }
            // console.log("excel信息",excelData);
            if (excelData.length - 1 > 1) {
              let excelName = excelData[1][1] + "、" + excelData[2][1];
              buildExcel(excelData, `${excelName}等${excelData.length-1}人的测评数据`);
            } else {
              let excelName = excelData[1][1];
              buildExcel(excelData, `${excelName}的测评数据`);
            }
            this.checkedList = [];

          }
        });
      } else {
        this.$message({
          showClose: false,
          message: '请选择所要导出的人',
          type: 'warning'
        });
      }
    },
    viewSearch(viewForm) {
      // console.log(viewForm);
      this.viewForm.loading = true;
      this.viewTotal = [];
      this.viewOrder = 1;
      this.getViewList(1, this.viewOrder);
    },
    getViewList(page, order) {
      this.viewContentLoading = true;
      this.checkedList = [];
      this.checkAll = false;
      let searchData = {
        "startSendTime": this.viewForm.dateSend != "" ? new Date(this.viewForm.dateSend[0]).valueOf() == 0 ? null : new Date(this.viewForm.dateSend[0]).valueOf() : null,
        "endSendTime": this.viewForm.dateSend != "" ? new Date(this.viewForm.dateSend[1]).valueOf() == 0 ? null : new Date(this.viewForm.dateSend[1]).valueOf() + 24 * 3600 * 1000 - 1 : null,
        "startAssessmentFinishTime": this.viewForm.dataEvaluation != "" ? new Date(this.viewForm.dataEvaluation[0]).valueOf() == 0 ? null : new Date(this.viewForm.dataEvaluation[0]).valueOf() : null,
        "endAssessmentFinishTime": this.viewForm.dataEvaluation != "" ? new Date(this.viewForm.dataEvaluation[1]).valueOf() == 0 ? null : new Date(this.viewForm.dataEvaluation[1]).valueOf() + 24 * 3600 * 1000 - 1 : null,
        "positionName": this.viewForm.positionName != "" ? this.viewForm.positionName : null,
        "name": this.viewForm.name != "" ? this.viewForm.name : null,
        "email": this.viewForm.email != "" ? this.viewForm.email : null,
        "timeReverseOrder": order,
        "companyId": JSON.parse(localStorage.psyCompanyInfo).companyId,
        "assessmentStatus": this.viewForm.state != "" ? parseInt(this.viewForm.state) : null
      };
      this.viewTotal = [];
      this.publicFun.httpRequest("post", '/mlams/business/searchAssessmentCandidates/10/' + page, JSON.stringify(searchData), (status, data, message) => {
        if (status == 200) {
          // console.log("搜索信息", data);
          for (let i = 0; i < data.candidatelist.length; i++) {
            let resultData = {
              "userInfoId": data.candidatelist[i].userInfoId,
              "userId": data.candidatelist[i].userId,
              "name": data.candidatelist[i].name,
              "email": data.candidatelist[i].email,
              "positionName": data.candidatelist[i].positionName,
              "mobileNumber": data.candidatelist[i].mobileNumber,
              "assessmentReportUrl": data.candidatelist[i].assessmentReportUrl,
              "assessmentFinishTime": data.candidatelist[i].assessmentFinishTime,
              "viewNotComplete": data.candidatelist[i].assessmentReportUrl == null ? true : false,
              "viewNotFinish": data.candidatelist[i].assessmentFinishTime == null ? true : false,
            };
            this.viewTotal.push(resultData);
          };
          if (this.viewForm.state == 3) {
            this.exportStatus = true
          } else {
            this.exportStatus = false
          }
          this.searchShow = true;
          this.viewContentLoading = false; //关闭Loading
          this.viewCounts = data.count;
          this.viewContent = true;
          if (data.count == 0) {
            this.viewContent = false;
            this.viewContentZero = true;
            this.viewContentPage = false;
          } else {
            this.viewContentZero = false;
            if (data.count > 10) {
              this.viewContentPage = true;
            } else {
              this.viewContentPage = false;
            }

          }
          console.log(this.viewTotal);
          this.viewForm.loading = false;
        }
      });
    },
    resetForm(viewForm) {
      this.viewForm = {
        dateSend: "",
        dataEvaluation: "",
        positionName: "",
        name: '',
        email: '',
        state: '',
        loading: false
      };
    },
    handleCheckAllChange(event) {
      this.checkedList = event.target.checked ? this.viewTotal : [];
      this.isIndeterminate = false;
    },
    handleCheckedListChange(value) {
      let checkedCount = value.length;
      // console.log(checkedCount)
      this.checkAll = checkedCount === this.viewTotal.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.viewTotal.length;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getViewList(val, this.viewOrder);
      this.page = val;
      console.log(`当前页: ${val}`);
    },
    changeOrder() {
      if (this.viewOrder == false) {
        this.viewOrder = true;
        this.getViewList(this.page, this.viewOrder);
      } else {
        this.viewOrder = false;
        this.getViewList(this.page, this.viewOrder);
      }
    },
    psyCOmpareBtn(viewList) {
      if (viewList.assessmentFinishTime == null) {
        this.$message.error('此人还未完成测评');
      } else {
        this.$router.push({
          path: 'viewCompare',
          query: {
            userId: viewList.userId,
            userName: viewList.name
          }
        });
      }
    },
    viewReport(viewList) {
      if (viewList.assessmentReportUrl == null && viewList.assessmentFinishTime == null) {
        this.$message.error('此人还未完成测评');
      } else if (viewList.assessmentReportUrl == null && viewList.assessmentFinishTime != null) {
        this.$message.error('此人的报告还未生成完毕');
      } else {
        window.open(viewList.assessmentReportUrl, "_blank");
      }
    },
    nameSearch(nameString, cb) {
      var nameArray = this.nameArray;
      var results = nameString ? nameArray.filter(this.nameFilter(nameString)) : nameArray;
      cb(results);
    },
    nameFilter(nameString) {
      return (nameArray) => {
        return (nameArray.value.indexOf(nameString.toLowerCase()) === 0);
      };
    },
    loadNameAll() {
      return this.nameAll;

    },
    emailSearch(emailString, cb) {
      var emailArray = this.emailArray;
      var results = emailString ? emailArray.filter(this.emailFilter(emailString)) : emailArray;
      cb(results);
    },
    emailFilter(emailString) {
      return (emailArray) => {
        return (emailArray.value.indexOf(emailString.toLowerCase()) === 0);
      };
    },
    loadEmailAll() {
      return this.emailAll;

    },
  },
  mounted() {
    this.$parent.activeIndex = "3";
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      this.publicFun.httpRequest("get", '/mlams/business/getAllPositionName/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log("职位",data);
          this.positionData = data
        }
      });
      this.publicFun.httpRequest("get", '/mlams/personalUser/getAllCandidateEmails/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          for (let i = 0; i < data.length; i++) {
            let emailObj = {
              "value": data[i]
            }
            this.emailAll.push(emailObj)
          }
          this.emailArray = this.loadEmailAll();
        }
      });
      this.publicFun.httpRequest("get", '/mlams/personalUser/getAllCandidateName/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          for (let i = 0; i < data.length; i++) {
            let nameObj = {
              "value": data[i]
            }
            this.nameAll.push(nameObj)
          }
          this.nameArray = this.loadNameAll();
        }
      });
    } else {
      this.$router.push({
        path: '/login'
      });
    }

  }
}
</script>
<style lang="stylus">
#psy-view-content
  .el-form-item
    margin-bottom 0
    .el-icon-caret-top:before
      color #64718F
    .el-autocomplete
      display initial
    .el-input
      width  100%
    .el-select
      width 100%
    button
      padding 9px 30px
    label,input
      font-size 13px
    .el-form-item__label
      color fontColor
    .el-icon-close
      font-size 18px
  .el-checkbox__label
    display none
  .view_order
    transition all .5s
    transform rotate(180deg)


.psy-view-content
  li
    height 20px
    line-height 23px
  .psy-view-conten-btn
    i
      margin-right 1px
  .change-time-order
    transition all .5s
    color #64718F
  .color_gray
    color #a7a7a7

@media screen and (min-width: 1600px)
  .psy-view-search-col
    width 25%
@media screen and (max-width: 1210px)
    .psy-view-conten-btn
      span.view-btn-show
        display none
      i
        font-size 20px!important
@media screen and (min-width: 1211px)
    .psy-view-conten-btn
      .view-btn-show-i
        display none
</style>
