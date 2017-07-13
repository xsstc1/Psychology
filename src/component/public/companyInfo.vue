<template>
<div id="companyInfo" class="pt-30 pb-30" v-loading.body="companyInfoLoading">
  <article id="company-content" class="bd-1 p30 bg-color-white loadInSecond">
    <header class="bbs-1 pb-20">
      <div class="f16 color-black">公司信息</div>
      <small class="color-b3">以下是您的公司信息，您可以填写公司必要信息，上传公司logo和公司简介</small>
    </header>
    <section>
      <ul class="color-6 f14">
        <li class="cb">
          <span class="fl">公司logo :</span><span class="ml-40 disinblock fl"><img class="fl bd-1" width="120px" height="120px" :src="companyInfo.companyLogo" alt=""></span>
        </li>
        <li>
          <span>公司名称 :</span><span class="ml-40">{{companyInfo.companyName | setData}}</span>
        </li>
        <li>
          <span>公司简称 :</span><span class="ml-40">{{companyInfo.shortCompanyName | setData}}</span>
        </li>
        <li>
          <span>公司网址 :</span><span class="ml-40">{{companyInfo.companyWebsite | setData}}</span>
        </li>
        <li>
          <span>所在行业 :</span><span class="ml-40">{{companyInfo.industryName | setData}}</span>
        </li>
        <li>
          <span>公司类型 :</span><span class="ml-40">{{companyInfo.companyTypeName | setData}}</span>
        </li>
        <li>
          <span>公司地址 :</span><span class="ml-40">{{companyInfo.companyAddress | setData}}</span>
        </li>
        <li>
          <span>公司邮箱 :</span><span class="ml-40">{{companyInfo.companyEmail | setData}}</span>
        </li>
        <li>
          <span>公司简介 :</span><span class="ml-40">{{companyInfo.companyIntroduce | setData}}</span>
        </li>
      </ul>
    </section>
  </article>
</div>
</template>
<script>
export default {
  name: "companyInfo",
  data: function data() {
    return {
      companyInfo:"",
      companyInfoLoading:true
    }
  },
  filters: {
    setData(value) {
      if(value===null){
        return "--"
      }else{
        return value
      }
    }
  },
  mounted(){
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      this.publicFun.httpRequest("get", '/mlams/company/getCompanyDetailInfo/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          this.companyInfoLoading = false;
          this.companyInfo = data;
        } else {
          this.$message.error(message);
        }
      });
    }else {
      this.$router.push({
        path: '/login'
      });
    }

  }
}
</script>
<style lang="stylus">
#company-content
  width 75%
  max-width 800px
  margin 0 auto
  .company-edit
    padding 10px 30px
  section
    ul
      li
        margin 25px 0 40px 0
</style>
