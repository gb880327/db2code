<template>
  <div>
    <div class="row">
      <span class="labelName">服务器地址：</span>
      <Input v-model="host" placeholder="请输入服务器地址..." style="width: 198px" />
    </div>
    <div class="row">
      <span class="labelName">服务器端口：</span>
      <Input v-model="port" type="number" placeholder="请输入服务器端口..." style="width: 198px" />
    </div>
    <div class="row">
      <span class="labelName">数据库名称：</span>
      <Input v-model="dbName" placeholder="请输入数据库..." style="width: 198px" />
    </div>
    <div class="row">
      <span class="labelName">数据表前缀：</span>
      <Input v-model="prefix" placeholder="请输入数据表前缀..." style="width: 198px" />
    </div>
    <div class="row">
      <span class="labelName">用户名：</span>
      <Input v-model="userName" placeholder="请输入用户名..." style="width: 198px" />
    </div>
    <div class="row">
      <span class="labelName">密码：</span>
      <Input v-model="passWord" type="password" placeholder="请输入密码..." style="width: 198px" />
    </div>
  </div>
</template>
<script>
export default {
  name: "mysql",
  data() {
    return {
      vailHost: true,
      host: "localhost",
      port: 3306,
      dbName: "",
      userName: "root",
      passWord: "",
      prefix: ""
    };
  },
  methods: {
    setData(data) {
      this.vailHost = true;
      if (data) {
        this.host = data.host ? data.host : "localhost";
        this.port = data.port ? data.port : 3306;
        this.dbName = data.dbName ? data.dbName : "";
        this.userName = data.userName ? data.userName : "";
        this.passWord = data.passWord ? data.passWord : "";
        this.prefix = data.prefix ? data.prefix : "";
      }
    },
    getData() {
      if (!this.vailHost) {
        return false;
      }
      if (this.port == "" || this.port == 0) {
        this.$error(this, "请填写服务器端口！");
        return false;
      }
      if (this.dbName == "") {
        this.$error(this, "请填写数据库名称！");
        return false;
      }
      if (this.userName == "") {
        this.$error(this, "请填写用户名！");
        return false;
      }
      return {
        host: this.host,
        port: this.port,
        dbName: this.dbName,
        prefix: this.prefix,
        userName: this.userName,
        passWord: this.passWord
      };
    },
    clear() {
      this.vailHost = true;
      this.host = "";
      this.port = 3360;
      this.dbName = "";
      this.userName = "";
      this.passWord = "";
      this.prefix = "";
    },
    blurHanlder() {
      let reg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
      if (
        this.host != "localhost" &&
        this.host != "127.0.0.1" &&
        !reg.test(this.host)
      ) {
        this.vailHost = false;
        this.$error("请填写正确的IP地址！");
      } else {
        this.vailHost = true;
      }
    }
  }
};
</script>