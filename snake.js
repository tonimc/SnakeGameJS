
var snake = {
  age : 1,
  food : 0,

  body : [{x:0, y:9}],

  direction : 'r', //'r': right, 'l': lefft, 'u': up, 'd': down

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

};

var scene = {
  tileSize : 50,
  snake : null,
  container : null,

  init : function(snake, size, id) {
    this.snake = snake;
    this.tileSize = size;
    this.container = document.getElementById(id);
  },

  reset : function() {
    this.container.innerHTML = '';
  },

  createTile : function(x,y) {
    var left = parseInt(this.tileSize) * parseInt(x),
        top = parseInt(this.tileSize) * parseInt(y);
    return '<div class="square" style="left:'+left+'px; top:'+top+'px" />';
  },

  draw : function() {
    var scene = '';
    for(var i in this.snake.body) {
      var tile = this.snake.body[i];
      scene += this.createTile(tile.x, tile.y);
    }
    this.container.innerHTML = scene;
  }
};
