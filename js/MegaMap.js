/* ****************************************************************************
**************************************************************************** */
var $ = jQuery;

var MM = (function(){
	var _goo = false;
	var _pause = false;
	var _loopTO = null;
	var _type= {};
	var _feedPace = 20000;
	var _google = google ? google : {};
	var _ge, _gex, _geocoder;

	var _init = function() {
		console.log("Init");
		//instanciate all intended singletons, etc.
		MM.data.initDataConnection();
		$.event.trigger("initComplete");

	}
	var _loop = function (fdata){
		//look for data to process and display
		console.log("running loop");
		var extraTime =  0;
		if (!_pause && MM.data.feedQueue.length > 0 || fdata){
			var data = fdata ? fdata : MM.data.feedQueue.shift();
			$.event.trigger("newData", data);
			extraTime =  (data.card && data.card.duration) ? data.card.duration : 0;
		}
		
		if(MM.data.feedQueue.length < 1){
			extraTime = _feedPace * -.9;
			$.event.trigger("feedEmpty");
		}
	  !_pause && !fdata ? _loopTO = setTimeout(_loop, _feedPace + extraTime) : null;
	  $.event.trigger("loopComplete");
	}

	var _initGoogle = function(){
		console.log("initGoogle");
		//Now we can test if Google Earth API actually loaded and for the plug-in	
		_goo = _google.earth  && _google.earth.isInstalled();
		if (_goo){
			var _googleInitCB = function (instance) {
				console.log("googleInitCB");
				  //success callback handed to GE create createInstance
				   _ge = ge = instance;
				   _gex = gex = new GEarthExtensions(ge);
				   _ge.getWindow().setVisibility(true);
				   //ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
				   ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
				   _ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
				   /// look out in space 
//					var c = _ge.getView().copyAsCamera(_ge.ALTITUDE_RELATIVE_TO_GROUND);
//					c.setTilt(160);
					var l = _ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
						l.setLatitude(30.2637792);
						l.setLongitude(-97.7405461);
						l.setTilt(80);
						l.setRange(400);

					_ge.getView().setAbstractView(l);
					
					
				   $.event.trigger("geReady");
				   setTimeout(_loop, 1000);
				}
			_google.earth.createInstance('map', _googleInitCB, __googleUnavailable);
			_geocoder = geocoder = new _google.maps.ClientGeocoder();
		}else{
			_googleUnavailable();
			_loop();
		}
		_init();
	}
	
	var __googleUnavailable = function(e){
		alert(e);
	}
	var _googleUnavailable = function() {
		console.log("google Unavailable");
		MM.gui.googleUnavailable();
	}

	if(_google.load && _google.setOnLoadCallback){
		console.log("Calling google.load for earth and maps");
		_google.load("earth", "1");
		_google.load("maps", "2");
		_google.setOnLoadCallback(_initGoogle);	
	}else {
		$(_initGoogle);
	}
	
	return {
		ge : function(){return _ge},
		gex : function(){return _gex},
		goo : function(){return _goo},
		pause  : function(val){return _pause = val === undefined ? _pause : val;}, 
		loopTO : _loopTO,
		loop : _loop,
		type : _type,
		feedPace :_feedPace	
	}
})();//MM