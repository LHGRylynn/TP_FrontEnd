import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home/Home'
import MyJobs from '@/components/Home/MyJobs/MyJobs'
import MyInfo from '@/components/Home/MyInfo/MyInfo'
import NewProject from '@/components/Home/NewProject/NewProject'
import Project from '@/components/Home/Project/Project'

// 解决路由导航冗余报错(路由重复)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

/*
 * 【路径说明】
 * 路经形如 [域名]/[用户名]/[项目名]
 * 例如： localhost:1080/liangrongjia/project1
 * ajax 请求路径与此无关。该路径完全为前端服务
 * 【将来变更】
 * 目前 My Task 和 My Message 两个页面的导航是放在 /[项目名] 这里，是如下这么访问的：
 * localhost:1080/liangrongjia/my-task
 * 这导致项目名不能创建为 my-task ，否则会有冲突
 * 参考 Github 的设计，将改为如下路径：
 * localhost:1080/liangrongjia?tab=my-task
 */
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/:userName',
      component: Home,
      children: [
        {
          path: 'my-jobs',
          component: MyJobs
        },
        {
          path: 'my-info',
          component: MyInfo
        },
        {
          path: 'newProject',
          component: NewProject
        },
        {
          path: ':projectName',
          component: Project
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
