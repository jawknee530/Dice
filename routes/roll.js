var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //create the expression object
  var roll = {
      lowest: 0,
      highest: 0,
      explosive: 0,
      multiple: 0,
      literal: false,
      indivRolls: [],
      result: 0,
      str: ''
  };
  //save the expression string to the object
  roll.str = req.query.roll;
  if(!initCheckInput(roll.str)) {
    res.send('Not a valid input');
  } else if(!setCons(roll)) {
    res.send('Not a valid input');
  } else {
    completeRolls(roll);
    computeResult(roll);
    console.log(roll);
    res.send(roll.result.toString());
  }
});

var compareNumbers = function(a, b) {
  return a-b;
}
var computeResult = function(roll) {
  if(roll.literal) {
    roll.result = roll.indivRolls[0];
  } else if(roll.lowest){
    roll.indivRolls.sort(compareNumbers)
  } else if(roll.highest) {
    roll.indivRolls.sort(compareNumbers)
  } else if(roll.explosive) {
  } else {
    for(var i in roll.indivRolls) {
      roll.result += roll.indivRolls[i];
    }
  }
}

var completeRolls = function(roll) {
  if(roll.literal) { 
    roll.indivRolls.push(parseInt(roll.str));
    return;
  }
  var str = roll.str.split('d');
  for(var i = 0; i < parseInt(str[0]); i++) {
    roll.indivRolls.push(Math.floor(Math.random() * str[1])+1);
  }
}

var initCheckInput = function(str) {
  var reject = /[^0-9dxk' '+-]/;
  if(reject.test(str)) { return false; }
  return true;
}

var setCons = function(roll) {
  if(!(/[a-zA-Z]/.test(roll.str))) {roll.literal = true;}
  if(roll.str.includes('x')) {
    var tmp = roll.str.split('x');
    roll.explosive = tmp[1];
    roll.str = tmp[0];
    var test = tmp[0].split('d');
    return checkSize(test[1], tmp[1]);
  }
  if(roll.str.includes('k')) {
    var tmp = roll.str.split('k');
    roll.highest = tmp[1];
    roll.str = tmp[0];
    var test = tmp[0].split('d');
    return checkSize(test[0], tmp[1]);
  }
  if(roll.str.split('d').length === 3) {
    var tmp = roll.str.split('d');
    var tmp2 = tmp[0].concat('d' + tmp[1]);
    roll.lowest = tmp[2];
    roll.str = tmp2;
    return checkSize(tmp[0], tmp[2]);
  }
  return true;
}

var checkSize = function(n, x) {
  if(n > x && x > 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
