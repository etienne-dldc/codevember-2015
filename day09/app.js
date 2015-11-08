'use strict';

$(function () {

  var winHeight = $(window).height();
  var winWidth = $(window).width();

  var Settings = function() {
    this.take = 6;
    this.range = 49;
    this.zoom = 1;
    this.exactly = false;
    this.zoomPrecision1 = 0;
    this.zoomPrecision2 = 0;
    this.zoomPrecision3 = 0;
  };
  Settings.prototype.update = function () {
    this.take = Math.floor(this.take);
    this.range = Math.floor(this.range);
    this.zoomTotal = this.zoom + this.zoomPrecision1 + this.zoomPrecision2 + this.zoomPrecision3;
  };
  var setts = new Settings();
  var gui = new dat.GUI();
  $(gui.domElement).parent().css('z-index', '1000');
  var ctrl1 = gui.add(setts, 'take', 1, 10);
  ctrl1.onChange(update);
  var ctrl2 = gui.add(setts, 'range', 1, 100);
  ctrl2.onChange(update);
  var ctrl3 = gui.add(setts, 'zoom', 1, 20000);
  ctrl3.onChange(update);
  var ctrl4 = gui.add(setts, 'zoomPrecision1', 0, 1000);
  ctrl4.onChange(update);
  var ctrl5 = gui.add(setts, 'zoomPrecision2', 0, 100);
  ctrl5.onChange(update);
  var ctrl6 = gui.add(setts, 'zoomPrecision3', 0, 10);
  ctrl6.onChange(update);
  var ctrl7 = gui.add(setts, 'exactly');
  ctrl7.onChange(update);

  var $resume = $('.content .resume');
  var $whichWin = $('.content .which-win');
  var $probaRepresent = $('.proba-represent');
  var $yourProba = $('.your-proba');
  var $representation = $('.representation');
  var proba = [];
  var selection = 1;
  var winArea = winWidth * winHeight;
  var winRatio = winWidth / winHeight;
  var rectArea = 0;
  var totalPossibleCombinations = 0;

  function update() {
    setts.update();

    proba = [];
    var n = setts.range;
    var k = setts.take;
    totalPossibleCombinations = combination(n, k);
    for (var b = 1; b <= setts.take; b++) {
      proba[b] = (combination(k, b) * combination((n-k), (k-b)) ) / totalPossibleCombinations;
    }
    if (setts.exactly == false) {
      for (var i = proba.length-2; i > 0; i--) {
        proba[i] = proba[i] + proba[i+1];
      }
    }
    generateWhichWin();
    $resume.html('If you choose <b>' + setts.take + '</b> numbers over <b>' + setts.range + '</b> possiblities...' );

    if (selection > proba.length-1) {
      selection = proba.length-1;
    }

    updateSelection()
    updateRepresent();
    updateZoom();
  }

  function combination(range, take) {
    var result = 1;
    for (var i = take; i > 0; i--) {
      result = result * ((range - (take-i)) / i);
    }
    return Math.floor(result);
  }

  function generateWhichWin() {
    $whichWin.html('');
    for (var i = setts.take; i > 0; i--) {
      var $elem = $('<span class="which-win-elem"></span>');
      if (i === setts.take) {
        $elem.html('Jackpot ! (' + i + ' numbers)');
      } else {
        $elem.html(i + ' number' + (i == 1 ? '' : 's'));
      }
      $elem.data('selection', i);
      $elem.click(function(event) {
        var select = $(this).data('selection');
        selection = select;
        update();
      });
      $whichWin.append($elem);
    }
  }

  function updateSelection() {
    $('.which-win-elem').removeClass('selected');
    $('.which-win-elem').each(function(index, el) {
      var select = $(el).data('selection');
      if (select === selection) {
        $(el).addClass('selected');
      }
    });
    var chance = '';
    if (proba[selection] == 0) {
      chance = ' <b>0</b> chance ';
    } else {
      chance = '<b>1</b> chance over <b>' + formatNumber(1 / proba[selection]) + '</b>';
    }
    if (setts.exactly) {
      var atLeastExactly = 'exactly';
    } else {
      var atLeastExactly = 'at least';
    }
    var winCombinations = proba[selection] * totalPossibleCombinations;
    var text = '... you have ' + chance + ' to get ' + atLeastExactly + ' ' + pluraliseNumber(selection);
    text += '</br>That represent <b>' + formatNumber(winCombinations) + '</b> combinations over the <b>' + formatNumber(totalPossibleCombinations) + '</b> possible combinations.';
    $yourProba.html(text);
  }

  function updateZoom() {
    if (setts.exactly) {
      var atLeastExactly = 'exactly';
    } else {
      var atLeastExactly = 'at least';
    }
    if (setts.zoomTotal === 1) {
      var text = 'The area of this page represent the <b>' + formatNumber(totalPossibleCombinations) + '</b> possible combinations.';
      text += '</br>The red rectangle is your probability to get ' + atLeastExactly + ' ' + pluraliseNumber(selection);
    } else {
      var multiply = (1 / Math.pow(setts.zoomTotal, 2));
      var percentage = multiply * 100;
      var combination = (1/proba[proba.length-1]) * multiply;
      var text = 'The area of this page represent <b>' + formatNumber(combination) + '</b> combinations </br> It\'s <b>' + formatNumber(percentage) + ' %</b> of the <b>' + formatNumber(totalPossibleCombinations) + '</b> possible combinations.';
      text += '</br>The red rectangle is your probability to get ' + atLeastExactly + ' ' + pluraliseNumber(selection);
    }
    $representation.html(text);
  }

  function updateRepresent() {
    rectArea = (proba[selection]) * winArea;
    var rectWidth = Math.sqrt(winRatio * rectArea);
    var rectHeight = rectWidth / winRatio;
    rectWidth = rectWidth * setts.zoomTotal;
    rectHeight = rectHeight * setts.zoomTotal;
    $probaRepresent.width(rectWidth);
    $probaRepresent.height(rectHeight);
  }

  function formatNumber(number) {
    if (number === 0) { return '0'; }
    if (number > 100) { number = number.toFixed(0); } else
    if (number > 10) { number = number.toFixed(1); } else
    if (number > 0.1) { number = number.toFixed(2); } else
    if (number > 0.01) { number = number.toFixed(3); } else
    if (number > 0.001) { number = number.toFixed(4); } else
    if (number > 0.0001) { number = number.toFixed(5); } else
    if (number > 0.00001) { number = number.toFixed(6); } else
    if (number > 0.000001) { number = number.toFixed(7); } else
    if (number > 0.0000001) { number = number.toFixed(8); } else
    { number = number.toFixed(9); }

    var numberArr = number.split('.');
    var intergerAray = numberArr[0].split('');
    var floatArr = [];
    if ( numberArr[1] !== undefined) {
      floatArr = numberArr[1].split('');
    }
    var resultInterger  = [];
    for (var i = intergerAray.length-1; i >= 0; i--) {
      resultInterger.unshift(intergerAray[i]);
      if (i !== 0 && (intergerAray.length - i) % 3 == 0) {
        resultInterger.unshift(',');
      }
    }
    var resultFloat  = [];
    for (var i = 0; i < floatArr.length; i++) {
      if (floatArr[i] == 'e') {

      }
      resultFloat.push(floatArr[i]);
      if (i !== 0 && (i+1) % 3 == 0) {
        resultFloat.push(' ');
      }
    }
    var resultFloat = resultFloat.join('');
    if (resultFloat.length > 0) {
      resultFloat = '.' + resultFloat;
    }

    return resultInterger.join('') + resultFloat;
  }

  function pluraliseNumber(number) {
    var result = '';
    if (number <= 1) {
      result =  'number';
    } else {
      result =  'numbers';
    }
    return '<b>' + number + ' correct</b> ' + result + '.'
  }

  generateWhichWin();
  update();
  updateZoom();

})
