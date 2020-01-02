var numutil = {
  getMinArr: function(arr) {
    var tarr = [];
    var val = 0;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] == 0) continue;
      if(i == 0) {
        val = arr[i];
      } else {
        if(arr[i] < val) val = arr[i];
      }
    }
    return val;
  },
  getMaxArr: function(arr) {
    var tarr = [];
    var val = 0;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] == 0) continue;
      if(i == 0) {
        val = arr[i];
      } else {
        if(arr[i] > val) val = arr[i];
      }
    }
    return val;
  },
}
export default numutil