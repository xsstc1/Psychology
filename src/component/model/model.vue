<template>
<div id="model" class="p30">
  <article class="loadInFirst" v-loading.body="modelLoading">
    <header class="cb">
      <span class="f14 fl" :class="{ color_red: countNull}">当前职位模型数量：{{modelCounts}}</span>
      <router-link to="/inviteModel">
        <el-button class="fr new-model-btn" type="primary" size="small">新建绩优模型</el-button>
      </router-link>
    </header>
    <section class="mt-15">
      <header class="p10 psy-index-table-header">
        <el-row :gutter="20" class="tc f14">
          <el-col :span="3">
            <div>序号</div>
          </el-col>
          <el-col :span="4">
            <div>职位名称</div>
          </el-col>
          <el-col :span="6">
            <div>完成数/总样本数</div>
          </el-col>
          <el-col :span="5">
            <div>创建时间</div>
          </el-col>
          <el-col :span="6">
            <div>操作</div>
          </el-col>
        </el-row>
      </header>
      <ul class="psy-index-list loadInSecond" v-if="countShow">
        <li class="p10" v-for="(model,i) in modelList">
          <el-row :gutter="20" class="tc f13">
            <el-col :span="3">
              <div>{{i + 1}}</div>
            </el-col>
            <el-col :span="4">
              <div>{{model.performanceModelName}}</div>
            </el-col>
            <el-col :span="6">
              <div class="color-blue cp" @click="viewModelInfo(model)">{{model.proportion}}</div>
            </el-col>
            <el-col :span="5">
              <div>{{model.createdTime | formatDate}}</div>
            </el-col>
            <el-col :span="6">
              <el-button size="small" type="text" class="f13 mr-5" :class="{color_gray : !model.viewState}" @click="psyModelView(model)">查看</el-button>
              <el-popover placement="bottom" width="200" trigger="click">
                <p class="tc">确认删除？</p>
                <div class="tc pb-10 mt-5">
                  <el-button class="psy-popover-btn" type="primary" size="mini" @click="modelDelConfirm(model)"> 确 定 </el-button>
                  <el-button class="psy-popover-btn psy-popover-border-btn" size="mini" @click="modelDelCancel"> 取 消 </el-button>
                </div>
                <el-button size="small" slot="reference" type="text" class="color-red f13 ml-5">删除</el-button>
              </el-popover>
            </el-col>
          </el-row>
        </li>
      </ul>
    </section>
    <div class="block tc mt-30 psy-pagination" v-if="modelModelPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" small layout="prev, pager, next" :total="modelCounts" :page-size="10" :current-page="1"></el-pagination>
    </div>
    <div class="tc model_empty loadInFirst" v-if="countNull">
      <img src="../../assets/img/modelEmpty.svg" alt="">
      <p>暂无绩优模型，赶快去
        <router-link :to="{ name: 'invite'}">创建</router-link>吧！</p>
    </div>
  </article>

</div>
</template>
<script>
import {
  Loading
} from 'element-ui';

export default {
  name: "model",
  data: function data() {
    return {
      modelCounts: 0,
      modelList: [],
      countShow: true,
      countNull: false,
      modelLoading: false,
      modelModelPage: false,
      modelPage:1
    }
  },
  mounted() {
    this.$parent.activeIndex = "4";
    this.getModelList(1);
  },
  activated(){
    this.getModelList(this.modelPage);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getModelList(val);
      this.modelPage = val;
    },
    psyModelView(model) {
      if (model.viewState == true) {
        this.$router.push({
          path: 'modelView',
          query: {
            id: model.performanceModelId,
            name: model.performanceModelName,
            num: model.proportion,
            time: model.createdTime,
          }
        });
      } else {
        this.$message({
          showClose: false,
          message: '该模型下尚未有人完成测评',
          type: 'error'
        });
      }

    },
    modelDelCancel() {
      document.querySelector("#app").click();
    },
    modelDelConfirm(model) {
      let modelDelData = {
        "performanceModelId": model.performanceModelId,
        "isDeleted": 1
      }
      this.publicFun.httpRequest("post", '/mlams/performanceModel/deletePerformanceModel', JSON.stringify(modelDelData), (status, data, message) => {
        if (status == 200) {
          this.modelList.splice(this.modelList.indexOf(model), 1); //删除对应条目
          document.querySelector("#app").click();
        } else {
          console.log("删除失败")
        }
      });

    },
    getModelList(page) {
      this.modelLoading = true;
      if (localStorage.psyCompanyInfo) {
        let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
        // let companyId = "008f31833ade4e72b28ab13d3a09e157";
        this.publicFun.httpRequest("get", '/mlams/performanceModel/getPerformanceModelList/' + companyId + '/10/' + page, null, (status, data, message) => {
          if (status == 200) {
            // console.log("绩优模型", data);
            this.modelLoading = false;
            this.modelCounts = data.count;
            if (data.count == 0) {
              this.countShow = false;
              this.countNull = true;
            } else {
              this.modelList = data.list;
              for (let i = 0; i < this.modelList.length; i++) {
                this.modelList[i].visible = false;
              };
              if (data.count > 10) {
                this.modelModelPage = true;
              } else {
                this.modelModelPage = false;
              }

            }
          }
        });
      } else {
        this.$router.push({
          path: '/login'
        });
      }
    },
    viewModelInfo(model) {
      this.$router.push({
        path: '/modelInfo',
        query: {
          performanceModelId: model.performanceModelId,
          performanceModelName: model.performanceModelName
        }
      }); //向url中传递参数
    }
  }
}
</script>
<style lang="stylus">
#model
  .new-model-btn
    padding 10px 15px
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

</style>
