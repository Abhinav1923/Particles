import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((themes) => ({
  canva: {
    backgroundColor: '#000',
    color: '#fff',
    display: 'block',
    width: '100vw',
    height: '100vh- 64px',
  }
}))

export default function App() {
  const classes = useStyles()
  const canvas = useRef(null)

  useEffect(() => {
    let canva = canvas.current;
    let ctx = canva.getContext('2d');
    canva.width = window.innerWidth
    canva.height = window.innerHeight - 1

    let particleArray = [];
    let mouse = {
      x: canva.width / 2,
      y: undefined
    }

    let hue = 0;

    class Particle {
      constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 8
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = 'rgba(' +
          Math.random() * 255 +
          ',' +
          Math.random() * 255 +
          ',' +
          Math.random() * 255 +
          ')';
      }
      update() {
        this.x += this.speedX * 1.5;
        this.y += this.speedY * 1.5;
        if (this.size > 1)
          this.size -= 0.1
      }
      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x
      mouse.y = e.y
      for (let i = 0; i < 10; i++) {
        particleArray.push(new Particle())
      }
    })

    function handleParticle() {
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
        for (let j = i; j < particleArray.length; j++) {
          let dx = particleArray[i].x - particleArray[j].x
          let dy = particleArray[i].y - particleArray[j].y
          let len = Math.sqrt(dx * dx + dy * dy)
          if (len < 180) {
            ctx.beginPath()
            ctx.strokeStyle = particleArray[i].color;
            ctx.lineWidth = 0.1;
            ctx.moveTo(particleArray[i].x, particleArray[i].y)
            // ctx.lineTo(particleArray[j].x,particleArray[j].y)
            ctx.stroke()
          }
        }
        if (particleArray[i].size < 1) {
          particleArray.splice(i, 1)
        }
      }
      hue = Math.random() * 360;
    }

    function startPaint() {
      ctx.fillStyle = 'rgba(0,0,0,.1)'
      ctx.fillRect(0, 0, canva.width, canva.height)
      handleParticle()
      requestAnimationFrame(startPaint);
    }
    startPaint()

    // function drawCircle() {
    //   ctx.fillStyle = 'blue';
    //   ctx.beginPath();
    //   ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * .5);
    //   ctx.fill();
    // }
  }, [])

  return (
    <div>
      <canvas className={classes.canva} ref={canvas}></canvas>
    </div>
  )
}

