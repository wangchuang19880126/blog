// 全局组件
const hdNv = () => ({
    component: import('@/components/global/header.vue'),
    delay: 200,
    timeout: 3000
})
const ftNv = () => ({
    component: import('@/components/global/footer.vue'),
    delay: 200,
    timeout: 3000
})
const ctNv = () => ({
    component: import('@/components/global/ctnv.vue'),
    delay: 200,
    timeout: 3000
})

const atNv = () => ({
    component: import('@/components/article/articleList.vue'),
    delay: 200,
    timeout: 3000
})

const snakeNv = () => ({
    component: import('@/components/game/snake.vue'),
    delay: 200,
    timeout: 3000
})
// 背景画布
const bg = () => ({
    component: import('@/components/global/bg.vue'),
    delay: 200,
    timeout: 3000
})
//垂直导航
const rightNv = () => ({
    component: import('@/components/global/right.vue'),
    delay: 200,
    timeout: 3000
})
export {
    hdNv,
    ftNv,
    ctNv,
    atNv,
    snakeNv,
    bg,
    rightNv
}