MM.eggs = (function(){
	// initalize all easter eggs. This function also defines functions eggs 
	//will use, thereby leaving MM free of if this method is not called
	var _HUDToggle = function(){
		_$hud.slideToggle();
		$("#hudGoto").is(':visible') ? $("#hudGoto").focus() : null ;
	};
	var _pauseToggle = function(){
		MM.pause (!MM.pause());
		MM.pause() ? clearTimeout(MM.loopTO) : MM.loop();
		_updateHud();
	};
	var _gotoHandler = function(){
		var $go2 = $("#hudGoto");
		var go2 = $go2.val();
		MMM._geocoder.getLatLng(go2, function(point) {
	  !point ? null :
	  	MM.loop({ platform: "? HUD Entry ?", type : "", date: new Date(),topics : [],
	  		location:{name : go2 , lat: point.y, lng: point.x, alt : 0}
	  		});
		});
	}
	//These need to be public so that Google servers can GET them to use them
	var _earthSkin = null;
	var _earthSkins = [
		null, //using GE imagery
		"http://danielthurman.com/img/earth-2.jpg",
		"http://danielthurman.com/img/pretty.jpg",
		"http://danielthurman.com/img/Earth4096.jpg"
		];
	var _earthSkinCyclePointer = -1;
	var _cycleEarthSkins = function(){
		_earthSkin ? MM.gex.dom.removeObject(_earthSkin) : null; 		
		_earthSkinCyclePointer = ++ _earthSkinCyclePointer % _earthSkins.length;
		if(_earthSkinCyclePointer > 0){
			var _skinURL = _earthSkins[_earthSkinCyclePointer];
			var _groundOverlay = ge.createGroundOverlay('');
			var _icon = ge.createIcon('');
					_icon.setHref(_skinURL);
					_groundOverlay.setIcon(_icon);
			var latLonBox = ge.createLatLonBox('');
			var n = -90;
			var s = 90; 
			var e = -180;
			var w = 180;
					latLonBox.setBox(n, s, e, w, 0);
					_groundOverlay.setLatLonBox(latLonBox);
					ge.getFeatures().appendChild(_groundOverlay);  	
			}
		_earthSkin = _groundOverlay;
	};

	$.get('templates/HUD.html', function(templateMarkup){
			$.template("HUD" , templateMarkup);
			$('<div id="hud">'+
					'<div id="hudData"></div>' +
					'<button id="earthSkin">Skin &gt;</button>'+
					'<button id="clearQ">Clear Queue</button>'+
					'<input id="hudGoto"/>' +
				'</div>').prependTo("body");
			_$hud = $("#hud");
			_$hudData = $("#hudData");
			_$earthSkin = $("#earthSkin");
			_$clearQ = $("#clearQ");
			_$hudGoto = $("#hudGoto");
			_updateHud = function(){
				_$hudData.html($.tmpl( "HUD" , [MM]));
			}
			$(document).bind("dataUpdated", _updateHud);
			$(document).bind('keydown', {combi:'alt+n', disableinInput: true}, _HUDToggle);			
			$(document).bind('keydown', {combi:'alt+p', disableinInput: true}, _pauseToggle);				
			_$hudGoto.bind('keydown', {combi:'return', disableinInput: false}, _gotoHandler);
			_$earthSkin.click(_cycleEarthSkins);
			_$clearQ.bind('click', MM.data.clearQueue);
		});
	$(document).bind("geReady", _cycleEarthSkins);

})();