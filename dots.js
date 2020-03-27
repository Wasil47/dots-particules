const canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
dots = [],
// changeable
amount = 180, // relative (amount per sqrt(width+height)px / 100)
speed = 3.5, // max speed (0-speed) [px per 10sec]
size = 2.5, // max size (0-size)
lineWidth = 1.5,
connectionDistance = 260,
opacity = 0.8, // 0.1 - 1
color = 'hsla(200, 40%, 50%, '+opacity+')',
// color = 'hsl(200, 40%, 50%)',
shadowColor = 'hsl(210, 40%, 60%)',
shadowBlur = 12;
//


//'hsl(210, 50%, 40%)',

let w = canvas.width = window.innerWidth,
h = canvas.height = window.innerHeight;

ctx.fillStyle = color;
ctx.shadowColor = shadowColor;
ctx.shadowBlur = shadowBlur;
// ctx.filter = 'blur(1px)';

window.addEventListener('resize', ()=>{
  w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

  ctx.fillStyle = color;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
});

const screenRelative = Math.sqrt(w + h) / 100;

class Dot {
  constructor (xpos, ypos, randomSize, dotSpeed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.randomSize = randomSize;
    this.dotSpeed = dotSpeed;

    this.dx = this.dotSpeed; //direction x
    this.dy = this.dotSpeed; //direction y    
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.xpos, this.ypos, this.randomSize, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  move() { //update position (draw new one)
    this.draw();    
    // hit the "wall"
    if ( (this.xpos + this.randomSize) > w ) {
      this.dx = -this.dx;
    }
    if ( (this.xpos - this.randomSize) < 0 ) {
      this.dx = -this.dx;
    }
    if ( (this.ypos + this.randomSize) > h ) {
      this.dy = -this.dy;
    }
    if ( (this.ypos - this.randomSize) < 0 ) {
      this.dy = -this.dy;
    }
    // hit when resize screen
    if (this.xpos < 0) {
      this.xpos = this.randomSize + 2;
    }    
    if (this.xpos > w) {
      this.xpos = w - this.randomSize - 2;
    }    
    if (this.ypos < 0) {
      this.ypos = this.randomSize + 2;
    }    
    if (this.ypos > h) {
      this.ypos = h - this.randomSize - 2;
    }

    this.xpos += this.dx;
    this.ypos += this.dy;
  }
};

const createAllDots = () =>{  
  const allAmount = amount * screenRelative;
  for (let i = 0; i < allAmount; i++) {
    const randomX = (Math.random() * (w-2*size))+size;
    const randomY = (Math.random() * (h-2*size))+size;
    const randomSize = (Math.random() * size) + 1;
    const randomDirection = (Math.random() - Math.random());
    // const dotSpeed = ((Math.random() * speed) + 1);
    const dotSpeed = (speed/10) * randomDirection;
    const myDot = new Dot (randomX, randomY, randomSize, dotSpeed);
    dots.push(myDot);
  }  
  moveDots();  
};

const moveDots = () => {  
  ctx.clearRect(0, 0, w, h);
  line();
  dots.forEach((e)=>{
    e.move();
  });
  requestAnimationFrame(moveDots);
};

const getDistance = (xpos1, ypos1, xpos2, ypos2) => {
  const resultX = Math.pow((xpos2-xpos1), 2);
  const resultY = Math.pow((ypos2-ypos1), 2);
  const result = Math.sqrt(resultX+resultY);
  return result;
};

const line = () => {  
  const relativeDistance = connectionDistance * screenRelative;  
  ctx.lineWidth = lineWidth;
  dots.forEach((e1)=>{
    dots.forEach((e2)=>{
      const resultX = Math.pow((e2.xpos-e1.xpos), 2);
      const resultY = Math.pow((e2.ypos-e1.ypos), 2);
      const distance = Math.sqrt(resultX+resultY);

      if (distance <= relativeDistance){
        const opacity = 1.0 - (distance / relativeDistance);
        ctx.strokeStyle = 'hsla(210, 50%, 40%, '+opacity+')';
        ctx.beginPath();
        ctx.moveTo(e1.xpos, e1.ypos);
        ctx.lineTo(e2.xpos, e2.ypos);
        ctx.stroke();
        ctx.closePath();
      }
    });    
  });  
};

createAllDots();
// console.log(dots);