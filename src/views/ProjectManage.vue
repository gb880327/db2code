<template>
  <div :style="{height: getHeight+'px'}">
    <div class="moduleTitle">项目管理</div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Button type="text" class="addItem" @click="addItem">新增</Button>
        </div>
        <div class="left-list" :style="{height: (getHeight - 38)+'px'}">
          <ul class="itemList">
            <li
              v-for="item in projectList"
              :key="item.name"
              :id="item.name"
              @click="itemClick(item)"
            >
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="right" class="pane split-right" :style="{height:getHeight+'px'}">
        <Tabs v-model="currentTab" type="line" @on-click="tabClickHandler">
          <TabPane label="项目信息" name="project">
            <div class="row">
              <span class="labelName">项目名称：</span>
              <Input v-model="data.name" placeholder="请输入项目名称..." style="width: 198px"/>
              &nbsp;&nbsp;
              <helpTips></helpTips>
            </div>
            <div class="row">
              <span class="labelName">项目包名：</span>
              <Input v-model="data.package" placeholder="请输入packageName..." style="width:198px;"></Input>
            </div>
            <div class="row">
              <span class="labelName">swagger API：</span>
              <i-switch size="large" v-model="data.swagger">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>
            <div class="row">
              <pathChoose v-model="data.output" title="输出目录" :width="400" style="margin-left: 40px;"></pathChoose>
            </div>
            <div class="row">
              <div class="templateList" v-for="item,i in data.templateList" :key="i">
                <div class="item">
                  <div class="col"  style="width:94%;">
                    <div class="row">
                      <div class="col">
                        <span style="padding-left: 24px;">模板：</span>
                        <Select v-model="item.template" style="width:180px" placement="top-start">
                          <Option
                            v-for="item in templateList"
                            :value="item.fileName"
                            :key="item.name"
                            :disabled="templateShow(item.path)"
                          >{{ item.name }}</Option>
                        </Select>
                      </div>
                      <div class="col">
                        <span class="labelName" style="min-width:60px;">包名：</span>
                        {{data.package}}.&nbsp;
                        <Input v-model="item.package" style="width:120px;"></Input>
                      </div>
                      <div class="col">
                        <span class="labelName" style="min-width:60px;">文件名：</span>
                        <Input v-model="item.fileName" style="width:200px;"></Input>
                      </div>
                    </div>
                    <!-- <pathChoose title="输出目录" v-model="item.output" :width="480"></pathChoose> -->
                  </div>
                  <div class="col" style="width:6%;vertical-align: top;">
                    <a class="delItem" href="javascript:void(0);" @click="delTemp(item.id)" v-if="data.templateList.length > 1">删除</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="row" style="padding-left:100px;">
              <span class="tips" v-if="templateList.length == 0">
                <a
                  href="javascript:void(0);"
                  @click="$router.push({ path: '/TemplateManage' })"
                >添加模板</a>
              </span>
            </div>
            <Button class="add" @click="addTemp">添加</Button>
          </TabPane>
          <TabPane label="数据源" name="db">
            <DBManage ref="dbManage"></DBManage>
          </TabPane>
          <div slot="extra">
            <Button
              type="primary"
              class="btn"
              style="width:120px;margin-left:100px;"
              @click="save"
            >保存</Button>
            <Button
              type="error"
              class="btn"
              v-if="current.name != ''"
              style="width:120px;"
              @click="delItem"
            >删除项目</Button>
          </div>
        </Tabs>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";
import DBManage from "@/components/DBManage";
import DataBaseUtil from "@/libs/database";
import Service from "@/libs/service";
import helpTips from "@/components/HelpTips";


export default {
  components: {
    pathChoose,
    DBManage,
    helpTips
  },
  data() {
    return {
      split: 0.2,
      height: 0,
      current: {
        name: "",
        path: ""
      },
      currentTab: "project",
      data: {
        name: "",
        package: "",
        output: "",
        swagger: false,
        dataBase: {
          dbType: "mysql"
        },
        templateList: [
          {
            fileName: "",
            package:"",
            template: ""
          }
        ]
      },
      projectList: [],
      templateList: [], //模板列表
      project: new Service()
    };
  },
  mounted() {
    this.loadData();
    this.project.listTemplate().then(data => {
      this.templateList = data;
    });
    this.dbList = this.$getDataForObj(config.dbList);
    this.dbList = this.dbList == null ? [] : this.dbList;

    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height - 32;
    }
  },
  methods: {
    loadData() {
      this.projectList.splice(0, this.projectList.length);
      this.project.listProject().then(data => {
        this.projectList = data;
      });
    },
    templateShow(path) {
      return (
        this.data.templateList.findIndex(item => item.template == path) >= 0
      );
    },
    itemClick(item) {
      this.currentTab = "project";
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        if (it.getAttribute("id") == item.name) {
          it.className = "selected";
        } else {
          it.className = "";
        }
      }
      this.current = item;
      this.project.getInfo(this.$path.join(config.project, item.fileName)).then(data => {
        if (data) {
          this.data = data;
          this.$nextTick(() => {
            this.$refs.dbManage.setData(this.data.dataBase);
          });
        }
      });
    },
    addTemp() {
      this.data.templateList.push({
        fileName:"",
        package:"",
        template: ""
      });
    },
    delTemp(path) {
      this.data.templateList.splice(
        this.data.templateList.findIndex(it => it.template == path),
        1
      );
    },
    addItem() {
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        it.className = "";
      }
      this.data = {
        id: 0,
        name: "",
        package: "",
        swagger: false,
        dataBase: {},
        templateList: [
          {
            template: 1,
            output: ""
          }
        ]
      };
      this.currentTab = "project";
      if (this.$refs.dbManage) {
        this.$refs.dbManage.clear();
      }
    },
    save() {
      if (this.data.name === "") {
        this.$error("请填写项目名称！");
        return;
      }
      if (this.data.package === "") {
        this.$error("请填写项目包名！");
        return;
      }
      for (let item of this.data.templateList) {
        if (item.template === '' || item.output === "") {
          this.$error("请填写完整的模板信息！");
          return;
        }
      }
      let dataBase = this.$refs.dbManage.getData();
      if (!dataBase) {
        return;
      }
      this.data.dataBase = dataBase;
      this.project.saveProject(this.current.name, this.data).then(data => {
        if (data) {
          this.$success("保存成功！");
          this.addItem();
          this.loadData();
        } else {
          this.$error("保存失败！");
        }
      });
    },
    delItem() {
      this.project
        .delProject(this.current.name, this.$path.join(config.project, this.current.fileName))
        .then(data => {
          if (data) {
            this.$success("删除成功！");
            this.addItem();
            this.loadData();
          } else {
            this.$error("删除失败！");
          }
        });
    },
    tabClickHandler(name) {
      if (name === "db") {
        this.$nextTick(() => {
          this.$refs.dbManage.setData(this.data.dataBase);
        });
      }
    }
  }
};
</script>
<style scoped>
.add {
  margin: 0 100px;
  width: 480px;
  border: 1px dashed #dcdee2;
}
.add:focus {
  box-shadow: none;
}
.templateList {
  padding-left: 30px;
}
.templateList .item {
  margin: 5px 0;
  padding: 0 0 0 10px;
  border: 1px dashed #8080804f;
}
.delItem{
    display: inline-block;
    height: 50px;
    vertical-align: middle;
    line-height: 50px;
    width: 100%;
    text-align: center;
    background-color: #ed4014;
    color: #FFFFFF;
    margin: 1px -1px;
}
.delItem:hover{
  background-color: #f16643;
}
</style>
