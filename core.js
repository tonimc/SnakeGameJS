var Game = Class.extend({
  states : {},
  htmlContainer : null,
  currentState : null,

  init : function(container) {
    this.htmlContainer = container;
  },

  start : function() {
    this._execState('init');
  },

  nextState : function() {
    this._execState(this.currentState.nextState);
  },

  _execState : function(state) {
    if(!this.states.hasOwnProperty(state)) {
      alert("Error: The state '"+state+"' is undefined");
      return;
    }
    this.currentState = new this.states[state](this.htmlContainer);
    this.currentState.start();
  },

  addState : function(key, value) {
    this.states[key] = value;
  }
});

var State = Class.extend({
  updateLoop : null,
  updateTime : 100,
  nextState : null,
  scene : null,
  isStop : true,

  init : function(updateTime) {
    this.updateTime = updateTime || this.updateTime;
    this.preload();
  },

  preload : function() {},

  start : function() {
    var self = this;
    this.isStop = false;
    this.registerKeyEvents();
    this.updateLoop = setInterval(function() {
      self.update()
    }, this.updateTime);
    //this.scene.start();
  },

  registerKeyEvents : function() {
    var self = this;
    document.onkeydown = checkKey;
    function checkKey(e) {
      self.keyEvents(e, self);
    }
  },

  update : function() {},

  stop : function() {
    clearInterval(this.updateLoop);
    this.isStop = true;
    //this.scene.stop();
  }

});

var Scene = Class.extend({
  size : 500,
  container : null,
  updateTime : 500,
  drawLoop :null,

  init : function(id, size, updateTime) {
    this.size = size;
    this.container = document.getElementById(id);
    this.updateTime = updateTime || this.updateTime;
    this.setup();
  },

  setup : function() {
    this.container.style.width = this.size+'px';
    this.container.style.height = this.size+'px';
  },

  clean : function() {
    this.container.innerHTML = '';
  },

  draw : function() {
    console.error('You must override this method');
  }
});
