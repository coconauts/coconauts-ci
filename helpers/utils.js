//String contains prototype
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

module.exports = {

    random: function(low,high){
      return Math.floor(Math.random() * (high - low + 1) + low);
    },
    randomArray: function(array){
      var randomIndex = this.random(0, array.length-1);
      return array[randomIndex];
    },
    probability: function(chances){
      return this.random(0,100) <= chances;
    },
    objectToArray: function(object){
      var keys = Object.keys(object);
      var array = [];
      for (var i in keys) {
        array.push(object[keys[i]]);
      }
      return array;
    },
    timestampToHumanTime: function(milis) {
      var time = milis / 1000; //seconds
      if (time > 24* 60*60) time  = parseInt(time/(24*60*60))+ " d";
      else if (time > 60*60) time  = parseInt(time/(60*60))+ " h";
      else if (time > 60) time  = parseInt(time/60)+ " m";
      else time = parseInt(time) + " s";
      return time ;
    }
};
