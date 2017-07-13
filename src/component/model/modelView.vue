<template>
<div id="modelView" class="p30">
  <div class="loadInFirst">
    <div class="f15">1.创建信息</div>
    <div class="bg-color-white bd-1 p15 mt-15 disinblock f13">
      <span class="mr-50">
        <i class="iconfont color-blue f16 mr-5">&#xe62c;</i>
        <span>职位名称：</span>
      <span>{{modelPositionName}}</span>
      </span>
      <span class="mr-50">
        <i class="iconfont color-blue f16 mr-5">&#xe64e;</i>
        <span>创建时间：</span>
      <span>{{modelCreatTime | formatDateShort}}</span>
      </span>
      <span>
        <i class="iconfont color-blue f16 mr-5">&#xe64f;</i>
        <span>模型创建样本数：</span>
      <span><i class="color-blue fn">{{modelNum}}</i></span>
      </span>
    </div>
  </div>
  <div class="loadInSecond">
    <div class="f15 mt-50">2.{{modelPositionName}}的模型详情</div>
    <section class="mt-20 w90">
      <header class="p10 psy-index-table-header">
        <el-row :gutter="20" class="tc f14">
          <el-col :span="6">
            <div>维度</div>
          </el-col>
          <el-col :span="6">
            <div>结果</div>
          </el-col>
          <el-col :span="12">
            <div>说明</div>
          </el-col>
        </el-row>
      </header>
      <ul class="psy-index-list" v-if="true">
        <li class="p10 psy-model-ability pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>智商（IQ）</div>
            </el-col>
            <el-col :span="4" :offset="2">
              <div>{{modelData.iqValue}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.iqExplanation}}</div>
            </el-col>
          </el-row>
        </li>
        <li class="p10 psy-model-ability pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>思维方式</div>
            </el-col>
            <el-col :span="4" :offset="2">
              <div>{{modelData.thinkingPatternName}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.thinkingPatternExplanation}}</div>
            </el-col>
          </el-row>
        </li>
        <li class="p10 psy-model-ability pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>行为倾向</div>
            </el-col>
            <el-col :span="4" :offset="2">
              <div>{{modelData.behaviorStyleName}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.behaviorStyleExplanation}}</div>
            </el-col>
          </el-row>
        </li>
        <li class="p10 psy-model-stable pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>动机</div>
            </el-col>
            <el-col :span="4" :offset="2">
              <div>{{modelData.motivationName}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.motivationExplanation}}</div>
            </el-col>
          </el-row>
        </li>
        <li class="p10 psy-model-stable pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>价值观</div>
            </el-col>
            <el-col :span="4" :offset="2">
              <div>{{modelData.valueName}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.valueExplanation}}</div>
            </el-col>
          </el-row>
        </li>
        <li class="p10 psy-model-relationship pr">
          <el-row :gutter="20" class="tl f13 disflex">
            <el-col :span="4" :offset="2">
              <div>情商（EQ）</div>
            </el-col>
            <el-col  :span="4" :offset="2">
              <div>{{modelData.eqValue}}</div>
            </el-col>
            <el-col :span="12">
              <div>{{modelData.eqExplanation}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div class="mt-15 tr f12">
        <span class="mr-20 cb disinblock"><span class="fr">工作能力</span><span class="fr psy-model-ability-tip disinblock"></span></span>
        <span class="mr-20 cb disinblock"><span class="fr">工作稳定</span><span class="fr psy-model-stable-tip disinblock"></span></span>
        <span class="cb disinblock"><span class="fr">人际关系</span><span class="fr psy-model-relationship-tip disinblock"></span></span>
      </div>
    </section>
  </div>

</div>
</template>
<script>
export default {
  name: "modelView",
  data: function data() {
    return {
      modelPositionName: "",
      modelCreatTime: 0,
      modelNum: 0,
      modelCount: 0,
      modelData: ""
    }
  },
  mounted() {
    this.$parent.activeIndex = "4";
    let performanceModelId = this.$route.query.id;
    let modelPostData = {
      "performanceModelId": performanceModelId
    }
    this.publicFun.httpRequest("post", '/mlams/performanceModel/updatePerformanceModelInfo', JSON.stringify(modelPostData), (status, data, message) => {
      if (status == 200) {
        // console.log("请求成功", data);
        console.log(this.$route.query.time)
        this.modelPositionName = this.$route.query.name;
        this.modelCreatTime = parseInt(this.$route.query.time);
        this.modelNum = this.$route.query.num;
        this.modelCount = this.$route.query.count;
        this.publicFun.httpRequest("get", '/mlams/performanceModel/getPerformanceModelInfo/' + performanceModelId, null, (status, data, message) => {
          if (status == 200) {
            this.modelData = data;
          }
        });
      }
    });
  }
}
</script>
<style lang="stylus">
modelViewLeft()
  content ''
  width 7px
  height 100%
  position absolute
  left 0
  top 0

modelViewTip()
  width 15px
  height 15px
  margin-right 5px

#modelView
  .psy-model-ability:before
    modelViewLeft()
    background-color #44DCB5
  .psy-model-stable:before
    modelViewLeft()
    background-color #3FA5FB
  .psy-model-relationship:before
    modelViewLeft()
    background-color #9B3FFB
  .psy-model-ability-tip
    modelViewTip()
    background-color #44DCB5
  .psy-model-stable-tip
    modelViewTip()
    background-color #3FA5FB
  .psy-model-relationship-tip
    modelViewTip()
    background-color #9B3FFB

</style>
