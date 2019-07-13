import axios from 'axios'

// axios.interceptors.response.use(function (response) {
//   return response.data
// });


export let addData = (data)=>{
  return axios.post('http://wxxbg.cn/admin/add',data).then((res)=>{
    return res
  })
}

export let getDataList = (data)=>{
  return axios.post('http://wxxbg.cn/admin/datalist',data).then((res)=>{
    return res
  })
}

export let setDataList = (data)=>{
  return axios.post('http://wxxbg.cn/admin/update',data).then((res)=>{
    return res
  })
}

export let setUpdate = (data)=>{
  return axios.post('http://wxxbg.cn/admin/setupdate',data).then((res)=>{
    return res
  })
}

export let removeDataList = (data)=>{
  return axios.post('http://wxxbg.cn/admin/remove',data).then((res)=>{
    return res
  })
}

export let getData = (data)=>{
  return axios.post('http://wxxbg.cn',data).then((res)=>{
    return res
  })
}

export let getHomeData = (data)=>{
  return axios.post('http://wxxbg.cn/home',data).then((res)=>{
    return res
  })
}

export let getListData = (data)=>{
  return axios.post('http://wxxbg.cn/list',data).then((res)=>{
    return res
  })
}

export let getArticleData = (data)=>{
  return axios.post('http://wxxbg.cn/article',data).then((res)=>{
    return res
  })
}

export let setAdmire = (data)=>{
  return axios.post('http://wxxbg.cn/article/admire',data).then((res)=>{
    return res
  })
}

export let getProjectData = (data)=>{
  return axios.post('http://wxxbg.cn/project',data).then((res)=>{
    return res
  })
}

export let addComment = (data)=>{
  return axios.post('http://wxxbg.cn/article/comment',data).then((res)=>{
    return res
  })
}

export let login = (data)=>{
  return axios.post('http://wxxbg.cn/api/login',data).then((res)=>{
    return res
  })
}
