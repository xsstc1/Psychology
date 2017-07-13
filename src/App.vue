<template>
<div id="app" :class="{ contract: isContract }">
  <header id="psy-header" class="cb">
    <div class="fl psy-header-logo tc">
      <router-link to="/">
        <img class="psy-header-logo-large" src="./assets/img/logo.png" alt="">
        <i class="iconfont icon-logo1 f40 psy-header-logo-small hide color-white"></i>
      </router-link>
    </div>
    <div class="f20 psy-header-bread">
      <div class="fr">
        <div class="fl mr-40 tc psy-header-service cp" @click="serviceSale = true" v-if="this.$store.state.customerStatus">
          <i class="iconfont icon-zhuanshuxiaoshourenyuan f32"></i>
          <div class="f12">专属销售人员</div>
        </div>
        <div class="fr pr-20 psy-header-mean cp" v-if="this.$store.state.companyInfo">
          <el-popover ref="popover" placement="bottom" width="400" trigger="click" popper-class="psy-header-logo-btn">
            <ul class="">
              <li @click="modifyPass" class="bb-1 tc pb-15">修改密码</li>
              <li @click="companyInfoShow" class="bb-1 tc pb-15 mt-5">公司信息</li>
              <li @click="loginOut" class="tc mt-5">退出</li>
            </ul>
          </el-popover>
          <span class="cb" v-popover:popover>
            <img class="fl" width="46px" height="46px" :src="this.$store.state.companyLogo" alt="">
            <i class="el-icon-caret-bottom el-icon--right fl mt-35 ml-10 color-hui f13"></i>
          </span>
        </div>
      </div>
    </div>

  </header>
  <aside id="psy-aside" class="fl w20 pf" v-if="loginPage">
    <el-row class="tac psy-aside-mean pt-20 bg-color-white">
      <div>
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo">
          <router-link to="/">
            <el-menu-item index="1"><i class="iconfont ml-10 mr-10 f40 fl mean-index-tab"></i><span class="f14 psy-aside-word fl">首页</span></el-menu-item>
          </router-link>
          <router-link to="/invite">
            <el-menu-item index="2"><i class="iconfont ml-10 mr-10 f40 fl mean-invite-tab"></i><span class="f14 psy-aside-word fl">邀请测评</span></el-menu-item>
          </router-link>
          <router-link to="/view">
            <el-menu-item index="3"><i class="iconfont ml-10 mr-10 f40 fl mean-view-tab"></i><span class="f14 psy-aside-word fl">查看测评</span></el-menu-item>
          </router-link>
          <router-link to="/model">
            <el-menu-item index="4"><i class="iconfont ml-10 mr-10 f40 fl mean-model-tab"></i><span class="f14 psy-aside-word fl">绩优模型</span></el-menu-item>
          </router-link>
        </el-menu>
      </div>
      <div class="mt-25 tr">
        <button @click="contractAside" class="psy-aside-show-btn"><i class="iconfont icon-gengduo"></i></button>
      </div>
      <el-col :span="24" class="p20 mt-30 f13 fadeIn psy-aside-info" v-if="false">
        <el-col :span="24" class="bts-1 pt-30 f12">
          若您使用中发现任何问题，随时联系您的专属销售人员：
        </el-col>
        <el-row>
          <el-col :span="4" class="mt-30">
            <i class="iconfont f20">&#xe676;</i>
          </el-col>
          <el-col :span="20" class="mt-35 f14 color-black">
            {{this.$store.state.salesmanName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="mt-10">
            <i class="iconfont f20">&#xe66e;</i>
          </el-col>
          <el-col :span="20" class="mt-15 f14">
            <a :href="this.$store.state.salesmanMobileNumberHref">{{this.$store.state.salesmanMobileNumber}}</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="mt-10">
            <i class="iconfont f20">&#xe66d;</i>
          </el-col>
          <el-col :span="20" class="mt-15 f14">
            <a :href="this.$store.state.salesmanEmailHref">{{this.$store.state.salesmanEmail}}</a>
          </el-col>
        </el-row>
      </el-col>
      <div class="tc f12 psy-aside-version">
        版本号：v1.2.1
      </div>
    </el-row>
  </aside>
  <article id="psy-content">
    <keep-alive include="view,model">
      <router-view>
      </router-view>
    </keep-alive>
  </article>
  <el-dialog title="专属销售人员 :" v-model="serviceSale" size="tiny" custom-class="service-dialog">
    <div class="cb service-content f14">
      <div class="fl color-black">
        <p>商务人员：{{this.$store.state.salesmanName}}</p>
        <p>联系电话：<a :href="this.$store.state.salesmanMobileNumberHref">{{this.$store.state.salesmanMobileNumber}}</a></p>
        <p>电子邮件：<a :href="this.$store.state.salesmanEmailHref">{{this.$store.state.salesmanEmail}}</a></p>
      </div>
      <div class="fr pt-15 pr-10">
        <img width="80px" height="80px" :src="this.$store.state.wechatQrCode" alt="">
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      customerStatus: false,
      companyInfo: false,
      salesmanName: "",
      salesmanMobileNumber: "",
      salesmanEmail: "",
      salesmanMobileNumberHref: "",
      salesmanEmailHref: "",
      companyLogo: "",
      loginPage: true,
      activeIndex: "1",
      serviceSale: false,
      isContract: false,
      asideWordShow: true
    };
  },
  methods: {
    loginOut() {
      let loginOutData = {
        "mlamsUserId": JSON.parse(localStorage.psyCompanyInfo).mlamsUserId
      }
      this.publicFun.httpRequest("post", '/mlams/businessUser/logout', JSON.stringify(loginOutData), (status, data, message) => {
        if (status == 200) {
          this.$router.push({
            path: '/login'
          });
          localStorage.clear();
          this.$store.state.customerStatus = false;
          this.$store.state.companyInfo = false;
        }
      });
    },
    companyInfoShow() {
      document.querySelector("#app").click();
      this.$router.push({
        path: '/companyInfo'
      });
    },
    modifyPass() {
      document.querySelector("#app").click();
      this.$router.push({
        path: '/changePass'
      });
    },
    contractAside() {
      if (this.isContract == false) {
        this.isContract = true;
      } else {
        this.isContract = false;
      }

    }

  },
  mounted: function() {
    if (localStorage.psyCompanyInfo) {
      const companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      if (localStorage.salesInfo) {
        let salesInfo = JSON.parse(localStorage.salesInfo);
        this.$store.state.salesmanName = salesInfo.salesmanName;
        this.$store.state.wechatQrCode = salesInfo.salesmanWechatQrCode;
        this.$store.state.salesmanMobileNumber = salesInfo.salesmanMobileNumber;
        this.$store.state.salesmanEmail = salesInfo.salesmanEmail;
        this.$store.state.salesmanMobileNumberHref = "tel:" + salesInfo.salesmanName;
        this.$store.state.salesmanEmailHref = "mailto:" + salesInfo.salesmanEmail;
        this.$store.state.customerStatus = true;
      } else {
        this.publicFun.httpRequest("get", `/mlams/businessAffairs/getBusinessAffairsInfo/${companyId}`, null, (status, data, message) => {
          if (status == 200) {
            console.log("销售数据", data);
            this.$store.state.salesmanName = data.salesmanName;
            this.$store.state.salesmanMobileNumber = data.salesmanMobileNumber;
            this.$store.state.wechatQrCode = data.salesmanWechatQrCode;
            this.$store.state.salesmanEmail = data.salesmanEmail;
            this.$store.state.salesmanMobileNumberHref = "tel:" + data.salesmanName;
            this.$store.state.salesmanEmailHref = "mailto:" + data.salesmanEmail;
            this.$store.state.customerStatus = true;
          }
        });
      };
      if (localStorage.accountInfo) {
        let accountInfo = JSON.parse(localStorage.accountInfo);
        this.$store.state.companyLogo = accountInfo.companyLogo;
        this.$store.state.companyInfo = true;
      } else {
        this.publicFun.httpRequest("get", '/mlams/company/getCompanyBasicInfo/' + companyId, null, (status, data, message) => {
          if (status == 200) {
            // console.log("首页信息", data);
            this.$store.state.companyLogo = data.companyLogo;
            this.$store.state.companyInfo = true;
            window.localStorage.accountInfo = JSON.stringify(data);
          }
        });
      };
    } else {
      if (this.$route.query.code == undefined) {
        this.$router.push({
          path: '/login'
        });
      }
    }
  }
}
</script>
<style lang="stylus">

@import "./assets/css/style.styl"

  .contract
    .psy-header-logo
      width 100px
      .psy-header-logo-small
        display block
      .psy-header-logo-large
        display none
    #psy-aside
      width 100px
      .psy-aside-word
        display none
      .psy-aside-version
        opacity 0
      .el-menu
        width 99px
      .icon-gengduo
        transform rotate(180deg)
    #psy-content
      margin-left 100px

.service-dialog
  max-width 550px
  width 37%
  .el-dialog__header
    position relative
  .el-dialog__title:before
    content "在使用过程中如有任何问题，可联系您的专属商务人员"
    font-size 12px
    position absolute
    bottom -17px
    width 100%
    color #999
  .el-dialog__body
    margin-top 35px
    .service-content
      margin-top -20px
      p
        margin-bottom 5px
        margin-top 10px
      .color-black
        color #1f2d3d

.psy-header-logo-btn
  width 95px!important
  top 80px!important
  border 1px solid #dddddd!important
  li
    padding 10px
    font-size 14px
    cursor pointer
    transition color .5s
  li:hover
    color mainColor
  .bb-1
    border-bottom 1px solid #e4e4e4
    a
      color fontColor
  .popper__arrow
    left 47%!important
// CSS样式部分
#psy-header
  background-color #fff
  color  fontColor
  position fixed
  top 0
  width 100%
  z-index 99

.el-dropdown-menu a
  color fontColor!important
.psy-header-bread
  img
    margin-top 17px
  .psy-header-service
    line-height 1.3
    margin-top 15px
    transition color .5s
  .psy-header-service:hover
    color mainColor

#psy-aside
  width asideWidth
  height 100%
  padding-top 75px
  overflow auto
  background-color #fff
  transition all .5s
  .icon-gengduo
    display inline-block
    transition all .5s
  .psy-aside-mean
    li
      i.mean-index-tab:before
        content "\e66c"
      i.mean-invite-tab:before
        content "\e671"
      i.mean-view-tab:before
        content "\e65e"
      i.mean-model-tab:before
        content "\e663"
    li.is-active
      i.mean-index-tab:before
        content "\e66a"
      i.mean-invite-tab:before
        content "\e675"
      i.mean-view-tab:before
        content "\e65f"
      i.mean-model-tab:before
        content "\e667"
  .psy-aside-info
    margin-bottom 120px
  .psy-aside-version
    position fixed
    bottom 0
    width asideWidth
    left -1px
    padding 20px 0
    background-color #fff
    opacity 1
  .psy-aside-show-btn
    background-color #f1f1f1
    height 75px
    width 20px
    text-align center
    padding 0
    border 1px solid #dedede
    border-right none
    border-top-left-radius 5px
    color #676767
    border-bottom-left-radius 5px
    cursor pointer

#psy-content
    margin-left asideWidth
    padding-top 85px
    transition margin-left .7s

#index
    padding 30px

.psy-header-logo
  background-color mainColor
  height 80px
  line-height 80px
  width asideWidth
  color #fff
  max-width 240px
  transition all .5s
  img
    margin-top 20px
    width 60%

.el-breadcrumb
    font-size 16px
    line-height inherit

.psy-header-bread
    line-height 80px
    height 80px
    border-bottom 1px solid #e4e4e4
    .psy-header-mean
      height 80px
      padding-left 35px
      transition background-color .5s
      position relative
    .psy-header-mean:before
      content ""
      width 1px
      height 60px
      background-color #e4e4e4
      position absolute
      left 0
      top 10px
    .psy-header-mean:hover
      background-color #f1f1f1
.el-menu
    background-color #fff
    width 209px

.psy-aside-mean
    border-right borderStyle
    height 100%

.el-menu li
    font-size 15px

.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active:before
    content ""
    height 100%
    width 4px
    position absolute
    background mainColor
    left 0
    top 0

.el-menu-item, .el-submenu__title
    height 70px
    line-height 70px

.psy-aside-exit
    bottom 0
    left 0
    width asideWidth
    border-right borderStyle

.psy-aside-mean li
     color fontColor
</style>
