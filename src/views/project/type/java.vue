<template>
  <div>
    <div class="row">
      <span class="labelName">项目包名：</span>
      <Input v-model="package" placeholder="请输入packageName..." style="width:198px;"></Input>
    </div>
    <div class="row">
      <div class="templateList" v-for="item,i in template" :key="i">
        <div class="item" style="height:54px;">
          <Row>
            <Col span="2" style="padding-top: 18px;">
              <Checkbox v-model="item.checked"></Checkbox>
              <span>模板：</span>
            </Col>
            <Col span="4" style="text-align:left; padding-top: 8px;">
              <VTreeselect :data="$root.getTemplateList" value-field-name="id" v-model="item.templateId" size="small"></VTreeselect>
            </Col>
            <Col span="8" style="text-align:left;padding-top: 12px;">
               <span class="labelName" style="min-width:40px;">包名：</span>
                {{package}}.&nbsp;
                <Input v-model="item.package" style="width:100px;"></Input>
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
  name: "java",
  data() {
    return {
      package: "",
      template: [
        {
          checked: true,
          fileName: "",
          package: "",
          templateId: ""
        }
      ]
    };
  },
  created() {
  },
  methods: {
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
        package: "",
        templateId: ""
      });
    },
    getData() {
      if (this.package === "") {
        this.$error(this, "请填写项目包名！");
        return;
      }
      for (let item of this.template) {
        if (item.templateId === "" || item.fileName === "") {
          this.$error(this, "请填写完整的模板信息！");
          return;
        }
      }
      return {
        package: this.package,
        template: this.template
      };
    },
    setData(data) {
      this.package = data.package;
      this.template = data.template;
    },
    clear() {
      this.package = "";
      this.template = [
        {
          checked: true,
          fileName: "",
          package: "",
          tempPath: ""
        }
      ];
    }
  }
};
</script>
<style scoped>
@import './type.css';
</style>
