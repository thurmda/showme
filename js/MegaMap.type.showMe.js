MM.type.showMe = (function(){
	
	var _templateMarkup ="<div class='${type}'>"+
		"<h1>${title}</h1>"+
		"<span class='date'>${when}</span>" +
		"<span class='loc'>${venue}</span>"+
		"</div>";
	var _cardMarkup =	""+
	"<h1>{{html title}}</h1>" +
	"<span class='date'>${when}</span>" +
	"<p>${venue}, ${location.name}</p>" +
//	"<span>{{html id}}</span>" +
	"<span class='desc'>{{html details}}</span>";
	
	
	
	$.template("sxswFeed" , _templateMarkup);
	$.template("sxswCard" , _cardMarkup);
	
	var _updateFeedDisplay = function(data){
//		var url = data.id +".html";
		var url = "XS.php?u=event/"+ data.id;
		MM.gui.$xxhr.attr("src", url);
		
		
		var timeline = 1000;
//		var temlateName = MM.type[data.type] ? MM.type[data.type] : "base";  
		var temlateName = "sxswFeed";  
		var shizDOM  = $.tmpl( temlateName , [data] );
		var $new = MM.gui.$feed.prepend($(shizDOM).hide()).find("*:first");
		$new.slideDown("slow");
		$new.css({opacity : .5 })
		$new.animate({opacity : 1}, timeline, "swing");
		for (var i = MM.gui.feedItemLimit; i < MM.gui.$feed[0].children.length; i++){
			$(MM.gui.$feed[0].lastChild).slideUp(function(){$(this).remove()});
		}
	};
	
	
	
	
	var _spaceOutAlt = 300,
		_bigJumpAlt = 600;
	var _displayCard = function(data){
		var $d = MM.gui.$xxhr.contents().find(".description");
			data.details = $d.html();	
//			console.log(data.card.description);
//			MM.gui.$card.fadeOut(300, function(){
				var DOM  = $.tmpl( "sxswCard" , [data] );
				MM.gui.$card.html(DOM);
				MM.gui.$card.find("img").each(function(){
					//hide broken images
					$(this).bind("error", function(){this.style.display = "none";});
				});
//				MM.gui.$card.fadeIn(1000);
//			});
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
			balloon.setMinHeight(MM.gui.getBalloonScale() *.2);
			balloon.setMaxHeight(MM.gui.getBalloonScale());
			balloon.setMinWidth(MM.gui.getBalloonScale() * 16/9);
			balloon.setMaxWidth(MM.gui.getBalloonScale() * 16/9);
			var div = document.createElement('DIV');
			div.innerHTML = "<div id='balloon'>"+ MM.gui.$card.html() +"</div>";
//			MM.gui.$card.html(""); //if video is playing have only one
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
		if(data.location.overlay){
			// Create the GroundOverlay
			var groundOverlay = ge.createGroundOverlay('');
			// Specify the image path and assign it to the GroundOverlay
			var icon = ge.createIcon('');
			icon.setHref("http://www.danielthurman.com/sxsw/img/" + data.location.overlay);
			groundOverlay.setIcon(icon);
			var latLonBox = ge.createLatLonBox('');
			latLonBox.setBox(30.264868,30.262209,-97.738377,-97.740501, -18);
			groundOverlay.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
			groundOverlay.setAltitude(172);
			groundOverlay.setLatLonBox(latLonBox);
			ge.getFeatures().appendChild(groundOverlay);
		}
			
		
		//slowPan
		
		var start = ge.getView()["copyAsLookAt"](ge.ALTITUDE_RELATIVE_TO_GROUND);
		var headingα = start.getHeading();
		var headingδ = .005  * ((6 * Math.random()) - 3);
		var altα = start["getRange"]();
		var tiltα = start.getTilt();
		var tiltδ = Math.random() * 8;

		
		var renderCallback = function(t){
			var l = ge.getView()["copyAsLookAt"](ge.ALTITUDE_RELATIVE_TO_GROUND);
			var heading = headingα + (headingδ * t) +
			.02 * Math.sin(t * Math.PI/ duration);
			var tilt = tiltα - ((10 + tiltδ)  *  Math.sin(t * Math.PI/ duration));

			
			l.setHeading(heading);
			l.setTilt(tilt);
			ge.getView().setAbstractView(l);
		};		
		var duration = 2 * (MM.feedPace / 3) - 10;
		var animation = new gex.fx.TimedAnimation(duration, renderCallback); 
			animation.start();		

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
			end.alt = end.alt ? end.alt : _spaceOutAlt;
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
					(	(data.location) ? (_bigJumpAlt * Math.sin(t * Math.PI/ duration)) : 0 ); 
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
			console.log("Jumping to : {lat : " +end.lat + ", lng: " +end.lng+ "}")
			
			animation.start();		
		});
	};	

//	$(document).bind("animatedTransitionComplete", _slowPan);	
	var _prompting = false;
	var _prompt4Sched = function(){
		if(_prompting)
			return;
		_prompting = true;
		/*
		
		MM.gui.$card.html("<h1>Are you using Sched to organize your SXSW schedule?</h1>"+
		"<p>This mashup (Google Earth + Sched) will allow you to visualize the location of each venue on your schedule. Just enter your Sched username. Then sit back and watch.</p>"+
		"<p>http://austin2011.sched.org/<input id='schedId' value='thurmda'/><button>Go</button></p>");
//		MM.gui.$card.fadeIn(1000);
		*/
		MM.gui.$card.html("<h1>Do you need to authorize acces to your calendar?</h1><a href='#' id='authorize-button' onclick='handleAuthClick();'>Login</a>");		
		////////////
		
//		_fetchSchedule(null, "thurmda");

		if(MM.goo()){
			var balloon = ge.createHtmlDivBalloon('');
			balloon.setCloseButtonEnabled(false);
			balloon.setMinHeight(MM.gui.getBalloonScale() *.2);
			balloon.setMaxHeight(MM.gui.getBalloonScale());
			balloon.setMinWidth(MM.gui.getBalloonScale() * 16/9);
			balloon.setMaxWidth(MM.gui.getBalloonScale() * 16/9);
			var div = document.createElement('DIV');
			div.innerHTML = "<div id='balloon'>"+MM.gui.$card.html()+"</div>";
			balloon.setContentDiv(div);
			ge.setBalloon(balloon);
			
			var showBalloon = function(){
				var $b = $("#balloon");
				$b.fadeIn(400);
//				$("#schedId").bind("blur" , _fetchSchedule);
//				$("#schedId").focus();
			};
			setTimeout(showBalloon, 10);
		}
	}
	
	
	var _fetchSchedule = function(e, username) {
/*
		var _username = username || $("#schedId").val();
		console.log("fetching sched for: " + _username );
		var url = _username + ".html" ;
//		var url = "XS.php?u="+ _username +"/print" ;
		$("#isched").attr("src", url);
*/
	}
var _parseCal = function(cal){
	var v = [];
	console.dir(cal);
	for (var i = 0; i < cal.items.length; i++) {
		
		(function(item){
			if(!item.summary) return;
			var exactGeo;
			console.log(item.summary);
			console.dir(item);
			if(item.summary){//item has GEO!
				if (true){
					exactGeo = $.extend({},{name: 'Name of Event'}, venues[Math.floor(Math.random() * venues.length)] );
				} 	
				var sxsw = {
				    type: "sxsw",
				    when: new Date(),
				    venue: 'Name of Venue',
				    topics: [],
				    location : exactGeo  || {name : item.summary , tilt: 70 },
				    region: "Austin, TX",
					title: 'Title',
					id: 'Id'
				}
				MM.data.dataReciever(null , sxsw);	
			}
		}(cal.items[i]));
	}
	_prompting = false;

}
	var _scheduleCB = function(e){
		var v = [];
		$(this).contents().find("#menu-venues option").each(function(){
			if($(this).html().indexOf("Select Venue") > 0 )
				return;
			var parts = this.text.split(":");
			if (parts.length > 1 )
				v[parts[0]] = parts[1];
		});
		
		$(this).contents().find("#sched-schedule tr").each(function(){
			var title = $(this).find(".title");
			if(title.length < 1 )
				return;
			var titlea = $(this).find(".title a")[0];
			var regex = /(.+)<[^>]+>([^<]+)<.+/m;
			var m = regex.exec($(titlea).html());
			var w = $(this).find(".time span").html();
			
			if (venue[m[2]]){
				var exactGeo = $.extend({},{name: v[m[2]]}, venue[m[2]]);
			} 
			
			var sxsw = {
				    type: "sxsw",
				    when: w,
				    venue: [m[2]],
				    topics: [],
				    location : exactGeo  || {name : v[m[2]], tilt: 70 },
				    region: "Austin, TX",
					title: m[1],
					id: titlea.id
				}

			MM.data.dataReciever(null , sxsw);
		});
		_prompting = false;
	}	
	$("#isched").bind("load", _scheduleCB);
	
	var _geoRules = function(point){
		if (!point || !point.x)
			return false;
		
		return true;
	}
	
	var venue = {
			"Austin Convention Center, Room 9ABC" :{lat: 30.263708, lng: -97.740112, overlay:"flr-3.png"},
			"Austin Convention Center, Ballroom A" :{lat: 30.262679,lng: -97.739772, overlay:"flr-1.png"},
			"Austin Convention Center, Ballroom B" :{lat: 30.262579,lng: -97.73946, overlay:"flr-1.png"},
			"Austin Convention Center, Ballroom C" :{lat: 30.262806,lng: -97.739466, overlay:"flr-1.png"},			

			"Austin Convention Center, Ballroom G" :{lat: 30.264683,lng: -97.739809, overlay:"flr-4.png"},			
			
			"Parking Lot 2nd & Brazos" :{lat: 30.264406,lng: -97.743386}
			
	};
	
	
	var venues = [
			{lat: 30.263708, lng: -97.740112, overlay:"flr-3.png"},
			{lat: 30.262679,lng: -97.739772, overlay:"flr-1.png"},
			{lat: 30.262579,lng: -97.73946, overlay:"flr-1.png"},
			{lat: 30.262806,lng: -97.739466, overlay:"flr-1.png"},			

			{lat: 30.264683,lng: -97.739809, overlay:"flr-4.png"},			
			{lat: 30.264406,lng: -97.743386}
		     ]
	
	
	
	
	$(document).bind("feedEmpty", _prompt4Sched);
	return {
		displayCard : _displayCard,
		displayScene : _displayScene,
		updateFeedDisplay : _updateFeedDisplay,
		animatedTransition : _animatedTransition,
		prompt4Sched : _prompt4Sched,
		geoRules : _geoRules,
		parseGoogleCalendar : _parseCal
		}	
	
})();
