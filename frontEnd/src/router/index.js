import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PersonalInfo from '../views/PersonalInfo.vue'
// import WxAuth from '../views/WxAuth.vue'

Vue.use(VueRouter)
const About = { template: '<p>about page</p>' }
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: route => ({ query: route.query.q })
  },
  // {
  //   path: '/WxAuth',
  //   name: 'WxAuth',
  //   component: WxAuth
  // },
  {
    path: '/personalInfo',
    name: 'PersonalInfo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PersonalInfo
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   if (!/micromessenger/i.test(navigator.userAgent)) {
//     next()
//     return
//   }
//   //不要对 WxAuth 路由进行拦截，不进入 WxAuth 路由就拿不到微信返回的授权 code
//   if (to.name === 'WxAuth') {
//     next()
//     return
//   }
  
//   let wxUserInfo = localStorage.getItem('wxUserInfo')
//   if (!wxUserInfo) {
//     //保存当前路由地址，授权后还会跳到此地址
//     sessionStorage.setItem('wxRedirectUrl', to.fullPath)
//     //请求微信授权,并跳转到 /WxAuth 路由
//     let appId = 'wx3f83e23715127120'
//     let redirectUrl = encodeURIComponent('https://5595e90cb6d3.ngrok.io/WxAuth')
//     //判断是否为正式环境
//     if (window.location.origin.indexOf('https://5595e90cb6d3.ngrok.io/') !== -1) {
//       appId = 'wx3f83e23715127120'
//       redirectUrl = encodeURIComponent('https://5595e90cb6d3.ngrok.io/WxAuth')
//     }
//     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
//   } else {
//     next()
//   }
// })
export default router
