// 引入axios发送请求
import Vue from 'vue'
import axios from 'axios'
import elementUI from 'element-ui'
import { Loading, Message } from 'element-ui'
import qs from "qs"
// import qs from 'qs'
// 添加请求拦截器
let loadinginstace
let bool
// let token =''
axios.defaults.withCredentials = false;
// axios.defaults.headers.common['token'] = token;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.request.use(config => {
    // console.log(config)
    if(config.method == "post"){
        config.data = qs.stringify(config.data)
    }
    // config.data = qs.stringify(config.data)
    // let state = JSON.parse(window.localStorage.getItem('state'));
    // if (state) {
    //     token = state.token;
    // }
    // config.headers['token'] = token;
    // console.log(config)
    // 排除点赞和点踩
    // bool = /support/.test(config.url) || /tread/.test(config.url) || /downLoad/.test(config.url) || /load/.test(config.url)
    bool = (config.url === '/' || config.url === '/images')
    if (bool) {
        loadinginstace = Loading.service({
            fullscreen: true,
            text: "正在玩命加载数据中...",
            background: "rgba(0,0,0,0.9)",
            color: "#f60",
        })
    }
    return config;
}, error => {
    // 对请求错误做些什么
    loadinginstace.close && loadinginstace.close()
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    let isUrl = /:3000/.test(response.config.url)
    if (isUrl) {
        setTimeout(() => {
            document.documentElement.scrollTop = 400
        }, 500);
    }
    if (bool) {
        setTimeout(() => {
            loadinginstace.close()
        }, 2000);
    }
    return response;
}, error => {
    // 对响应错误做点什么
    setTimeout(() => {
        loadinginstace.close && loadinginstace.close()
    }, 500);
    Message.error({
        message: '数据加载失败'
    })
    return Promise.reject(error);
});
axios.defaults.baseURL = "http://47.110.139.9:3001"
Vue.use(elementUI)
export default axios