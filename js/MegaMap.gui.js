MM.gui = (function(){
	var _feedItemLimit = 9; 
	var _$theShiz = $("#theShiz"); //the hot new item
	var _$load = $("#load"); //loading screen
	var _$map = $("#map"); //the map
	var _$feed = $("#feed"); //the old stuff
	var _$card = $("#card"); //the card
	var _$xxhr = $("#details"); //
	var _balloonScale = 400;
	var _bgColor = "";
	
	var _googleUnavailable = function () {	
		console.log("Google is Unavailable");
		 //failure callback handed to GE create createInstance and run if no google
		var message = "<h1>:(</h1><ul>";
		if (!google.earth){
			message += "<h2>The Google Earth API is currrently unavailable. Please check your internet connection.</h2>";			
		} 
		if (google.earth && !google.earth.isInstalled()) {
			message +="<h3>You don't have the Google Earth plugin installed. Get the plugin "+
			 	"<a href='http://www.google.com/earth/explore/products/plugin.html'>"+
			 	"here</a>!</h3>";
		}
		message +="</ul>";
		
		//TODO event this
		 _$card.html(message);
		 _$load.fadeOut(500, function(){
			 _$card.fadeIn(500);
			 });
		 MM.feedPace = 8 * 1000;
		 MM.loop();
	};
	
	var _updateFeedDisplay = function(ev, data){
		console.log("Updating feed display for new " + data.type);
		(MM.type[data.type] && MM.type[data.type].updateFeedDisplay) ? 
			MM.type[data.type].updateFeedDisplay(data)
			:
			MM.type.updateFeedDisplay(data);
		//if Google APIs available 
		if (MM.goo()){
			(MM.type[data.type] && MM.type[data.type].animatedTransition) ? 
				MM.type[data.type].animatedTransition(data)
				:
					////////////////////////////////
					_hideCard(data, MM.type.animatedTransition);
				//MM.type.animatedTransition(data);
		}else{
			_hideCard(data, function(data){
					$.event.trigger("animatedTransitionComplete", data);
			});
		}
	
	};
	var _displayCard = function(ev, data){
		console.log("Displaying card");
		(MM.type[data.type] && MM.type[data.type].displayCard) ? 
				MM.type[data.type].displayCard(data)
				:
				MM.type.displayCard(data);
	};
	var _displayScene = function(ev, data){
		console.log("Displaying scene");
		(MM.type[data.type] && MM.type[data.type].displayScene) ? 
				MM.type[data.type].displayScene(data)
				:
				MM.type.displayScene(data);
	}; 
	var _hideCard = function(data, callback){
			console.log("hiding card");
			_$card.fadeOut(800,function(){
				callback(data);
			});
	};
	var _sizeToFit = function(){
		///TODO add at init and update innerHTML thereafter
		$("#sizeToFit").remove();
		var basefontSize = (_$feed.width() / 300)  * 18;
		$("head").append(
			"<style id='sizeToFit'>body{font: "+basefontSize+"px Tahoma;}</style>");
		
		_balloonScale = _$feed.width() /330  * 400;
	};
	var _showMap = function(){
		_$load.animate({opacity: 0}, 300 , function(){
			_$map.css({'margin-top' : 0});
			$("body").css('background', _bgColor);
			})
	};

	var _loadingSequence = function(){
		_bgColor = $("body").css('background');
		_$map.css('margin-top', $("body").height());
	};

	$(function(){
		_loadingSequence();
		_sizeToFit();
		$(window).resize(_sizeToFit);
		$(document).bind("newData", _updateFeedDisplay);
		$(document).bind("animatedTransitionComplete", _displayCard);
//		if (MM.goo()){
			$(document).bind("animatedTransitionComplete", _displayScene);
//		}
	});

	$(document).bind("geReady", _showMap);
	
	
	return {
		$feed : _$feed,
		$card : _$card,
		$xxhr: _$xxhr,
		googleUnavailable : _googleUnavailable,
		getBalloonScale : function(){return _balloonScale;}
	}
	
})();

