MM.type.GreaseTruck =(function(){

	var _displayScene = function(data){	
		$("#card").css({background : "#999"});
		$("#map").hide();
		$("#street").show();
		
        var map = new GMap2(document.getElementById('street'));
        var center = new GLatLng(40.756573, -73.970255); // Replace this by coordinates of your own city ;)
        map.setCenter(center, 16);

        var custIcon = new GIcon(G_DEFAULT_ICON);  
        custIcon.iconSize = new GSize(100, 60);  
        custIcon.shadowSize = new GSize(10, 60);  
        custIcon.iconAnchor = new GPoint(0, 0);  

        
		$.each(data[0].participants, function (i, item) {
            if (item.lat) {
                var marker = new GMarker(new GLatLng(item.lat, item.lng), {title : item.name, icon:  new GIcon(custIcon, item.icon) });
                map.addOverlay(marker);
            }
		});		
		
		
		
		
		
	}
	
	
	return {
//		animatedTransition : _animatedTransition,
		displayScene: _displayScene,
		prototype : MM.type
	}

})();