MM.mapNav = (function(){
	var _bigJumpSpeed 	= 1/3;
	var _bigJumpPace 	= 1/3;
	var _jumpDuration	= MM.feedPace / 3; // 3000
	var _bigJumpAlt 	= 6000000; //8000000
	var _spaceOutAlt 	= 4000000;
	var _geodesicArcSegments = 40;
	var _geodesicArcAlt = 800000;
	var _lineColor = '666666ff';// aabbggrr format. Alpha channel! :)
	var _sceneObjects = [];
	var _lookAt = {lat: 0, lng: 0, alt: 0};
	var _spacePoint = {lat: null, lng: null, alt: 200000, tilt: 96};

	

	var _clearScene = function (callback){		
		//clear previous scenne objects. Can't blast all objects because there are some
		//other objs that last longer than the scene (skins, kml models, etc.)
		while(_sceneObjects.length > 0){
				var obj = _sceneObjects.pop();
				gex.dom.removeObject (obj); 
			}
		$balloon = $("#balloon");
		if ( $balloon.length ){
			$balloon.fadeOut(400, function(){
				ge.setBalloon(null);	
			    if (callback) {
			        setTimeout(callback, 200);
			    }
			});
		}else{
		    if (callback) {
		        setTimeout(callback, 1000);
		    }
		}
		
	};
	var _spider = function (data){
		//Create the scene (spider)
		console.log('creating Spider');
//	  var placemark = gex.dom.addPointPlacemark(data.location,{stockIcon: 'paddle/red-circle'});
//		_sceneObjects.push(placemark);
	  if (data.participants && data.participants.length){
		  for(var i=0; i < data.participants.length; i++){
			_geodesicArc(
				{lat : data.location.lat, lng : data.location.lng , alt:0}, 
				{lat : data.participants[i].lat, lng : data.participants[i].lng, alt:0});	  	
		  }
	  }
	};
	var _snake = function (data){
		//Create the scene
		console.log('creating Snake');
		var placemark = gex.dom.addPointPlacemark(lookAt ,{stockIcon: 'paddle/red-circle'});
		_sceneObjects.push(placemark);
		//TODO merge lookAt to head of data.connections into new object and use that 
		if (data.participants && data.participants.length){
		  for(var i=1; i < data.participants.length; i++){
			_drawLine(
				{lat : data.participants[i-1].lat, lng : data.participants[i-1].lng, alt:0}, 
				{lat : data.participants[i].lat, lng : data.participants[i].lng, alt:0});	  	
		  }
		}
	};	
	var _geodesicArc = function (pointA, pointB, lineSegments){
		//creates geodesic-ish polyline segments (lines on the surface of a sphere) which 
		//are fancy compared to simple straight lines.
		lineSegments = lineSegments || _geodesicArcSegments  //TODO correct for distance 
		var lineStringPlacemark = ge.createPlacemark('');
		var lngDelta = pointB.lng - pointA.lng;
		var latDelta = pointB.lat - pointA.lat;
		var vector = Math.sqrt( Math.pow(latDelta, 2) + Math.pow(lngDelta, 2));
		var mult = 50;
		var lineString = ge.createLineString('');
		lineStringPlacemark.setGeometry(lineString);
		lineString.getCoordinates().pushLatLngAlt(pointA.lat, pointA.lng, 0);
		for (var i = 0; i < lineSegments; i++){ 
		  	lineString.getCoordinates().pushLatLngAlt(
			pointA.lat +  (latDelta * i / lineSegments) , 
			pointA.lng + (lngDelta * i / lineSegments), 
			Math.sin(i * (180/lineSegments) * Math.PI/180) 
			  * _geodesicArcAlt //TODO correct for distance 
			  * (vector / 120)
		  );
		}
		lineString.setTessellate(true);
		lineString.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
		lineStringPlacemark.setStyleSelector(ge.createStyle(''));
		var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
		lineStyle.setWidth(3);
		lineStyle.getColor().set(_lineColor);
		ge.getFeatures().appendChild(lineStringPlacemark);
		_sceneObjects.push(lineStringPlacemark);
	}

	
	return {
		bigJumpSpeed : _bigJumpSpeed,
		bigJumpPace : _bigJumpPace,
		jumpDuration : _jumpDuration,
		bigJumpAlt : _bigJumpAlt,
		spaceOutAlt : _spaceOutAlt,
		sceneObjects : _sceneObjects,
		lookAt : _lookAt,
		spacePoint : _spacePoint,
		
		spider : _spider,
		clearScene : _clearScene

		
	}
	
})();//MM.mapNav 
