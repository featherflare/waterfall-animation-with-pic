import Utils from './utils.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const settings = {
  animate: true,
  duration: 10,
  dimensions: [1080, 1920],
  fps: 36,
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
class Object {
  constructor(color) {
    this.color = color
  }

  draw() {
    c.beginPath()
    c.fill()
    c.closePath()
  }

  update(playhead) {
    this.draw()
  }
}

// Implementation
let objects
function init() {
  objects = []

  for (let i = 0; i < 2; i++) {
    objects.push(new Object(colors[i]))
  }
}

// Animation Loop
let startTime = null

function animate(time) {
  if (!startTime) startTime = time
  const elapsedTime = (time - startTime) / 1000

  let playhead = Utils.clamp01(elapsedTime / settings.duration)

  c.fillStyle = `rgba(255,255,255)`
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.translate(innerWidth / 2, innerHeight / 2)

  objects.forEach((object, i) => {
    object.update(playhead)
  })
  c.restore()

  if (settings.animate && elapsedTime < settings.duration) {
    requestAnimationFrame(animate) // Continue the animation
  }
}

init()
animate(0)

function startCanvas() {}
export { startCanvas }
