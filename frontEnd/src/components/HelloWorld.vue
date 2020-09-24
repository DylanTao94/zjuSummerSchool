<template>
  <v-main>
    <p>浙江大学的前身是1897年成立的求是书院，由晚清杭州知府林启创建，它是中国近代史上效法西方学制最早创办的几所新式高等学校之一，着重理科、工科等科学技术，后改称浙江高等学堂。1912年初学制改革，教育部令全国各高等学堂停办。6月，浙江高等学堂校医韩清泉、教务长汤尔和及校友厉绥之出而创办浙江医学专门学校(即后来之浙医)。1914年浙高最后一届学生毕业，教师多转入工专和农专等学校，校址为浙省军政府占用，为省长公署。自1918年起，广大求是浙高师生建立本大学筹备委员会，积极谋划复校并建立现代化大学，虽屡经省议会批准，总因军阀混战，经费校产无着落以致筹而未办。</p>
    <router-link to="/personalInfo"><v-btn color="primary">查看个人信息</v-btn></router-link>
  </v-main>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {

  },
  data () {
    return {
      personalInfoMsg: "点击此处查看",
      hasInfo:true,
    }
  },
}
</script>