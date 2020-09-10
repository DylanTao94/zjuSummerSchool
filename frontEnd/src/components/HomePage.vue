<template>
  <div class="hello">
    <h1>浙江大学暑期学校</h1>
    <p>
      欢迎来到浙江大学暑期学校，您将在本平台管理自己的个人信息和学习平台。<br/>
      <span>
        {{personalInfoMsg}}
        <router-link to="/personalInfo" class="link">
          个人信息
        </router-link>
      </span>
      <span v-show="hasInfo">
        点击此处查看
        <a href="https://cli.vuejs.org" target="_blank" rel="noopener">个人信息</a>.
      </span>
    </p>
    <h3>课程信息</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>常见问题</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>关于我们</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
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
  created(){
    // this.$http.get('https://zjusummerschool-9c570.firebaseio.com/posts/' + this.id + ".json")
    //   .then(function(data){
    //     console.log(data);
    //     return data.json();
    //     // this.blog = data.body;
    //   })
    //   .then(function(data){
    //     this.blog = data;
    //   })
    this.hasInfo = false;
    if(!this.hasInfo) {
      this.personalInfoMsg = "点击此处补充";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a.link {
  color: #42b983;
}
</style>
