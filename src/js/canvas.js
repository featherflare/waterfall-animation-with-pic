import Utils from './utils.js'
import { createNoise2D } from 'simplex-noise'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const simplex = createNoise2D()

const settings = {
  animate: true,
  duration: 10,
  dimensions: [1080, 1920],
  fps: 2,
  loop: true,
}

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

const colors = ['#ffffff', '#000000', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Square {
  constructor({
    color,
    position,
    size,
    random,
    // height
  }) {
    this.color = color
    this.position = position
    this.size = size
    this.random = random
    this.max =
      floor +
      100 * simplex(this.position.x / 150, 0) +
      10 * Math.sin(this.position.y)
    this.actualSize = size * this.random
    this.alpha = 1
    this.angle = (Math.PI * Math.random()) / 2
    this.shift = 0
    this.shiftY = 0
    this.shiftX = 0
  }

  draw(progress) {
    c.save()
    c.translate(
      this.position.x + this.size / 2,
      this.position.y + this.size / 2 + this.shift
    )
    c.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
    c.fillRect(
      -this.actualSize / 2 + this.shiftX,
      -this.actualSize / 2 + this.shiftY,
      this.actualSize,
      this.actualSize
    )
    if (progress > 0) {
      c.fillRect(
        -this.actualSize / 2 - this.shiftX,
        -this.actualSize / 2 + this.shiftY,
        this.actualSize,
        this.actualSize
      )
    }
    c.restore()
  }

  update(progress) {
    this.alpha = progress < 0 ? 1 : Math.max(0, 1 - progress * 5)
    this.shift = progress < 0 ? 0 : 500 * this.random * progress
    this.shiftX = this.shift * Math.sin(this.angle)
    this.shiftY = this.shift * Math.cos(this.angle)
    this.actualSize =
      progress < 0 ? size * this.random : size * this.random * 0.5
    this.draw(progress)
  }
}

// Implementation

let objects
let cols = 100
let rows = 200
let size = innerWidth / cols

let period = cols

let floor = 600
let randoms = Array.from(Array(cols), () => new Array(rows))

let image = Array.from(Array(cols), () => new Array(rows))
let img = new Image()

img.onload = function () {
  let canv = document.createElement('canvas')
  let ctx = canv.getContext('2d')

  // Set canvas size to match the image
  canv.width = cols
  canv.height = rows

  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0, canv.width, canv.height)

  // Get image data
  let data = ctx.getImageData(0, 0, canv.width, canv.height)

  for (let i = 0; i < data.data.length; i = i + 4) {
    let x = (i / 4) % canv.width
    let y = Math.floor(i / 4 / canv.height)

    image[x][y] = data.data[i + 1] / 255
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < period; j++) {
      randoms[i][j] = Math.random() * 0.6 + 0.4 * (1 - image[i][j])
    }
  }

  init()
  animate(0)
}

img.src = '/test.jpg'
function init() {
  objects = []

  for (let i = 10; i < cols - 10; i++) {
    for (let j = -period; j < rows; j++) {
      let jPositive = (j + period * 2) % period
      objects.push(
        new Square({
          color: colors[0],
          position: { x: i * size, y: j * size },
          size: size,
          random: randoms[i][jPositive],
        })
      )
    }
  }
}

// Animation Loop
let startTime = null
let lastFrameTime = 0
const frameDuration = 1000 / settings.fps

function animate(time) {
  if (!startTime) startTime = time
  const elapsedTime = (time - startTime) / frameDuration

  let playhead = (elapsedTime % settings.duration) / settings.duration
  let fromTheTop = period * size * playhead

  c.clearRect(0, 0, canvas.width, canvas.height)
  c.fillStyle = `rgba(0,0,0)`
  c.fillRect(0, 0, canvas.width, canvas.height)

  // c.fillStyle = 'red'
  // c.fillRect(0, floor, canvas.width, 2)

  c.save()
  c.translate(0, fromTheTop)

  objects.forEach((object, i) => {
    if (fromTheTop + object.position.y > object.max) {
      let progress = (fromTheTop + object.position.y - object.max) / floor
      object.update(progress)
    } else {
      object.update(-1)
    }
  })

  c.restore()
  if (settings.loop) {
    if (settings.animate) {
      requestAnimationFrame(animate) // Continue the animation
    }
  } else {
    if (settings.animate && elapsedTime < settings.duration) {
      requestAnimationFrame(animate) // Continue the animation
    }
  }
}

function startCanvas() {}
export { startCanvas }
