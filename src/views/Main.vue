<template>
  <div class="main" :style="{height: getHeight+'px'}">
    <div class="plane">
      <div class="content">
        <span>项目：</span>
        <Select v-model="project.name" style="width:200px" @on-change="changeHandler">
          <Option v-for="item in projectList" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>&nbsp;&nbsp;
        <Button
          :loading="runing"
          type="primary"
          icon="md-arrow-dropright-circle"
          :disabled="projectInfo == null || tableList.length == 0"
          @click="exec"
        >
          <span v-if="!runing">执行</span>
          <span v-else>运行中...</span>
        </Button>
        <span class="tips" v-if="projectList.length == 0">
          <a href="javascript:void(0);" @click="gotoProject">添加项目</a>
        </span>
      </div>
      <div class="row" v-if="showTable">
        <div style="color:red;margin:2px 10px;">请选择需要执行的数据表！</div>
        <TableList ref="tables" v-model="tableList"></TableList>
      </div>
      <div style="padding-left:10px;">运行结果：</div>
      <div class="result">
        <ul>
          <li v-for="item,index of results" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import TableList from "@/components/TableList";
import config from "@/libs/config";
import TemplateUtil from "@/libs/template";
import Service from "@/libs/service";

export default {
  components: {
    TableList
  },
  data() {
    return {
      height: 0,
      project: {
        name: "",
        path: ""
      },
      projectList: [],
      results: [],
      service: new Service(),
      tableList: [],
      showTable: false,
      projectInfo: null,
      runing: false
    };
  },
  mounted() {
    this.service.listProject().then(data => {
      this.projectList = data;
    });
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    changeHandler() {
      this.project = this.projectList.find(it => it.name == this.project.name);
      if (this.project) {
        this.service
          .getInfo(this.$path.join(config.project, this.project.fileName))
          .then(data => {
            if (data) {
              this.projectInfo = data;
              this.showTable = true;
              this.$nextTick(() => {
                this.$refs.tables.setProps(data.dataBase.props);
              });
            }
          });
      }
    },
    exec() {
      this.runing = true;
      this.results = [];
      let templateUtil = new TemplateUtil();
      templateUtil.genTemplate(this.projectInfo, this.tableList, item => {
        if (item == "done") {
          this.runing = false;
          item = "执行完成！";
          this.$success("执行完成！");
        }
        this.results.push(item);
      });
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
  min-height: 50px;
  max-height: 400px;
  font-size: 14px;
  overflow-y: scroll;
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
