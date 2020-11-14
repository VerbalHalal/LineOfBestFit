let width = window.innerWidth
let height = window.innerHeight
let points = []
let derivatives = []
let m = 1
let t = 0
let learningRate = 0.0000001
let stepSizeM = 1
let stepSizeT = 1
let totalSteps = 0
let messageClicked = false
let startFrameGrid = null
let startFrameAxis = null
let yesnt = false

function setup() {
  createCanvas(width, height);
  setTimeout(() => {
    yesnt = true
  }, 1500)
}

function draw() {
  // alpha(70)
  // background(250)
  // drawGrid()
  // drawAxis()
  // drawPoints()
  // if(derivatives.length) {
  //   drawLinear(m,t)
  // }
  // if(!messageClicked) {
  //   drawStartMessage()
  // }
  clear()
  strokeWeight(10)
  resetStroke()
  if(messageClicked) {
    drawGrid()
    drawAxis()
  } else {
    drawStartMessage()
  }
}

/* Draw Functions */

function drawGrid() {
  stroke(getStroke('grid'))
  if(startFrameGrid !== null) {
    for(var x = 1; x < width/50; x++) {
      line(useRange(width/2,width/2+x*25,90,startFrameGrid),0,useRange(width/2,width/2+x*25,90,startFrameGrid),height)
      line(useRange(width/2,width/2-x*25,90,startFrameGrid),0,useRange(width/2,width/2-x*25,90,startFrameGrid),height)
    }
    for(var x = 1; x < height/50; x++) {
      line(0,useRange(height/2,height/2+x*25,90,startFrameGrid),width,useRange(height/2,height/2+x*25,90,startFrameGrid))
      line(0,useRange(height/2,height/2-x*25,90,startFrameGrid),width,useRange(height/2,height/2-x*25,90,startFrameGrid))
    }
  } else {
    startFrameGrid = frameCount
  }
  resetStroke()
}


function drawAxis() {
  if(startFrameAxis !== null) {
    strokeWeight(4)
    stroke(getStroke('axisY'))
    line(width/2,0,width/2,useRange(0,height,90,startFrameAxis))
    stroke(getStroke('axisX'))
    line(0,height/2,useRange(0,width,90,startFrameAxis),height/2)
    resetStroke()
  } else {
    startFrameAxis = frameCount
    console.log(startFrameAxis)
  }
  
}

function drawLinear(m,t) {
  strokeWeight(5)
  if(m <= 1 && m >= -1) {
    x1 = -width/2 
    y1 = -width/2*m+t
    x2 = width/2 
    y2 = width/2*m+t
    start = toNew(x1, y1)
    end = toNew(x2, y2)
    line(start[0],start[1],end[0],end[1])
  }
  else {
    x1 = (-height/2-t)/m
    y1 = -height/2
    x2 = (height/2-t)/m
    y2 = height/2
    start = toNew(x1, y1)
    end = toNew(x2, y2)
    line(start[0],start[1],end[0],end[1])
  }
  resetStroke()
}

function drawPoints() {
  strokeWeight(20)
  stroke(getStroke('points'))
  points.forEach(p => {
    cor = toNew(p.x,p.y)
    point(cor[0],cor[1])
})
  resetStroke()
}

function drawStartMessage() {
  startMessageWidth = 500
  startMessageHeight = 150
  rect(width/2-(250 < width/2 ? 250 : width/2 - 10), height/2-75, (500 < width ? 500 : width - 20),150)
  rect(width/2+(250 < width/2 ? 215 : width/2 - 45),height/2-65,25,25)
  stroke('red')
  strokeWeight(1)
  line(width/2+(250 < width/2 ? 215 : width/2 - 45),height/2-65,width/2+(250 < width/2 ? 240 : width/2 - 20),height/2-65+25)
  line(width/2+(250 < width/2 ? 215 : width/2 - 45),height/2-40,width/2+(250 < width/2 ? 240 : width/2 - 20),height/2-65)
  resetStroke()
  textSize(32)
  text('Line of Best Fit v0.1', width/2-140, height/2+0)
  textSize(23)
  text('Created by Gregor Smeykal', width/2-142, height/2+29)
  text('using Gradient Descent', width/2-122, height/2+58)
}

/* Functionalities */

function mouseClicked() {
  // if(points.length < 5 && messageClicked) {
  //   cor = toOld(mouseX,mouseY)
  //   points = points.concat({x: cor[0], y: cor[1]})
  // } else if (points.length === 5){
  //   gradientDescent()
  // }
  if(mouseX > width/2+(250 < width/2 ? 215 : width/2 - 45) && mouseX < width/2+(250 < width/2 ? 240 : width/2 - 20) && mouseY > height/2-65 && mouseY < height/2-40) {
     messageClicked = true
     window.localStorage.setItem('messageClicked', true)
  }
}

function windowResized() {
  width = window.innerWidth
  height = window.innerHeight
  resizeCanvas(width,height)
}

function gradientDescent() {
    if(!derivatives.length) {
        calcDerivatives()
    }
    while(abs(stepSizeM) > 0.001 || abs(stepSizeT) > 0.001) {
      stepSizeM = math.evaluate(derivatives[0], {m, t}) * learningRate
      m = m - stepSizeM
      stepSizeT = math.evaluate(derivatives[1], {m, t}) * 0.05
      t = t - stepSizeT
      totalSteps += 1
    }
    console.log(`m: ${m} t: ${t}`)
    console.log(`Step-Size (M): ${stepSizeM} \nStep-Size (T): ${stepSizeT}`)
    console.log(`Steps taken: ${totalSteps}`)
}

function calcDerivatives() {
  s = ''
  for(var x = 0; x < points.length; x++) {
    s += `(${points[x].y}-(m*${points[x].x}+t))^2`
    if(x + 1 !== points.length) {
      s+="+"
    }
  }
  derivatives[0] = math.format(math.derivative(s,'m'))
  derivatives[1] = math.format(math.derivative(s,'t'))
  console.log(derivatives)
  console.log(points)
  console.log(math.evaluate(derivatives[0], {m, t}))
  console.log(math.evaluate(derivatives[1], {m, t}))
}

/* Miscellaneous */

function toNew(x,y) {
  return [x+width/2, -y+height/2]
}

function toOld(x,y) {
  return [x-width/2, -(y-height/2)]
}

function resetStroke() {
  stroke('black')
  strokeWeight(1)
}

function getStroke(component) {
  switch(component) {
    case 'axisX':
      return `rgba(255,0,0,${messageClicked ? 1.0 : 0.25})`
    case 'axisY':
      return `rgba(0,0,255,${messageClicked ? 1.0 : 0.25})`
    case 'grid':
      return `rgba(104,104,104,${messageClicked ? 1.0 : 0.25})`
    case 'points':
      return `rgba(0,255,0,1.0)`
    default:
      return 'grey'
  }
}

function useRange(start, end, frames, startFrame) {
  return frameCount-startFrame > frames ? end : start+(end-start)/frames*(frameCount-startFrame)
}