<template>
  <div class="main" :style="{height: getHeight+'px'}">
    <div class="plane">
      <span class="title">系统设置：</span>
      <div class="content">
        <pathChoose v-model="dataPath" @change="selectPath"></pathChoose>
      </div>
    </div>

    <div class="plane">
      <div class="content">
        <span>项目：</span>
        <Select v-model="projectId" style="width:200px">
          <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>&nbsp;&nbsp;
        <Button
          type="primary"
          icon="md-arrow-dropright-circle"
          :disabled="projectId == 0"
          @click="exec"
        >执行</Button>
        <span class="tips" v-if="projectList.length == 0">
          <a href="javascript:void(0);" @click="gotoProject">添加项目</a>
        </span>
      </div>
      <div class="result">
        <ul>
          <li v-for="item,index of results" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import pathChoose from "@/views/PathChoose";
import config from "@/libs/config";
const { dialog } = require("electron").remote;
import DataBaseUtil from "@/libs/database";
import TemplateUtil from "@/libs/template";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      height: 0,
      dataPath: "",
      projectId: 0,
      projectList: [],
      results: []
    };
  },
  mounted() {
    this.$listFileForFolder(config.getProjectPath()).then(data => {
      if (data.length > 0) {
        data.forEach(item => {
          if (item.endsWith(".json")) {
            this.$readForFile(config.getProjectPath() + "/" + item).then(
              ret => {
                if (ret) {
                  this.projectList.push(JSON.parse(ret));
                }
              }
            );
          }
        });
      }
    });
    this.$nextTick(() => {
      this.dataPath = this.$getDataForStr(config.dataPath);
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    exec() {
      this.results = [];
      let project = this.projectList.find(item => item.id == this.projectId);
      let templateUtil = new TemplateUtil();
      templateUtil.genTemplate(project, item => {
        if (item == "done") {
          item = "执行完成！";
          this.$success("执行完成！");
        }
        this.results.push(item);
      });
    },
    selectPath(path) {
      this.$saveData(config.dataPath, this.dataPath);
    },
    gotoProject() {
      this.$router.push({ path: "/projectManage" });
    }
  }
};
</script>
<style scoped>
.plane {
  border: 1px solid #d0d0d0;
  margin-top: 10px;
}
.plane .title {
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0 5px 20px;
  background-color: #d0d0d0;
  display: block;
  width: 100%;
}
.plane .content {
  padding: 10px 20px;
}
.plane .result {
  background-color: #080606bd;
  color: #ffffff;
  margin: 10px;
  height: 400px;
  font-size: 14px;
}
.plane .result ul {
  list-style: none;
  margin: 0px;
  padding: 5px 0 0 0;
}
.plane .result ul li {
  padding: 0px;
  margin: 2px 0 2px 10px;
}
</style>
