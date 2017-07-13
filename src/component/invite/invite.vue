<template>
<div id="invite">
  <nav class="tc mt-20">
    请选择您的测评需求
  </nav>
  <div class="tc f13 color-red mt-10" v-if="hasNoAccounts">
    <i class="iconfont color-red mr-5 f16 icon-caozuoshibai"></i>当前可测评数量不足，请联系商务人员增加
  </div>
  <section class="mt-40" :class="{ grayscale: hasNoAccounts }">
    <el-row>
      <el-col :span="12" class="loadInFirst">
        <div class="tr pr-60">
          <router-link to="/inviteAppraise">
            <div class="bd-1 p20 disinblock bg-color-white cp psy-invit-content trans-15">
              <div class="tr">
                <span class="f13">进入测评</span>
                <i class="iconfont color-blue f18 fr ml-5 psy-invit-content-icon icon-jiantou-copy"></i>
              </div>
              <div class="tc p20 psy-invite-test-cont">
                <i class="iconfont trans-15 icon-ceping-bukedianji"></i>
                <div class="f18 color-black trans-15">测评</div>
                <div class="mt-10 f12 mb-20 color-8 trans-15">您将获得测评人员的解读报告</div>
              </div>
            </div>
          </router-link>
        </div>
      </el-col>
      <el-col :span="12" class="loadInSecond">
        <div class="tl pl-60">
          <router-link to="/inviteModel">
            <div class="bd-1 p20 disinblock bg-color-white cp psy-invit-content trans-15">
              <div class="tr">
                <span class="f13">进入建模</span>
                <i class="iconfont color-blue f18 fr ml-5 psy-invit-content-icon">&#xe604;</i>
              </div>
              <div class="tc p20 psy-invite-model-cont">
                <i class="iconfont trans-15 icon-jianmo-kedianji"></i>
                <div class="f18 color-black trans-15">建立职业绩优模型</div>
                <div class="mt-10 f12 mb-20 color-8 trans-15">您将获得职位的绩优模型和人员的测评解读报告</div>
              </div>
            </div>
          </router-link>
        </div>
      </el-col>
    </el-row>
  </section>
</div>
</template>
<script>
export default {
  name: "invite",
  data: function data() {
    return {
      hasNoAccounts: false
    }
  },
  mounted() {
    this.$parent.activeIndex = "2";
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      // let companyId = "008f31833ade4e72b28ab13d3a09e157";
      this.publicFun.httpRequest("get", '/mlams/company/getCompanyBasicInfo/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log("首页信息", data);
          this.hasNoAccounts = data.assessmentCount == 0 ? true : false;
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
@import "../../assets/css/style.styl"
.psy-invit-content
  width 210px
  height 300px
  .psy-invit-content-icon
    margin-top -4px

.psy-invit-content:hover
  box-shadow 2px 2px 2px rgba(0, 0, 0, 0.09)

.psy-invit-content:hover i,.psy-invit-content:hover .color-black,.psy-invit-content:hover .color-8
    color mainColor

.psy-invit-content .color-black
  margin-top -15px


.psy-invite-test-cont i
  font-size 130px
  color #ecb125

.psy-invite-model-cont i
  font-size 130px
  color #f18de2
</style>

</style>
