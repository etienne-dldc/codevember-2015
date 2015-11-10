$(function () {
	
	var dayInSeconds = 24*60*60*1000; // 86 400
	var dayInSeconds10 = 10*100*100; // 100 000
	
	var date = new Date;

	for (var i = 0; i < 100; i++) {
		if (i%10 == 0) {
			var elem = $('<div class="hour-mark"><div class="mark"></div></div>');
		} else {
			var elem = $('<div class="minute-mark"><div class="mark"></div></div>');
		}
		elem.css('transform', 'rotateZ(' + ((i/100) * 360) + 'deg)' );
		$('.marks').append(elem);
	};
	
	function update () {
		date.setTime(Date.now() );

		var seconds = date.getSeconds();
		var minutes = date.getMinutes();
		var hour = date.getHours();
		var milliseconds = date.getMilliseconds();


		var percentOfTheDay = ((hour*60*60*1000) + (minutes*60*1000) + (seconds*1000) + milliseconds ) / dayInSeconds;

		var time10 = percentOfTheDay * dayInSeconds10;

		var hours10 = Math.floor( time10 / (100*100) );
		time10 = time10 % (100*100);
		var minutes10 = Math.floor( time10 / 100 );
		time10 = time10 % 100;
		var seconds10 = Math.floor(time10);

		$('.hours').css('transform', 'rotateZ(' + ( (hours10/10 * 360) + (360/10 * minutes10/100) )  + 'deg)'  );
		$('.minutes').css('transform', 'rotateZ(' + (minutes10/100 * 360) + 'deg)'  );
		$('.seconds').css('transform', 'rotateZ(' + (seconds10/100 * 360) + 'deg)'  );

		$('.text').html(hours10 + ':' + (minutes10 < 10 ? '0' : '') + minutes10 + ':' + (seconds10 < 10 ? '0' : '') + seconds10 );
	};

	window.setInterval(function () {
		update();
	}, 100);





});