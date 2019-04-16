<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%', padding: '0 10px'}">
        <Button type="primary" shape="circle" icon="md-home" @click="gotoPath('/')"></Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" icon="ios-briefcase" @click="gotoPath('/ProjectManage')">项目管理</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" icon="md-code-working" @click="gotoPath('/TemplateManage')">模板配置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" icon="ios-cog" @click="$refs.setting.show()">系统设置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      </Header>
      <Content :style="{margin: '75px 10px 0', background: '#fff', height: (height-116)+'px'}">
        <router-view ref="view"></router-view>
      </Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>
    <Setting ref="setting"></Setting>
  </div>
</template>

<script>
// @ is an alias to /src
import config from "@/libs/config";
import Setting from "@/views/setting";

export default {
  components:{
    Setting
  },
  data() {
    return {
      height: document.documentElement.clientHeight
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    gotoPath(path) {
      this.$router.push({ path: path });
    },
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
      this.$nextTick(() => {
        this.$refs.view.height = this.height - 116;
      });
    }
  }
};
</script>
<style>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.menu {
  width: 100%;
  position: fixed;
}
.layout-footer-center {
  text-align: center;
  padding: 10px 0 10px 0;
}
.content {
  border-top: 1px solid #dcdee2;
}
.pane {
  padding: 10px;
}
.split-left {
  border-top: 1px solid #dcdee2;
  border-left: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
}
.split-right {
  padding: 10px 20px;
  border-top: 1px solid #dcdee2;
  border-right: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
  overflow-y: scroll;
}
.left-list {
  width: 100%;
  overflow-y: scroll;
}
.left-opt {
  border-bottom: 1px solid #dcdee2;
  width: 100%;
  height: 35px;
}
.itemList {
  list-style: none;
  padding: 0;
  margin: 0;
}
.itemList li {
  padding: 5px 10px;
  margin: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #dcdee2;
  border-radius: 5px;
  color: black;
}
.itemList li:hover {
  background-color: #b0b4bb;
}
.itemList .selected {
  background-color: #515a6c;
  color: #ffffff;
}
.row {
  margin: 10px 0;
}
.col {
  display: inline-block;
}
.labelName {
  display: inline-block;
  min-width: 100px;
  text-align: right;
}
.btn {
  margin: 0 5px;
}
.moduleTitle {
  padding: 4px 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #b0b4bb69;
  margin-bottom: 2px;
}
.addItem {
  width: 100%;
  font-weight: bold;
}
.tips{
  padding-left:15px;
}
.tips a{
  color: red;
}
</style>

