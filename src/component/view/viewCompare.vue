<template>
<div id="view-compare" class="p30">
  <div class="loadInFirst">
    <div class="f16">
      {{viewName}}与职位的绩效差距分析
    </div>
    <div class="f13 mt-10">
      想知道{{viewName}}距离成为一个绩优员工还有多远？我们将提供{{viewName}}和选定职位绩优模型的差距分析
    </div>
    <div class="mt-25">
      <span>选择比较职位：</span>
      <el-select id="viewPositionSelect" filterable v-model="viewPositionId" size="small" placeholder="请选择职位">
        <el-option v-for="viewPosition in companyPosition" :key="viewPosition.performanceModelId" :label="viewPosition.performanceModelName" :value="viewPosition.performanceModelId"></el-option>
      </el-select>
      <el-button :loading="compareLoading" type="primary" size="small" class="ml-20" @click="viewCompare">比较</el-button>
    </div>
  </div>
  <article class="mt-40 loadInSecond" v-if="viewCompareShow">
    <nav class="f17">
      整体匹配度：<i class="f26 fn color-blue">{{viewScore.totalScore | setIntNum}}%</i>
    </nav>
    <section class="w70 tc mt-15 f14">
      <el-row :gutter="9">
        <el-col :span="4">
          <div class="psy-view-compare-title">
            维度
          </div>
        </el-col>
        <el-col :span="8">
          <div class="psy-view-compare-title">
            {{viewName}}的结果
          </div>
        </el-col>
        <el-col :span="3">
          <div class="psy-view-compare-title">
            匹配度
          </div>
        </el-col>
        <el-col :span="9">
          <div class="psy-view-compare-title">
            绩优模型数值
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="9" class="mt-10">
        <el-col :span="4">
          <ul class="psy-view-compare-left">
            <li class="p10 mb-10">智商IQ</li>
            <li class="p10 mb-10">情商EQ</li>
            <li class="p10 mb-10">价值观</li>
            <li class="p10 mb-10">动机</li>
            <li class="p10 mb-10">行为倾向</li>
            <li class="p10 mb-10">思维模式</li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul class="psy-view-compare-content">
            <li class="p10">{{userResult.iqLevel}} : {{userResult.iqValue}}</li>
            <li class="p10">{{userResult.eqLevel}} : {{userResult.eqValue}}</li>
            <li class="p10">{{userResult.valueName}}</li>
            <li class="p10">{{userResult.motivationName}}</li>
            <li class="p10">{{userResult.behaviorStyleName}}</li>
            <li class="p10">{{userResult.thinkingPatternName}}</li>
          </ul>
        </el-col>
        <el-col :span="3">
          <ul class="psy-view-compare-content">
            <li class="p10 color-blue">{{viewScore.iqScore | setIntNum}}%</li>
            <li class="p10 color-blue">{{viewScore.eqScore | setIntNum}}%</li>
            <li class="p10 color-blue">{{viewScore.valueScore | setIntNum}}%</li>
            <li class="p10 color-blue">{{viewScore.motivationScore | setIntNum}}%</li>
            <li class="p10 color-blue">{{viewScore.behaviorStyleScore | setIntNum}}%</li>
            <li class="p10 color-blue">{{viewScore.thinkingPatternScore | setIntNum}}%</li>
          </ul>
        </el-col>
        <el-col :span="9">
          <ul class="psy-view-compare-content">
            <li class="p10">{{modelResult.iqLevel}} : {{modelResult.iqValue}}</li>
            <li class="p10">{{modelResult.eqLevel}} : {{modelResult.eqValue}}</li>
            <li class="p10">{{modelResult.valueName}}</li>
            <li class="p10">{{modelResult.motivationName}}</li>
            <li class="p10">{{modelResult.behaviorStyleName}}</li>
            <li class="p10">{{modelResult.thinkingPatternName}}</li>
          </ul>
        </el-col>
      </el-row>
    </section>
  </article>
</div>
</template>
<script>
export default {
  name: "view-compare",
  data: function data() {
    return {
      viewName: "",
      viewPositionId: "",
      viewCompareShow: false,
      companyPosition: [],
      viewScore: "",
      userResult: "",
      modelResult: "",
      compareLoading:false
    }
  },
  mounted() {
    this.$parent.activeIndex = "3";
    this.viewName = this.$route.query.userName;
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      this.publicFun.httpRequest("get", '/mlams/performanceModel/getExistPerformanceModelDataPositionName/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log("公司职位列表",data);
          this.companyPosition = data;
        }
      });
    } else {
      this.$router.push({
        path: '/login'
      });
    }
  },
  methods: {
    viewCompare() {
      if (this.viewPositionId == "") {
        this.$message({
          message: '请选择职位',
          type: 'warning'
        });
        document.querySelector("#viewPositionSelect input").focus();
      } else {
        let performanceModelId = this.viewPositionId;
        let userId = this.$route.query.userId;
        let updateCompare = {
          "performanceModelId": performanceModelId
        }
        this.compareLoading = true;
        this.publicFun.httpRequest("post", '/mlams/performanceModel/updatePerformanceModelInfo', JSON.stringify(updateCompare), (status, data, message) => {
          if (status == 200) {
            this.publicFun.httpRequest("get", '/mlams/candidate/calcuatePerformanceModelWithCandidate/' + performanceModelId + '/' + userId, null, (status, data, message) => {
              if (status == 200) {
                // console.log("公司比较",data);
                this.compareLoading = false;
                this.viewCompareShow = true;
                this.viewScore = data;
              }
            });
            this.publicFun.httpRequest("get", '/mlams/candidate/getCandidateAssessmentInfo/' + userId, null, (status, data, message) => {
              if (status == 200) {
                // console.log("个人信息",data);
                this.userResult = data;
              }
            });
            this.publicFun.httpRequest("get", '/mlams/performanceModel/getPerformanceModelInfo/' + performanceModelId, null, (status, data, message) => {
              if (status == 200) {
                // console.log("绩优信息",data);
                this.modelResult = data;
              }
            });
          }else if(status == 300){
            this.compareLoading = false;
            this.$message({
              message: message,
              type: 'error'
            });
            document.querySelector("#viewPositionSelect input").focus();
          }
        });
      }
    }
  }
}
</script>
<style lang="stylus">
#view-compare
  button
    padding 7px 25px
  .psy-view-compare-title
    background-color #f7f7f7
    padding 10px
    border 1px solid #e0e0e0
  .psy-view-compare-left
    border 1px solid #e0e0e0
    background-color #f7f7f7
  .psy-view-compare-content
    li
      border 1px solid #e0e0e0
      background-color #fff
      margin-bottom 10px

</style>
