class DrawAudio {
    constructor(opt) {
        this.ele = document.querySelector(opt.ele);
        this.audio = document.querySelector(opt.audio);
        this.resize();
        this.ctx = this.ele.getContext("2d");
        this.bg = this.ctx.createLinearGradient(
            this.max_w / 2,
            this.max_h / 2 - 100,
            this.max_w / 2,
            this.max_h + 100
        );
        this.bg.addColorStop(0, opt.color.b);
        this.bg.addColorStop(0.5, opt.color.r);
        this.bg.addColorStop(1, opt.color.g);
        this.init();
        this.readAudio({
            next: this.audio
        });
    }
    init() {
        this.count = 130;
        window.addEventListener("resize", () => {
            this.resize();
        });
        document.addEventListener("dragover", e => {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        document.addEventListener("drop", e => {
            const data = e.dataTransfer.files;
            if (data.length !== 1) return;
            this.label && this.label.pause();
            if (/audio/.test(data.item(0).type))
                this.readAudio({
                    content: data.item(0),
                    tag: "audio"
                });
            if (/video/.test(data.item(0).type))
                this.readAudio({
                    content: data.item(0),
                    tag: "video"
                });
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }
    resize() {
        this.max_w = this.ele.width = this.ele.offsetWidth;
        this.max_h = this.ele.height = this.ele.offsetHeight;
    }
    readAudio(opt) {
        if (!opt.next) {
            const blob = new Blob([opt.content]);
            const url = window.URL.createObjectURL(blob);
            this.label = document.createElement(opt.tag);
            this.label.src = url;
        } else {
            this.label = opt.next;
        }
        this.label.play();
        this.label.volume = 0.8;
        // this.label.loop = "loop";
        this.drawCanvas();
        this.animation();
        if (opt.tag !== "video") return;
        this.label.controls = "controls";
        document.body.insertBefore(this.label, this.ele);
    }
    drawCanvas() {
        // 创建音频上下文对象
        this.audioContext = new AudioContext() || webkitAudioContext;
        // 创建分析器
        this.analyser = this.audioContext.createAnalyser();
        // 创建媒体源
        this.audioSrc = this.audioContext.createMediaElementSource(this.label);
        // 连接分析器
        this.audioSrc.connect(this.analyser);
        //  mp3  ->  分析器  -> 耳机
        this.audioSrc.connect(this.audioContext.destination);
        // 获取音频的频率1024长度的数组
        this.arrAudio = new Uint8Array(this.analyser.frequencyBinCount);
    }

    animation() {
        this.clearCanvas();
        this.analyser.getByteFrequencyData(this.arrAudio);
        let step = Math.round(this.arrAudio.length / this.count);
        for (let i = 0; i < this.count; i++) {
            let iH = this.arrAudio[step * i] / 1.2;
            this.ctx.fillStyle = this.bg;
            this.ctx.fillRect(i * 4.5 + this.max_w / 2, this.max_h / 2, 3, -iH);
            this.ctx.fillRect(
                this.max_w / 2 - (i - 1) * 4.5,
                this.max_h / 2,
                3,
                -iH
            );
            this.ctx.fillRect(i * 4.5 + this.max_w / 2, this.max_h / 2 - 0.3, 3, iH);
            this.ctx.fillRect(
                this.max_w / 2 - (i - 1) * 4.5,
                this.max_h / 2 -0.3 ,
                3,
                iH
            );
        }
        requestAnimationFrame(this.animation.bind(this));
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.max_w, this.max_h);
    }
}
export default DrawAudio