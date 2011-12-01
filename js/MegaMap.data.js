MM.data = (function(){
	var _feedQueue = [];
	var _feedQueueLimit = 1500; 
//	var _webSocketURL : "ws://ws.nb01.glgdev.com:8000"
	var _webSocketURL = "ws://192.168.56.102:8000";
	var _ws;
	
	var _initDataConnection = function(){
		return;
		console.log("initDataConnection");
		if (window.WebSocket) {
		  _ws = new WebSocket(_webSocketURL);
		  _ws.onopen = function() {
			  console.log("WebSocket OPEN!");
		  };
		  _ws.onmessage = _dataReciever;
		} else {
			/*
			  // The browser doesn't support WebSocket.
			  //Set up polling, something like this
			  var _feedPoll = function(){
					$.getJSON("PolledServer.php", _dataReciever);
			  }
			  //var _feedPollHandle = setInterval(_feedPoll , 20000);
			  ///TODO Create PolledServer.php !!!!!!!!!!!!!!!!!!
			  ///Polling is currently non-existent because there is no server 
			  ///implementation for it yet. If you need it... write PolledServer.php
			 */			  
		}
	}
	var _socketState = function(){
		return _ws.readyState;
	} 
	var _dataReciever = function(evt, obj) { 
		console.log("recieving data");
		//warning $.parseJSON is PICKY! it wants strict JSON 
		//(" not ' , quoted property names, etc.)
		var feedItem = obj ? obj : $.parseJSON(evt.data);
		if (feedItem && feedItem.location){
			if(!(feedItem.location.lat && feedItem.location.lng)  &&  feedItem.location.name && MM.goo())
				{ //If you got a BS location (no {lat,lng}) then you're in here
					//using Maps API to resolve name to a point = {lat,lng} 
					var lookup = feedItem.location.name;
						if(feedItem.region){
							lookup += ", " +feedItem.region;
						}
				
					geocoder.getLatLng(lookup, function(point) {
						if(MM.type[feedItem.type] && MM.type[feedItem.type].geoRules){ 
								if (!MM.type[feedItem.type].geoRules(point) )
									return;
						}
						
						  if(point)
							  	$.extend(feedItem.location,{lng : point.x, lat : point.y});
					  
						_feedQueue.length < _feedQueueLimit ? 
							_feedQueue.push (feedItem) : null;
						MM.updateHud ? MM.updateHud() : null; //TODO event this
					});
//					//Not sure if this will work...
//					if(feedItem.participants && feedItem.participants.length){
//						for (var p = 0; p < feedItem.participants.length; p++){
//							if(!(feedItem.participants[p].lat && feedItem.participants[p].lng)  
//									&&  feedItem.participants[p].name){
//								geocoder.getLatLng(feedItem.participants[p].name, function(point) {
//									  if(point)
//										  $.extend(feedItem.participants[p],{lng : point.x, lat : point.y});
					// {NOT THAT p anymore
//								});
//							}
//						}
//						
//					} 
					
				}else{
						_feedQueue.length < _feedQueueLimit ? 
							_feedQueue.push (feedItem) : null;
//					MM.updateHud ? MM.updateHud() : null;		//TODO event this
				}
		}else
			{
			//NO LOCATION ...?
//			_feedQueue.length < _feedQueueLimit ? 
//					_feedQueue.push (feedItem) : null;		
			}
	}
	var _clearQueue = function(){
		_feedQueue = [];
	};	
		
	return {
		feedQueue : _feedQueue,
		initDataConnection : _initDataConnection,
		dataReciever : _dataReciever,
		socketState : _socketState,
		clearQueue : _clearQueue 
	};
})();
