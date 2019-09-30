<template>
  <div :style="{height: getHeight+'px'}">
    <div class="left">
      <div class="add" @click="clear">
        <Icon type="ios-add" size="22" />
      </div>
      <Row
        class="item"
        v-for="item,i of $root.projectList"
        :key="i"
        :class="isSelect(item.id) ? 'select' : ''"
      >
        <Col span="16" style="padding-left:10px;cursor: pointer;">
          <span @click="edit(item.id)" style="display:inline-block;width:100%;">{{item.name}}</span>
        </Col>
        <Col span="8" style="text-align:right;">
          <Icon type="md-copy" class="item-icon" color="#2d8cf0" @click="oncopy(item.id)"></Icon>
          <Icon
            type="ios-close-circle-outline"
            class="item-icon"
            color="#f10606"
            @click="onclose(item.id)"
          />
        </Col>
      </Row>
    </div>
    <div class="right">
      <Row>
        <Col span="16">
          <div class="row">
            <span class="labelName">项目名称：</span>
            <Input v-model="name" placeholder="请输入项目名称..." style="width: 198px" />&nbsp;&nbsp;
            <helpTips></helpTips>
          </div>
          <div class="row">
            <span class="labelName">数据源：</span>
            <Select v-model="db" style="width:200px" @on-change="dbChange">
              <Option v-for="item in $root.dbList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>&nbsp;&nbsp;
            <a href="javascript:void(0);" @click="refresh">刷新</a>&nbsp;(重新连接数据库)
          </div>
          <div class="row">
            <pathChoose v-model="output" title="输出目录" :width="300" style="margin-left: 40px;"></pathChoose>
          </div>
          <div class="row">
            <span class="labelName">项目语言：</span>
            <Select v-model="type" style="width:200px">
              <Option v-for="item in langList" :value="item" :key="item">{{ item }}</Option>
            </Select>
            &nbsp;&nbsp;
            Tips: <span style="color:red;">general：生成普通文本文件</span>
          </div>
          <div class="row" v-if="type != '' && type != 'general'">
            <span class="labelName">数据类型映射：</span>
            <Button style="width: 200px;" @click="dataMapping">修改</Button>
          </div>
          <java ref="java" v-if="type==='java'"></java>
          <general ref="general" v-else-if="type === 'general'"></general>
        </Col>
        <Col span="8">
          <div style="margin: 0 10px 10px 10px;">
            <Button type="primary" style="width:48%;margin-right:12px;" @click="save">保存</Button>
            <Button type="success" style="width:48%;" @click="exec" :disabled="!isExec">执行</Button>
          </div>
          <TableList ref="tables" v-model="tableList"></TableList>
        </Col>
      </Row>
    </div>
    <dataTypeMapping ref="mapping"></dataTypeMapping>
    <Modal
      v-model="resultModal"
      title="执行结果"
      :mask-closable="false"
      width="1000"
      :closable="closable"
    >
      <div class="result">
        <ul>
          <li v-for="item,index of results" :key="index">{{item}}</li>
        </ul>
      </div>
      <div slot="footer" style="padding:0;"></div>
    </Modal>
  </div>
</template>
<script>
import config from "@/libs/config";
import helpTips from "@/components/HelpTips";
import pathChoose from "@/components/PathChoose";
import TableList from "@/components/TableList";
import dataTypeMapping from "@/views/mapping/index";
import java from "./type/java";
import general from "./type/general";
import Service from "@/libs/service";

export default {
  components: {
    dataTypeMapping,
    helpTips,
    pathChoose,
    TableList,
    java,
    general
  },
  data() {
    return {
      closable: false,
      resultModal: false,
      results: [],
      service: new Service(),
      height: 0,
      langList: config.langType,
      tableList: [],
      id: "",
      name: "",
      db: "",
      output: "",
      type: ""
    };
  },
  created() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    },
    isExec() {
      return (
        this.name != "" &&
        this.db != "" &&
        this.output != "" &&
        this.type != "" &&
        this.tableList.length > 0
      );
    }
  },
  methods: {
    dataMapping(){
      let db = this.$root.dbList.find(it=> it.id === this.db);
      this.$refs.mapping.show(db.type, this.type);
    },
    clear() {
      if (this.type != "" && this.$refs[this.type]) {
        this.$refs[this.type].clear();
      }
      this.$refs.tables.clear();
      this.name = "";
      this.db = "";
      this.output = "";
      this.type = "";
      this.id = "";
    },
    dbChange(id) {
      let item = this.$root.dbList.find(it => it.id === id);
      if (item) {
        this.$refs.tables.setProps(item.props);
      }
    },
    refresh() {
      if (this.db != "") {
        let item = this.$root.dbList.find(it => it.id === this.db);
        if (item) {
          this.$refs.tables.setProps(item.props);
        }
      }
    },
    exec() {
      let props = this.$refs[this.type].getData();
      if(!props){
        return;
      }
      let item = this.$root.dbList.find(it => it.id === this.db);
      let data = {
        output: this.output,
        type: this.type,
        db: item.props,
        props: props,
        tableList: this.tableList
      };
      this.service.genTemplate(data, (item, isDown) => {
        if (!this.resultModal) {
          this.results = [];
          this.resultModal = true;
        }
        this.results.push(item);
        if (isDown) {
          this.closable = true;
          this.results.push("执行完成！");
        }
      });
    },
    save() {
      if (this.name === "") {
        this.$error("请填写项目名称！");
        return;
      }
      if (this.db === "") {
        this.$error("请选择数据源！");
        return;
      }
      if (this.output === "") {
        this.$error("请选择输出路径！");
        return;
      }
      if (this.type === "") {
        this.$error("请选择项目语言！");
        return;
      }
      let data = this.$refs[this.type].getData();
      if(!data){
        return;
      }
      let id = this.id === "" ? this.$genId() : this.id;
      if (this.id != "") {
        let index = this.$root.projectList.findIndex(it => it.id === this.id);
        this.$root.projectList.splice(index, 1);
      }
      let item = {
        id: id,
        name: this.name,
        db: this.db,
        output: this.output,
        type: this.type,
        props: data
      };
      this.$root.projectList.push(item);
      this.$root.saveConfig();
      this.$success("保存成功！");
      this.clear();
    },
    isSelect(id) {
      return this.id === id;
    },
    edit(id) {
      let item = this.$root.projectList.find(it => it.id === id);
      this.name = item.name;
      this.type = item.type;
      this.db = item.db;
      this.output = item.output;
      this.id = id;
      this.$nextTick(() => {
        this.$refs[this.type].setData(item.props);
        this.dbChange(item.db);
      });
    },
    onclose(id) {
      const _this = this;
      this.$confirm("确认删除？", () => {
        let index = _this.$root.projectList.findIndex(it => it.id === id);
        _this.$root.projectList.splice(index, 1);
        _this.$root.saveConfig();
        _this.load();
        _this.clear();
        _this.$success("删除成功！");
      });
    },
    oncopy(id){
      let newProject = this.$root.projectList.find(it=>it.id === id);
      this.$root.projectList.push({
        id: this.$genId(),
        name: newProject.name + '_copy',
        db: newProject.db,
        output: newProject.output,
        type: newProject.type,
        props: newProject.props
      });
      _this.$root.saveConfig();
      this.$success("复制成功！");
    }
  }
};
</script>
<style scoped>
@import './index.css';
</style>
