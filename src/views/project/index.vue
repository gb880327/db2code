<template>
  <div :style="{height: getHeight+'px'}" >
    <div class="left">
      <div class="add" @click="clear">
        <Icon type="ios-add" size="22" />
      </div>
      <Row
        class="item"
        v-for="item,i of projectList"
        :key="i"
        :class="isSelect(item.id) ? 'select' : ''"
      >
        <Col span="20" style="padding-left:10px;cursor: pointer;">
          <span @click="edit(item.id)" style="display:inline-block;width:100%;">{{item.name}}</span>
        </Col>
        <Col span="4" style="text-align:right;">
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
              <Option v-for="item in dbList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="row">
            <pathChoose v-model="output" title="输出目录" :width="300" style="margin-left: 40px;"></pathChoose>
          </div>
          <div class="row">
            <span class="labelName">项目语言：</span>
            <Select v-model="type" style="width:200px">
              <Option v-for="item in langList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div>
          <java ref="java" v-if="type==='java'"></java>
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
  </div>
</template>
<script>
import config from "@/libs/config";
import helpTips from "@/components/HelpTips";
import pathChoose from "@/components/PathChoose";
import TableList from "@/components/TableList";
import java from "./type/java";

export default {
  components: {
    helpTips,
    pathChoose,
    TableList,
    java
  },
  data() {
    return {
      height: 0,
      langList: config.langType,
      dbList: [],
      projectList: [],
      tableList: [],
      id: "",
      name: "",
      db: "",
      output: "",
      type: ""
    };
  },
  created() {
    this.load();
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    },
    isExec(){
        return this.name != "" && this.db != "" && this.output != "" && this.type != "";
    }
  },
  methods: {
    clear() {
      if (this.type != "") {
        this.$refs[this.type].clear();
      }
      this.name = "";
      this.db = "";
      this.output = "";
      this.type = "";
      this.id = "";
    },
    load() {
      this.projectList = this.$getDataForObj(this.$PROJECT);
      this.projectList = this.projectList == null ? [] : this.projectList;
      this.dbList = this.$getDataForObj(this.$DATASOURCE);
      this.dbList = this.dbList == null ? [] : this.dbList;
    },
    dbChange(id) {
      let item = this.dbList.find(it => it.id === id);
      if (item) {
        this.$refs.tables.setProps(item.props);
      }
    },
    exec() {},
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
      let id = this.id === "" ? this.$genId() : this.id;
      if (this.id != "") {
        let index = this.projectList.findIndex(it => it.id === this.id);
        this.projectList.splice(index, 1);
      }
      let item = {
        id: id,
        name: this.name,
        db: this.db,
        output: this.output,
        type: this.type,
        props: this.$refs[this.type].getData()
      };
      this.projectList.push(item);
      this.$saveData(this.$PROJECT, this.projectList);
      this.$success("保存成功！");
      this.clear();
    },
    isSelect(id) {
      return this.id === id;
    },
    edit(id) {
      let item = this.projectList.find(it => it.id === id);
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
        let index = _this.projectList.findIndex(it => it.id === id);
        _this.projectList.splice(index, 1);
        _this.$saveData(_this.$PROJECT, _this.projectList);
        _this.load();
        _this.clear();
        _this.$success("删除成功！");
      });
    }
  }
};
</script>
<style scoped>
.select {
  background-color: #ece7e7;
}
.item {
  margin: 5px 0;
  border: 1px solid #80808059;
  padding: 5px 0;
  border-radius: 5px;
}
.item-icon {
  font-size: 18px;
  margin-right: 5px;
  font-weight: bold;
  cursor: pointer;
  vertical-align: text-bottom;
}
.left {
  height: 100%;
  padding: 0 10px;
  display: inline-block;
  border-right: 1px solid #dcdee2;
  width: 200px;
}
.right {
  width: calc(100% - 220px);
  display: inline-block;
  margin: 10px 10px;
  vertical-align: top;
  height: 100%;
  overflow-y: scroll;
}
.add {
  border: 1px dashed #80808099;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
}
</style>
