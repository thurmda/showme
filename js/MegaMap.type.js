MM.type =(function(){
	var _type = "base";
	var _templateMarkup ="<div class='${platform}'>"+
							"<span class='plt'>${platform}</span><span class='typ'></span>"+
// 							"<span class='date'>${date ? date.toString(\"dddd, MMMM d h:mm:tt\"): ''}</span>" +
 							"<span class='loc'>${location && location.name ? location.name : ''}</span>"+
							"<span class='tpc'>${topics ? topics.join(', ') : ''}</span>"+
						"</div>";
	var _cardMarkup =	""+
		"<h1>{{html title}}</h1>" +
		"{{if image}}<img src='${image}'/>{{/if}}"+
		"<span>{{html description}}</span>";
	
	var _updateFeedDisplay = function(data){
		var timeline = 1000;
//		var temlateName = MM.type[data.type] ? MM.type[data.type] : "base";  
		var temlateName = "base";  
		var shizDOM  = $.tmpl( temlateName , [data] );
		var $new = MM.gui.$feed.prepend($(shizDOM).hide()).find("*:first");
		$new.slideDown("slow");
		$new.css({opacity : .5 })
		$new.animate({opacity : 1}, timeline, "swing");
		for (var i = MM.gui.feedItemLimit; i < MM.gui.$feed[0].children.length; i++){
			$(MM.gui.$feed[0].lastChild).slideUp(function(){$(this).remove()});
		}
	};
	var _displayCard = function(data){
		if(data.card){
			console.log(data.card.description);
//			MM.gui.$card.fadeOut(300, function(){
				var DOM  = $.tmpl( "card" , [data.card] );
				MM.gui.$card.html(DOM);
				MM.gui.$card.find("img").each(function(){
					//hide broken images
					$(this).bind("error", function(){this.style.display = "none";});
				});
				MM.gui.$card.fadeIn(1000);
//			});
		}
		if(MM.goo()){
			console.log("Displaying BALLOON");
			 var l = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);	
			 var placemark = gex.dom.addPointPlacemark(l);
			 var icon = ge.createIcon('');
			 icon.setHref('http://www.glgroup.com/images/p2-glg-logo.gif');
			 var style = ge.createStyle(''); 
			 style.getIconStyle().setIcon(icon); 
			 style.getIconStyle().setScale(0.01);
			 placemark.setStyleSelector(style);
			 MM.mapNav.sceneObjects.push(placemark);
			if (data.connections && data.connections.length){
			  for(var i=0; i < data.connections.length; i++){
				MM.mapNav.drawLine(
					{lat : lookAt.getLatitude(), lng : lookAt.getLongitude(), alt:0}, 
					{lat : data.connections[i].lat, lng : data.connections[i].lng, alt:0});	  	
			  }
			}
			
			var balloon = ge.createHtmlDivBalloon('');
			balloon.setCloseButtonEnabled(false);
			if(data.location){
				balloon.setFeature(placemark);
			}
			balloon.setMinHeight(MM.gui.getBalloonScale());
			balloon.setMaxHeight(MM.gui.getBalloonScale());
			balloon.setMinWidth(MM.gui.getBalloonScale() * 16/9);
			balloon.setMaxWidth(MM.gui.getBalloonScale() * 16/9);
			var div = document.createElement('DIV');
			div.innerHTML = "<div id='balloon'>"+ MM.gui.$card.html() +"</div>";
			MM.gui.$card.html("");
			balloon.setContentDiv(div);
			ge.setBalloon(balloon);
			
			var showBalloon = function(){
				var $b = $("#balloon");
				$b.fadeIn(400);
				$b.find("img").each(function(){
					//hide broken images
					$(this).bind("error", function(){this.style.display = "none";});
				});
			};
			setTimeout(showBalloon, 800);
		}
		
	};
	var _displayScene = function(data){
		//default (spider)
		MM.mapNav.spider(data);
	};
	var _animatedTransition = function(data){	
		MM.mapNav.clearScene (function(){				
			var duration = MM.mapNav.jumpDuration;
			var method;
			if(data.location ){
				method = "copyAsLookAt";
				altMethod = "getRange";
			}else{
				method = "copyAsCamera";
				altMethod = "getAltitude";
				var camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
				camera.alt = MM.mapNav.spacePoint.alt;
				camera.tilt = MM.mapNav.spacePoint.tilt;				
			}

			var start = ge.getView()[method](ge.ALTITUDE_RELATIVE_TO_GROUND);
			
			var end = data.location ? data.location : camera;
			end.heading = Math.random() * 20 - 10;
			end.alt = end.alt ? end.alt : MM.mapNav.spaceOutAlt;
			end.tilt = end.tilt ? end.tilt : Math.random() * 20 + 40;			
			
			var latα = start.getLatitude();
			var lngα = start.getLongitude();
			var headingα = start.getHeading();
			var altα = start[altMethod]();
			var tiltα = start.getTilt();
			
			
			var latδ = end.lat ? (end.lat - latα) / duration : 0;
			var lngδ = end.lng ? (end.lng - lngα) / duration : 0;
			var headingδ = (end.heading - headingα) / duration;
			var altδ = (end.alt - altα) / duration;
			var tiltδ = (end.tilt - tiltα) / duration;
	
			var renderCallback = function(t){
				var l = ge.getView()[method](ge.ALTITUDE_RELATIVE_TO_GROUND);
				var lat = latα + (latδ * t);
				var lng = lngα + (lngδ * t);
				var heading = headingα + (headingδ * t);
				var tilt = (tiltα + (tiltδ * t)) * 
						(1 - 0.5 * Math.sin(t * Math.PI/ duration));
				var alt =  altα + (altδ * t) + 
					(	(data.location) ? (MM.mapNav.bigJumpAlt * Math.sin(t * Math.PI/ duration)) : 0 ); 
				//console.log("latitude: " + lat + "    longitude: " + lng );
				l.setLatitude(lat);
				l.setLongitude(lng);
				l.setHeading(heading);
				l.setTilt(tilt);
				if(data.location){
					l.setRange(alt);
				}else{
					l.setAltitude(alt);					
				}
				ge.getView().setAbstractView(l);
			};
			var completionCallback = function(){
				console.log('animatedTransitionComplete')
				$.event.trigger("animatedTransitionComplete", data)
			};
		
			var animation = new gex.fx.TimedAnimation(duration, 
												renderCallback ,
												completionCallback); //hmmm... maybe balloon here, card earlier?
			animation.start();		
		});
	};	

	$.template("base" , _templateMarkup);
	$.template("card" , _cardMarkup);
	
	return {
		displayCard : _displayCard,
		displayScene : _displayScene,
		updateFeedDisplay : _updateFeedDisplay,
		animatedTransition : _animatedTransition 
		}	
	
})();//MM.typeBase
	
