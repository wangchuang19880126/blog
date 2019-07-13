const Koa = require('koa')
const websockify = require('koa-websocket')
const app = websockify(new Koa())
let ctxs = []
let userList = []

const Chat = require("./models/chat.js")

app.ws.use(async ctx => {
    getClientIP = () => {
        return ctx.req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            ctx.req.connection.remoteAddress || // 判断 connection 的远程 IP
            ctx.req.socket.remoteAddress || // 判断后端的 socket 的 IP
            ctx.req.connection.socket.remoteAddress;
    }
    const publicFn = res => {
        for (let i = 0; i < ctxs.length; i++) {
            ctxs[i].websocket.send(JSON.stringify(res))
        }
    }
    let ip = getClientIP()
    ctxs.push(ctx)
    ctx.websocket.on('message', async message => {
        let msg = JSON.parse(message)
        console.log(msg)
        if (!msg.code) {
            let enterList = []
            let obj = {
                username: msg.username,
                role: msg.role,
                avatar: msg.avatar,
                ip,
                time: Date.now(),
                isEnter: true,
            }
            userList.push(obj)
            enterList.push(obj)
            publicFn({
                code: msg.code,
                userList,
                enterList,
            })
            // console.log(userList)
        } else if (msg.code == 1) {
            let messageList = []
            let obj = {
                username: msg.username,
                role: msg.role || 0,
                avatar: msg.avatar,
                // code: msg.code,
                ip,
                content: msg.content,
                time: Date.now()
            }
            await new Chat(obj).save().catch(err => console.log(err))
            messageList.push(obj)
            // console.log(2222222222222222222222222222)
            publicFn({
                code: msg.code,
                messageList,
            })

        }else if(msg.code == 3){
            // console.log(111)
            let data = await Chat.find().then(res => res)
            ctx.websocket.send(JSON.stringify({
                code: msg.code,
                watchMore:data,
            }))
        }else{
            console.log(444444444444)
        }
    });
    ctx.websocket.on("close", message => {
        let quiteList = []
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index, 1);
        let arr = userList.splice(index, 1)
        arr[0].time = Date.now()
        arr[0].isEnter = false
        quiteList.push(arr[0])
        publicFn({
            code: 2,
            userList,
            quiteList,
        })
    })
    ctx.websocket.on("error", error => {
        console.log(error)
    })
});
app.listen("4000", '0.0.0.0', () => {
    console.log("server is starting at port 4000!")
})