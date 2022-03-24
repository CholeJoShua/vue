import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// ***刷新页面会重置路由
 export const setRoutes = () =>{
  const storeMenus = localStorage.getItem("menus");
  if(storeMenus){
    //拼装动态路由
    const manageRoute = {path: '/',name:'Manage',component: () => import('../views/Manage.vue'),redirect: "/home",children: [
      {path:'person',name:'个人信息',component:() =>import('../views/Person.vue')}

    ]}

    const menus = JSON.parse(storeMenus)
    menus.forEach(item => {
      if(item.path){      //当且仅当path不为空
        let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue') }
        manageRoute.children.push(itemMenu)
      }else if(item.children.length){
        item.children.forEach(item => {
          if (item.path){
            let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue') }
            manageRoute.children.push(itemMenu)
          }
        })
      }
      
    })


    //获取当前的路由对象名称数组
    const currentRouteNames = router.getRoutes().map(v => v.name)
    if(!currentRouteNames.includes('Manage')){
      //动态添加到现在的路由对象中去  
      router.addRoute(manageRoute)
    }
    
  }
}

//重置就再set一次路由
setRoutes()


// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
  store.commit("setPath")  // 触发store的数据更新

  //未找到路由情况
  // if(!to.matched.length){
  //   const storeMenus = localStorage.getItem("menus")
  //   console.log(storeMenus);
  //   if (storeMenus) {
  //     next("/login")
  //   }
  //   else{
  //     next("/login")
  //   }
  // }
  next()  // 放行路由
})

export default router

