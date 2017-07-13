<template>
<div id="index">
  <div class="loadInFirst cb">
    <div v-if="hasDeadline" class="fl mr-20">
      <div class="bg-purple bd-1 p10 bg-color-white grid-content index-endDate" v-loading.body="dateLoading">
        <header class="cb">
          <div class="fl p5">
            <i class="iconfont f18 icon-youxiaoqixian"></i><span class="f15 ml-10">测评有效期至</span>
          </div>
          <div class="fr p5" v-if="nearEnd">
            <i class="iconfont f16 color-yellow icon-tishi"></i><span class="f12 ml-5 color-red">即将到期</span>
          </div>
        </header>
        <article class="mt-10 tc mb-5">
          <span class="psy-num-font color-blue" :class="{ grayscale: extendedEnd }">{{deadline | formatDateShort}}</span>
          <div class="color-red f12 extendedEnd" v-if="extendedEnd">
            （请联系您的专属销售人员进行续期）
          </div>
        </article>
      </div>
    </div>
    <div v-if="hasAssessmentCount" class="fl">
      <div class="bg-purple bd-1 p10 bg-color-white grid-content index-endCounts" v-loading.body="dateLoading">
        <header class="cb">
          <div class="fl p5">
            <i class="iconfont f18 icon-shengyuminge"></i><span class="f15 ml-10">剩余测评数量</span>
          </div>
        </header>
        <article class="mt-10 tc mb-5">
          <span class="psy-num-font color-blue" :class="{ grayscale: hasNoAccounts }">{{assessmentCount}}</span>
          <div class="color-red f12 extendedEnd" v-if="hasNoAccounts">
            （请联系您的专属销售人员进行充值）
          </div>
        </article>
      </div>
    </div>
  </div>
  <article class="mt-30 loadInSecond">
    <nav class="pl-10">最近完成测评的信息</nav>
    <section class="mt-30 psy-index-table" v-loading.body="dataLoading"  v-if="indexTitleEmpty">
      <header class="p10 psy-index-table-header">
        <el-row :gutter="20" class="tc f14">
          <el-col :span="3">
            <div>序号</div>
          </el-col>
          <el-col :span="3">
            <div>姓名</div>
          </el-col>
          <el-col :span="6">
            <div>邮箱</div>
          </el-col>
          <el-col :span="4">
            <div>测评职位</div>
          </el-col>
          <el-col :span="4">
            <div>完成时间</div>
          </el-col>
          <el-col :span="4">
            <div>操作</div>
          </el-col>
        </el-row>
      </header>
      <ul class="psy-index-list">
        <li class="p10" v-for="(index, i) in indexList">
          <el-row :gutter="20" class="tc f13">
            <el-col :span="3">
              <div>{{i+1}}</div>
            </el-col>
            <el-col :span="3">
              <div>{{index.name}}</div>
            </el-col>
            <el-col :span="6">
              <div>{{index.email}}</div>
            </el-col>
            <el-col :span="4">
              <div>{{index.positionName}}</div>
            </el-col>
            <el-col :span="4">
              <div>{{index.assessmentFinishTime | formatDate}}</div>
            </el-col>
            <el-col :span="4">
              <a class="color-blue cp" :href="index.assessmentReportUrl" target="_blank">查看</a>
            </el-col>
          </el-row>
        </li>
      </ul>
    </section>
  </article>
  <footer class="mt-70 tc index-empty loadInSecond" v-if="indexEmpty">
    <img width="350px" src="../../assets/img/index_empty.png" alt="">
    <div class="mt-30 f14">
      暂无完成测评的人员信息，先去
      <router-link to="/invite"><span class="color-blue">邀请测评</span></router-link>吧！
    </div>
  </footer>
  <!-- <a href="http://vue.airtoy.cn/538d46129aaa4c12bebb305d36222c13.pdf" target="_blank">查看PDF</a> -->
</div>
</template>
<script>
export default {
  name: "index",
  data: function data() {
    return {
      deadline: 0,
      indexList: [],
      dateLoading: true,
      dataLoading: true,
      assessmentCount: "--",
      hasAssessmentCount: true,
      hasDeadline: true,
      nearEnd: false,
      extendedEnd: false,
      hasNoAccounts: false,
      indexEmpty:false,
      indexTitleEmpty:true
    }
  },
  mounted() {
    this.$parent.loginPage = true;
    this.$parent.activeIndex = "1";
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      // let companyId = "008f31833ade4e72b28ab13d3a09e157";
      // 首页列表数据
      this.publicFun.httpRequest("get", '/mlams/business/getRecentFinishedAssessmentCandidates/' + companyId + '/1/12/1', null, (status, data, message) => {
        if (status == 200) {
          // console.log("首页列表", data);
          this.dataLoading = false;
          if(data.length == 0){
            this.indexEmpty = true;
            this.indexTitleEmpty = false
          }else{
            this.indexList = data;
          }
        }
      });
      this.publicFun.httpRequest("get", '/mlams/company/getCompanyBasicInfo/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log("首页信息", data);
          this.deadline = data.deadline;
          this.dateLoading = false;
          this.assessmentCount = data.assessmentCount;
          this.hasNoAccounts = data.assessmentCount == 0 ? true : false;
          this.hasAssessmentCount = data.hasAssessmentCount == 1 ? true : false;
          this.hasDeadline = data.hasDeadline == 1 ? true : false;
          if (data.deadline - new Date().valueOf() < 7 * 24 * 3600 * 1000) {
            this.nearEnd = true;
          } else if (data.deadline - new Date().valueOf() < 0) {
            this.nearEnd = false;
            this.extendedEnd = true
          }
        }
      });
    } else {
      this.$router.push({
        path: '/login'
      });
    }
  },
  methods: {

  }
}
</script>
<style lang="stylus">
.index-endDate
  width 322px
.index-endCounts
  width 289px
.grid-content
  height 142px
  .extendedEnd
    margin-top -5px
.psy-num-font
  font-size 55px

.el-table th>.cell
  font-weight 400

.psy-index-table
  min-height 100px
  tr
    margin 5px 0

.psy-index-table-header
  padding 10px
  background-color #f1f1f1;
  border 1px solid #ddd

.psy-index-list
  margin 10px 0

.psy-index-list li
  background-color #fff
  border 1px solid #ddd
  margin 7px 0

#psy-content
  .index-empty
    img
      width 250px
    div
      margin-top 10px
      letter-spacing 1px

</style>
