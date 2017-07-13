<template>
<div id="modelInfo" class="p30" @keyup.enter="modelInfoSearchBtn">
  <article class="loadInFirst" v-loading.body="modelInfoLoading">
    <header class="cb">
      <span class="f14 fl">{{modelInfoName}}的模型样本测试详情</span>
      <el-button @click="addModelInfoNew" class="fr new-model-btn" type="primary" size="small">添加测评信息</el-button>
    </header>
    <section class="mt-15">
      <header class="p10 psy-index-table-header">
        <el-row :gutter="20" class="tc f14">
          <el-col :span="2">
            <div>序号</div>
          </el-col>
          <el-col :span="3">
            <div>姓名</div>
          </el-col>
          <el-col :span="5">
            <div>邮箱</div>
          </el-col>
          <el-col :span="3">
            <div>电话</div>
          </el-col>
          <el-col :span="3">
            <div>
              <el-popover placement="bottom" width="60" trigger="click">
                <ul class="tc change-model-ul">
                  <li id="modelInfoAll" @click="changeModelInfo($event)" class="bb-1">全部</li>
                  <li id="modelInfoTest" @click="changeModelInfo($event)" class="bb-1">测试中</li>
                  <li id="modelInfoWait" @click="changeModelInfo($event)" class="bb-1">待测试</li>
                  <li id="modelInfoComplete" @click="changeModelInfo($event)">已完成</li>
                </ul>
                <el-button class="change-model-status" slot="reference" type="text">测评状态<i class="el-icon-caret-bottom ml-5 f12 cp"></i></el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="4">
            <div>完成时间</div>
          </el-col>
          <el-col :span="4">
            <div>操作</div>
          </el-col>
        </el-row>
      </header>
      <ul class="psy-index-list loadInSecond">
        <li class="p10" v-for="(modelInfo,i) in modelInfoList">
          <el-row :gutter="20" class="tc f13">
            <el-col :span="2">
              <div>{{i + 1}}</div>
            </el-col>
            <el-col :span="3">
              <div>{{modelInfo.name}}</div>
            </el-col>
            <el-col :span="5">
              <div>{{modelInfo.email}}</div>
            </el-col>
            <el-col :span="3">
              <div>{{modelInfo.mobileNumber | emptyMobile}}</div>
            </el-col>
            <el-col :span="3">
              <div>{{modelInfo.assessmentStatus | setStatus}}</div>
            </el-col>
            <el-col :span="4">
              <div :class="{color_gray : !modelInfo.assessmentFinishTime}">{{modelInfo.assessmentFinishTime | formatDateView}}</div>
            </el-col>
            <el-col :span="4">
              <el-button :class="{color_gray : !modelInfo.assessmentReportUrl}" size="small" type="text" class="f13 mr-5" @click="psyModelInfoView(modelInfo)">查看</el-button>
              <el-popover placement="bottom" width="200" trigger="click">
                <p class="tc">确认删除？</p>
                <div class="tc pb-10 mt-5">
                  <el-button class="psy-popover-btn" type="primary" size="mini" @click="modelInfoDelConfirm(modelInfo)"> 确 定 </el-button>
                  <el-button class="psy-popover-btn psy-popover-border-btn" size="mini" @click="modelDelCancel"> 取 消 </el-button>
                </div>
                <el-button size="small" slot="reference" type="text" class="color-red f13 ml-5">删除</el-button>
              </el-popover>
            </el-col>
          </el-row>
        </li>
      </ul>
    </section>
    <div class="block tc mt-30 psy-pagination" v-if="modelInfoPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" small layout="prev, pager, next" :total="modelInfoCounts" :page-size="10"></el-pagination>
    </div>
    <div class="tc model_empty loadInFirst" v-if="countNull">
      <img src="../../assets/img/modelEmpty.svg" alt="">
      <p>暂无数据</p>
    </div>
  </article>
  <el-dialog class="model-info-dialog" title="选择需要添加的人员" v-model="modelInfoDialog" size="small">
    <el-form :model="modelInfoSearch">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item>
            <el-select filterable class="w" v-model="modelInfoSearch.positionName" placeholder="请选择职位" size="small" clearable>
              <el-option v-for="modelInfoPosition in modelInfoPositionData" :key="modelInfoPosition" :label="modelInfoPosition" :value="modelInfoPosition"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-select filterable class="w" v-model="modelInfoSearch.name" placeholder="请输入姓名" size="small" clearable>
              <el-option v-for="modelInfoName in modelSearchListTotal" :key="modelInfoName.name" :label="modelInfoName.name" :value="modelInfoName.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item class="w tr">
            <el-button @click="modelInfoSearchBtn" class="model-info-search-btn" type="primary">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <article>
      <nav class="cb"><span class="fl">当前共{{searchCounts}}条数据</span><span class="fr f12 color-blue">已选中 {{selectPerson}} 人</span></nav>
      <section class="mt-15">
        <header class="p10 psy-index-table-header">
          <el-row :gutter="20" class="tc f14">
            <el-col :span="2">
              <div>
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
              </div>
            </el-col>
            <el-col :span="5">
              <div>姓名</div>
            </el-col>
            <el-col :span="9">
              <div>职位信息</div>
            </el-col>
            <el-col :span="8">
              <div>测评完成时间</div>
            </el-col>
          </el-row>
        </header>
        <ul class="psy-index-list">
          <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
            <li v-for="modelSearchList in modelSearchListData">
              <el-row :gutter="20" class="tc f13">
                <el-col :span="2">
                  <div>
                    <el-checkbox :label="modelSearchList"></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div>{{modelSearchList.name}}</div>
                </el-col>
                <el-col :span="9">
                  <div>{{modelSearchList.positionName}}</div>
                </el-col>
                <el-col :span="8">
                  <div>{{modelSearchList.assessmentFinishTime | formatDate}}</div>
                </el-col>
              </el-row>
            </li>
          </el-checkbox-group>
        </ul>
      </section>
      <footer class="mt-25 model-info-search-footer">
        <el-row :gutter="20">
          <el-col :span="12" class="tr">
            <el-button @click="addModelInfoData" type="primary">确定</el-button>
          </el-col>
          <el-col :span="12" class="tl">
            <el-button @click="modelInfoDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </footer>
    </article>
  </el-dialog>
</div>
</template>
<script>
import {
  Loading
} from 'element-ui';

export default {
  name: "modelInfo",
  data: function data() {
    return {
      modelInfoCounts: 0,
      modelInfoList: [],
      modelInfoPositionData: [],
      modelInfoNameData: [],
      countNull: false,
      modelInfoLoading: false,
      modelInfoPage: false,
      modelInfoStatus: null,
      modelInfoName: this.$route.query.performanceModelName,
      modelInfoDialog: false,
      modelInfoSearch: {
        name: "",
        positionName: ""
      },
      checkAll: false,
      checkedList: [],
      modelSearchListData: [],
      modelSearchListTotal: [],
      searchCounts:0,
      selectPerson:0
    }
  },
  mounted() {
    if (localStorage.psyCompanyInfo) {
      this.$parent.activeIndex = "4";
      this.getModelInfoList(1, null);
    } else {
      this.$router.push({
        path: '/login'
      });
    }
  },
  filters: {
    setStatus(value) {
      switch (value) {
        case 1:
          return "待测试";
          break;
        case 2:
          return "测试中";
          break;
        case 3:
          return "已完成";
          break;
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    addModelInfoNew() {
      this.modelInfoDialog = true;
      this.selectPerson = 0;
      this.checkedList = [];
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      let performanceModelId = this.$route.query.performanceModelId;
      this.publicFun.httpRequest("get", '/mlams/candidate/getOtherPerformanceModelFinishedAssessmentCandidatesPositionName/' + companyId + "/" + performanceModelId, null, (status, data, message) => {
        if (status == 200) {
          this.modelInfoPositionData = data;
        }
      });
      this.publicFun.httpRequest("get", '/mlams/candidate/getOtherPerformanceModelFinishedAssessmentCandidates/' + companyId + "/" + performanceModelId, null, (status, data, message) => {
        if (status == 200) {
          // console.log(data);
          this.modelSearchListData = data.list;
          this.modelSearchListTotal = data.list;
          this.searchCounts = data.list.length
        }
      });
    },
    modelInfoSearchBtn(){
      let searchInfo = this.modelInfoSearch;
      this.modelSearchListData = [];
      for(let i in this.modelSearchListTotal){
        if(searchInfo.name!=""&&searchInfo.positionName==""){
          if(searchInfo.name==this.modelSearchListTotal[i].name){
            this.modelSearchListData.push(this.modelSearchListTotal[i])
          }
        }else if(searchInfo.name==""&&searchInfo.positionName!=""){
          if(searchInfo.positionName==this.modelSearchListTotal[i].positionName){
            this.modelSearchListData.push(this.modelSearchListTotal[i])
          }
        }else if(searchInfo.name!=""&&searchInfo.positionName!=""){
          if(searchInfo.positionName==this.modelSearchListTotal[i].positionName&&searchInfo.name==this.modelSearchListTotal[i].name){
            this.modelSearchListData.push(this.modelSearchListTotal[i])
          }
        }else{
          this.modelSearchListData = this.modelSearchListTotal
        }
      }
      this.searchCounts = this.modelSearchListData.length;
    },
    handleCurrentChange(val) {
      this.getModelInfoList(val, this.modelInfoStatus);
    },
    modelDelCancel() {
      document.querySelector("#app").click();
    },
    handleCheckAllChange(event) {
      this.checkedList = event.target.checked ? this.modelSearchListData : [];
      this.selectPerson = this.checkedList.length;
    },
    handleCheckedListChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.modelSearchListData.length;
      this.selectPerson = this.checkedList.length;
    },
    addModelInfoData() {
      // console.log(this.checkedList);
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      let performanceModelId = this.$route.query.performanceModelId;
      let addArray = [];
      for (let item in this.checkedList) {
        addArray.push(this.checkedList[item].userId);
      }
      let addModelInfo = {
        "userId": addArray,
        "performanceModelId": performanceModelId,
        "companyId": companyId
      }
      this.publicFun.httpRequest("post", '/mlams/candidate/addCandidatesToPerformanceModel', JSON.stringify(addModelInfo), (status, data, message) => {
        if (status == 200) {
          this.modelInfoDialog = false;
          this.$message.success('恭喜您添加成功');
          this.getModelInfoList(1, null);
          this.modelInfoSearch.name = "";
          this.modelInfoSearch.positionName = "";
        }
      });
    },
    modelInfoDelConfirm(modelInfo) {
      let userId = modelInfo.userId;
      let performanceModelId = this.$route.query.performanceModelId;
      this.publicFun.httpRequest("get", '/mlams/performanceModel/deletePerformanceModelAssessmentCandidate/' + userId + "/" + performanceModelId, null, (status, data, message) => {
        if (status == 200) {
          this.modelInfoList.splice(this.modelInfoList.indexOf(modelInfo), 1); //删除对应条目
          document.querySelector("#app").click();
        } else {
          console.log("删除失败")
        }
      });
    },
    getModelInfoList(page, status) {
      if (localStorage.psyCompanyInfo) {
        this.modelInfoLoading = true;
        let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
        let performanceModelId = this.$route.query.performanceModelId;
        var modelInfoData = {
          "performanceModelId": performanceModelId,
          "assessmentStatus": status,
          "companyId": companyId
        }
        this.publicFun.httpRequest("post", '/mlams/performanceModel/getPerformanceModelAssessmentCandidates/10/' + page, JSON.stringify(modelInfoData), (status, data, message) => {
          if (status == 200) {
            // console.log("绩优详情", data);
            if (data.count > 10) {
              this.modelInfoPage = true;
              this.countNull = false;
            } else if (data.count == 0) {
              this.countNull = true;
              this.modelInfoPage = false;
            } else {
              this.modelInfoPage = false;
              this.countNull = false;
            }
            this.modelInfoLoading = false;
            this.modelInfoList = data.candidatelist;
            this.modelInfoCounts = data.count;
          }
        });
      } else {
        this.$router.push({
          path: '/login'
        });
      }
    },
    psyModelInfoView(modelInfo) {
      if(modelInfo.assessmentReportUrl!=null){
        window.open(modelInfo.assessmentReportUrl, "_blank")
      }else if(modelInfo.assessmentReportUrl==null && modelInfo.assessmentFinishTime!=null){
        this.$message.error('报告尚未生成，请稍后');
      }else if(modelInfo.assessmentReportUrl==null && modelInfo.assessmentFinishTime==null){
        this.$message.error('此人尚未完成测评');
      }
    },
    changeModelInfo(event) {
      // console.log(event)
      switch (event.target.id) {
        case "modelInfoAll":
          this.getModelInfoList(1, null);
          this.modelInfoStatus = null;
          document.querySelector("#app").click();
          break;
        case "modelInfoTest":
          this.getModelInfoList(1, 2);
          this.modelInfoStatus = 2;
          document.querySelector("#app").click();
          break;
        case "modelInfoWait":
          this.getModelInfoList(1, 1);
          this.modelInfoStatus = 1;
          document.querySelector("#app").click();
          break;
        case "modelInfoComplete":
          this.getModelInfoList(1, 3);
          this.modelInfoStatus = 3;
          document.querySelector("#app").click();
          break;
      }
    }
  }
}
</script>
<style lang="stylus">
.el-popover
  min-width 50px
.change-model-ul
  li
    padding 10px 0
    font-size 13px
    cursor pointer
  li:hover
    color #20a0ff
  .bb-1
    border-bottom 1px solid #ececec
#modelInfo
  .new-model-btn
    padding 10px 15px
  .change-model-status
    padding 0
    color #6c8299
  .color_gray
    color #a7a7a7
  .model_empty
    margin-top 80px
    img
      width 240px
    p
      margin-top -30px
      letter-spacing 1px
      a
        color #379aff
.model-info-dialog
  .model-info-search-btn
    padding 8px 25px
    font-size 13px
  .psy-index-list
    margin 7px 0
    overflow auto
    height 250px
    li
      margin 7px 0
      padding 10px
  .model-info-search-footer
    button
      padding 10px 25px
  input
    border-radius 2px
  .el-checkbox__label
    display none

</style>
