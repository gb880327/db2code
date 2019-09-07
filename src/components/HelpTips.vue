<template>
  <Tooltip placement="right-start" theme="light">
    <a href="javascript:void(0);">可用变量</a>
    <div slot="content">
      <ul class="helpTips">
        <li>basePackage - 基础包名 ( java )</li>
        <li>packageName - 包名 ( java )</li>
        <li>imports - 需要导入的包 ( java )</li>
        <li>entityName - 类名</li>
        <li>tableName - 表名</li>
        <li>primaryKey - 主键</li>
        <li>priType - 主键数据类型</li>
        <li>remark - 表备注信息</li>
        <li>date - 当前日期(yyyy-MM-dd)</li>
        <li>
          <span>fields - 表字段</span>
          <div class="sub">
            <span>columnName - 表字段名</span>
            <span>fieldName - 实体字段名</span>
            <span>type - 数据类型</span>
            <span>comment - 字段备注</span>
            <span>pri - 是否为主键</span>
          </div>
        </li>
      </ul>
    </div>
  </Tooltip>
</template>
<script>
export default {
    name: "helpTips"
};
</script>
<style scoped>
.helpTips{
  list-style: none;
  padding: 0;
  margin: 0;
}
.helpTips li{
  list-style: none;
  padding: 0;
  margin: 0;
}
.helpTips .sub{
  margin-left:8px;
}
.helpTips .sub span{
  display: block;
  padding: 0 0;
}
</style>
