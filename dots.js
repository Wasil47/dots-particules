const canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
dots = [],
// changeable
amount = 1, // relative (amount per sqrt(width*height)px / 100)
speed = 10, // max speed (1-speed) [px per sec]
size = 20, // max size (1-size)
lineWidth = 1.0,
connectionDistance = 100,
color = 'hsl(210, 70%, 70%)';

let w = canvas.width = window.innerWidth,
h = canvas.height = window.innerHeight;

ctx.fillStyle = color;


window.addEventListener('resize', ()=>{
  w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

  ctx.fillStyle = color;
});


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
// const createDot = (dot) => {
//   dot.draw();
// };

const createAllDots = () =>{
  const screenPixels = Math.sqrt(w * h) / 100;
  const allAmount = amount * screenPixels;

  for (let i = 0; i < allAmount; i++) {
    const randomX = (Math.random() * (w-2*size))+size;
    const randomY = (Math.random() * (h-2*size))+size;
    const randomSize = (Math.random() * size) + 1;
    const randomDirection = (Math.random() - Math.random());
    // const dotSpeed = ((Math.random() * speed) + 1);
    const dotSpeed = speed * randomDirection;    

    const myDot = new Dot (randomX, randomY, randomSize, dotSpeed);
    dots.push(myDot);
    // createDot(dots[i]);
  }  
  moveDots();
};

const moveDots = () => {
  requestAnimationFrame(moveDots);
  ctx.clearRect(0, 0, w, h);
  dots.forEach((e)=>{
    e.move();
  });
};


createAllDots();
console.log(dots);
// moveDots();



const getDistance = (xpos1, ypos1, xpos2, ypos2) => {
  const resultX = Math.pow((xpos2-xpos1), 2);
  const resultY = Math.pow((ypos2-ypos1), 2);
  const result = Math.sqrt(resultX+resultY);

  return result;
};







