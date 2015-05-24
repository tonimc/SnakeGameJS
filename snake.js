
var Snake = Class.extend({
  age : 1,
  food : 0,

  body : [{x:0, y:9}],

  direction : 'r', //'r': right, 'l': lefft, 'u': up, 'd': down

  init : function() {
  },

  move : function() {
    var head = {x : this.head().x, y : this.head().y},
      newBody = [],
      snakeAge = this.age;

    if (this.direction==='r') {
      head.x++;
    } else if (this.direction==='l') {
      head.x--;
    } else if (this.direction==='d') {
      head.y++;
    } else if (this.direction==='u') {
      head.y--;
    }

    newBody.push(head);
    for(var i=1; i<this.age; i++) {
      newBody.push(this.body[i-1]);
    }
    this.body = newBody;
  },

  checkColision : function(x,y) {
    y = (x instanceof Object)?x.y:y;
    x = (x instanceof Object)?x.x:x;
    for(var i in this.body) {
      if(this.body[i].x == x && this.body[i].y == y) {
        return true;
      }
    }
    return false;
  },

  eat : function() {
    this.food++;
    if (this.food%this.age === 0) {
      this.age++;
      this.food = 0;
    }
  },

  head : function() {
    return this.body[0];
  }

});

var GameScene = Scene.extend({
  snake : null,
  maxXY : 0,
  sizeOfTiles : 25,
  food : null,

  init : function(id, size, snake, updateTime) {
    this._super( id, size, updateTime);
    this.snake = snake;
    this.maxXY = parseInt(this.size/this.sizeOfTiles)-1;
  },

  createTile : function(x,y, type) {
    var tileSize = this.sizeOfTiles,
        left = tileSize * parseInt(x),
        top = tileSize * parseInt(y);
    return '<div class="tile '+type+'" style="left:'+left+'px; top:'+top+'px;'
            +' width:'+tileSize+'px; height:'+tileSize+'px;"></div>';
  },

  draw : function() {
    var scene = '',
        i,tile;

    for(i in this.snake.body) {
      tile = this.snake.body[i];
      scene += this.createTile(tile.x, tile.y, 'snake');
    }
    scene += this.createTile(this.food.x, this.food.y, 'food');
    this.container.innerHTML = scene;

  }
});

var GameState = State.extend({
  snake : null,
  food : null,

  init : function() {
    this._super(200);
    this.snake = new Snake();
    this.scene = new GameScene('snakeGame', 500, this.snake, 200);
  },

  keyEvents : function(e, state) {
    e = e || window.event;
    if (e.keyCode == '38') { // up arrow
      if (state.snake.age==1 || state.snake.direction != 'd') {
        state.snake.direction = 'u';
      }
    }
    else if (e.keyCode == '40') { // down arrow
      if (state.snake.age==1 || state.snake.direction != 'u') {
        state.snake.direction = 'd';
      }
    }
    else if (e.keyCode == '37') { // left arrow
      if (state.snake.age==1 || state.snake.direction != 'r') {
        state.snake.direction = 'l';
      }
    }
    else if (e.keyCode == '39') { // right arrow
      if (state.snake.age==1 || state.snake.direction != 'l') {
        state.snake.direction = 'r';
      }
    }
    else if (e.keyCode == 0 || e.keyCode == 32) {
      state.stop();
    }
  },

  update : function() {
    this.snake.move();
    if (this.snake.checkColision(this.food)) {
      this.snake.eat();
      this.food = null;
    }
    if (this.food==null) {
      this.scene.food = this.addFood();
    }
    if (this.snake.head().x===this.scene.maxXY+1 && this.snake.direction=='r') this.snake.head().x=0;
    if (this.snake.head().x===-1 && this.snake.direction=='l') this.snake.head().x=this.scene.maxXY;
    if (this.snake.head().y===this.scene.maxXY+1 && this.snake.direction=='d') this.snake.head().y=0;
    if (this.snake.head().y===-1 && this.snake.direction=='u') this.snake.head().y=this.scene.maxXY;
  },

  addFood : function() {
    var x = 0,
        y = 0,
        colision = true;

    while(colision) {
      x = Math.floor(Math.random() * (this.scene.maxXY));
      y = Math.floor(Math.random() * (this.scene.maxXY));
      colision = this.snake.checkColision(x,y);
    }
    this.food = { 'x' : x, 'y' : y };
    return this.food;
  }

});
