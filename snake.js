
var Snake = Class.extend({
  age : 1,
  eatPerYear : 4,
  food : 0,
  sceneSize : 10,

  body : [{x:0, y:9}],

  direction : 'r', //'r': right, 'l': lefft, 'u': up, 'd': down

  init : function (sceneSize) {
    this.sceneSize = sceneSize || this.sceneSize;
  },

  move : function () {
    var head = this.nextMovement(this.direction),
      newBody = [],
      snakeAge = this.age;

    newBody.push(head);
    for(var i=1; i<this.age; i++) {
      newBody.push(this.body[i-1]);
    }
    this.body = newBody;
  },

  nextMovement : function (direction) {
    var direction = direction || this.direction,
      nextCoordinates = { x : this.head().x, y : this.head().y };

    if (direction==='r') {
      nextCoordinates.x++;
    } else if (direction==='l') {
      nextCoordinates.x--;
    } else if (direction==='d') {
      nextCoordinates.y++;
    } else if (direction==='u') {
      nextCoordinates.y--;
    }

    return nextCoordinates;
  },

  isMoveToBack(direction) {
    var coordinates = this.nextMovement(direction);
    if (this.age > 1
        && this.body[1].x == coordinates.x && this.body[1].y == coordinates.y) {
      return true;
    }
    return false;
  },

  checkColision : function (x,y) {
    var length = this.age==1?1:this.body.length-1,
        i;
    y = (x instanceof Object)?x.y:y;
    x = (x instanceof Object)?x.x:x;
    for(i=0; i<length; i++) {
      if(this.body[i].x == x && this.body[i].y == y) {
        return true;
      }
    }
    return false;
  },

  eat : function () {
    this.food++;
    if (this.food%(this.age>3?this.eatPerYear:this.age) === 0) {
      this.age++;
      this.food = 0;
    }
  },

  head : function () {
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

  scorePanel : function(score) {
    var left = 2,
        top = this.size-22;
    return '<div class="score text" style="left:'+left+'px; top:'+top+'px;">'
              +'Score: '+score.points+'</div>';
  },

  draw : function(score) {
    var scene = '',
        i,tile;

    for(i in this.snake.body) {
      tile = this.snake.body[i];
      scene += this.createTile(tile.x, tile.y, 'snake');
    }
    scene += this.createTile(this.food.x, this.food.y, 'food');
    scene += this.scorePanel(score);
    this.container.innerHTML = scene;
  },

  gameOver : function() {
    var left = this.size/2-75,
        top = this.size/2-11;
    var gameOverText = '<div class="gameOver" '
                        + 'style="left:'+left+'px; top:'+top+'px;">'
                        + 'Game Over</div>';
    this.container.innerHTML += gameOverText;
  }
});

var GameState = State.extend({
  snake : null,
  score : {
    points : 0
  },

  init : function(container) {
    this._super(200);
    this.snake = new Snake();
    this.scene = new GameScene(container, 300, this.snake, 200);
    this.scene.food = this.addFood();
  },

  keyEvents : function(e, state) {
    e = e || window.event;
    if (e.keyCode == '38') { // up arrow
      if (state.snake.age==1 || !state.snake.isMoveToBack('u')) {
        state.snake.direction = 'u';
      }
    }
    else if (e.keyCode == '40') { // down arrow
      if (state.snake.age==1 || !state.snake.isMoveToBack('d')) {
        state.snake.direction = 'd';
      }
    }
    else if (e.keyCode == '37') { // left arrow
      if (state.snake.age==1 || !state.snake.isMoveToBack('l')) {
        state.snake.direction = 'l';
      }
    }
    else if (e.keyCode == '39') { // right arrow
      if (state.snake.age==1 || !state.snake.isMoveToBack('r')) {
        state.snake.direction = 'r';
      }
    }
    else if (e.keyCode == 0 || e.keyCode == 32) {
      if (state.isStop) state.start(); else state.stop();
    }
  },

  update : function() {
    console.log("update");
    //Chech colision with next move
    if (this.snake.checkColision(this.snake.nextMovement())) {
      this.stop();
      this.scene.gameOver();
      return;
    }
    //Move snake
    this.snake.move();
    //Checl if snake eat a peace of food
    if (this.snake.checkColision(this.food)) {
      this.snake.eat();
      this.score.points += 1;
      this.scene.food = this.addFood();
    }
    if (this.snake.head().x===this.scene.maxXY+1 && this.snake.direction=='r') this.snake.head().x=0;
    if (this.snake.head().x===-1 && this.snake.direction=='l') this.snake.head().x=this.scene.maxXY;
    if (this.snake.head().y===this.scene.maxXY+1 && this.snake.direction=='d') this.snake.head().y=0;
    if (this.snake.head().y===-1 && this.snake.direction=='u') this.snake.head().y=this.scene.maxXY;

    this.scene.draw(this.score);
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

var SnakeGame = Game.extend({
  init : function(container) {
    this._super(container);
    this.addState('init', GameState);
  }
});
