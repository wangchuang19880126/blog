<template>
  <canvas id="c" width="1920" height="1080"></canvas>
</template>
<script>
export default {
  mounted() {
    var w = (c.width = window.innerWidth),
      h = (c.height = window.innerHeight),
      ctx = c.getContext("2d"),
      count = ((w * h) / 3000) | 0,
      speed = 4,
      range = 80,
      lineAlpha = 0.05,
      particles = [],
      huePart = 360 / count;
    window.addEventListener("resize", () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    });
    for (var i = 0; i < count; ++i)
      particles.push(new Particle((huePart * i) | 0));

    function Particle(hue) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;

      this.hue = hue;
    }
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    };

    function checkDist(a, b, dist) {
      var x = a.x - b.x,
        y = a.y - b.y;

      return x * x + y * y <= dist * dist;
    }

    function anim() {
    //   window.requestAnimationFrame(anim);

      ctx.fillStyle = "rgba(255,255, 255, .1)";
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < particles.length; ++i) {
        var p1 = particles[i];
        p1.update();

        for (var j = i + 1; j < particles.length; ++j) {
          var p2 = particles[j];
          if (checkDist(p1, p2, range)) {
            ctx.strokeStyle = "hsla(hue, 80%, 50%, alp)"
              .replace("hue", ((p1.hue + p2.hue + 3) / 2) % 360)
              .replace("alp", lineAlpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    setInterval(() => {
        anim()
    }, 40);
  }
};
</script>
<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: -100;
}
</style>