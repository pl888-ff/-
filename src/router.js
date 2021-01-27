/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login') // @指向的是src这个目录
    },
    {
        path: '/',
        // name: 'layout', //如果父路由有默认子路由，name没意义，
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '', // 这里留空默认就是渲染父路由下的子路由,只能有一个就是默认跳到这个页面
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa')
            },
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video')
            },
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my')
            }
        ]
    }
]

const router = new Router({
    routes
})

export default router