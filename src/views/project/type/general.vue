<template>
  <div>
    <div class="row">
      <div class="templateList" v-for="item,i in template" :key="i">
        <div class="item" style="height:54px;">
          <Row>
            <Col span="2" style="padding-top: 18px;">
              <Checkbox v-model="item.checked"></Checkbox>
              <span>模板：</span>
            </Col>
            <Col span="4" style="text-align:left; padding-top: 8px;">
              <Treeselect
                v-model="item.templateId"
                :instanceId="i"
                :multiple="false"
                :options="templateList"
                style="width:150px;"
              ></Treeselect>
            </Col>
            <Col span="8" style="text-align:left;padding-top: 12px;">
              <span class="labelName" style="min-width:65px;">文件目录：</span>
              <Input v-model="item.fileDir" style="width:120px;"></Input>
            </Col>
            <Col span="7" style="text-align:left;padding-top: 12px;">
              <span class="labelName" style="min-width:52px;">文件名：</span>
              <Input v-model="item.fileName" style="width:160px;"></Input>
            </Col>
            <Col span="3">
              <a
                class="delItem"
                href="javascript:void(0);"
                @click="delTemp(i)"
                v-if="template.length > 1"
              >删除</a>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <Button class="add" @click="addTemp">添加</Button>
  </div>
</template>
<script>
export default {
  name: "general",
  data() {
    return {
      templateList: [],
      template: [
        {
          checked: true,
          fileName: "",
          fileDir: "",
          templateId: ""
        }
      ]
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.templateList = [];
      let tmpList = this.$getDataForObj(this.$TEMPLATE);
      tmpList = tmpList == null ? [] : tmpList;
      this.templateList.push({ id: "", label: "请选择" });
      tmpList.forEach(item => {
        let parent = { id: 'parent_'+item.id, label: item.name, children: [] };
        item.template.forEach(it => {
          parent.children.push({
            id: it.fileName,
            label: it.name
          });
        });
        this.templateList.push(parent);
      });
    },
    templateShow(id) {
      return this.template.findIndex(item => item.templateId === id) >= 0;
    },
    delTemp(index) {
      this.template.splice(index, 1);
    },
    addTemp() {
      this.template.push({
        checked: true,
        fileName: "",
        fileDir: "",
        templateId: ""
      });
    },
    getData() {
      if (this.package === "") {
        this.$error("请填写项目包名！");
        return;
      }
      for (let item of this.template) {
        if (item.templateId === "" || item.fileName === "") {
          this.$error("请填写完整的模板信息！");
          return;
        }
        if(item.templateId.startsWith('parent_')){
          this.$error("请选择正确的模板，而不是模板分类！");
          return;
        }
      }
      return {
        template: this.template
      };
    },
    setData(data) {
      this.template = data.template;
      this.load();
    },
    clear() {
      this.template = [
        {
          checked: true,
          fileName: "",
          fileDir: "",
          tempPath: ""
        }
      ];
    }
  }
};
</script>
<style scoped>
.add {
  width: 100%;
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
.delItem {
  display: inline-block;
  height: 50px;
  vertical-align: middle;
  line-height: 50px;
  width: 100%;
  text-align: center;
  background-color: #ed4014;
  color: #ffffff;
  margin: 1px -1px;
}
.delItem:hover {
  background-color: #f16643;
}
</style>
