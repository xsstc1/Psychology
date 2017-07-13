import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

export function getHttpHead(s) {
  var r = new RegExp("(http.*\/\/[^\/]+\/)");
  var a = r.exec(s);
  if (a) {
    return a[1];
  }
};

export function setIntNum(data) {
  return Math.round(data * 100);
}

// 处理空电话号码
export function emptyMobile(data) {
  if (data == "" || data == null) {
    return "-"
  } else {
    return data
  }
}

// 时间转换成时间戳
export function get_unix_time(dateStr) {
  var newstr = dateStr.replace(/-/g, '/');
  var date = new Date(newstr);
  var time_str = date.getTime().toString();
  return time_str.substr(0, 13);
}

// 添加OSS前缀
export function addOssUrl(url) {
  return "http://osspdf.milihr.com/" + url
}

// 时间戳转化成时间
export function formatDate(date) {
  var now = new Date(date);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (minute < 10) {
    var minute = "0" + now.getMinutes();
  } else if (second < 10) {
    var second = "0" + now.getSeconds();
  }
  return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

export function formatDateView(date) {
  if (date == null) {
    return "未完成"
  } else {
    var now = new Date(date);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }
}

export function formatDateShort(date) {
  var now = new Date(date);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (minute < 10) {
    var minute = "0" + now.getMinutes();
  } else if (second < 10) {
    var second = "0" + now.getSeconds();
  }
  return year + "-" + month + "-" + date;
}

export function formatDateShortView(date) {
  if (date == null) {
    return "未完成"
  } else {
    var now = new Date(date);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date;
  }
}

//验证邮箱格式是否正确
export function verityEmail(data) {
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data)) {
    return true;
  } else {
    return false;
  }
}

//验证电话号码是否正确
export function verityMobile(data) {
  var regu = /^[1][0-9][0-9]{9}$/;
  var re = new RegExp(regu);
  if (re.test(data)) {
    return false;
  } else if (data == undefined || data == "") {
    return false;
  } else {
    return true;
  }
}

// 获取URL参数
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = "";
  if (r != null)
    context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}

// 网络传输
export function httpRequest(type, url, data, callback) {
  Vue.http[type](url, data, {
    headers: {},
    emulateJSON: true
  }).then(response => {
    let result = response.body;
    if (result.status == 200) {
      callback(result.status, result.data, result.message);
    } else if (result.status == 1000) { //状态值待定
      if (localStorage.psyLoginInfo) {
        let loginAuto = {
          loginName: JSON.parse(localStorage.psyLoginInfo).loginName,
          password: JSON.parse(localStorage.psyLoginInfo).password
        }
        Vue.http.post('/mlams/businessUser/login', JSON.stringify(loginAuto), {
          headers: {},
          emulateJSON: true
        }).then(response => {
          let result = response.body;
          if (result.status == 300) {
            location.href = "/psychology/#/login";
          } else {
            console.log("重新登陆成功");
            location.reload();
          }

        }, response => {

        });
      } else {
        console.log("重新登陆不成功");
        location.reload();
      }
    } else {
      callback(result.status, result.data, result.message);
    }
  }, response => {
    // 这里是处理错误的回调
    console.log("错误", response);
  });
}
