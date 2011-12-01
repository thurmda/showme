	var myService;
	var feedUrl = "https://www.google.com/calendar/feeds/renrse57n7q4ba7gv4ro251dbo@group.calendar.google.com/public/full";

	function setupMyService() {
	  myService = new google.gdata.calendar.CalendarService('exampleCo-exampleApp-1');
	}

	function getMyFeed() {
	  setupMyService();
	 
	  myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
	}

	function handleMyFeed(myResultsFeedRoot) {
	  for(var ev in myResultsFeedRoot.feed.entry){
		 var event = myResultsFeedRoot.feed.entry[ev]; 
		var item = {
		    type: "SXSW",
		    platform: "Event",
		    date: new Date(1288780400000),
		    topics: [
				    "????"
			    ],
		    location: {
		        //_lat: "19°25'37.38N",
		        //_lng: "99° 7'39.26W",
		        name: event.gd$where[0].valueString
		    },
		    card: {
		        title: event.title.$t,
		        //image: "http://www.californiaheartland.org/this_season/episode_908/908_3_cheese_maker_001.jpg",
		        description: event.content.$t
		    }
		};
		
		MM.data.dataReciever(null , item);		
		
	  }
	}

	function handleError(e) {
	  alert("There was an error!");
	  alert(e.cause ? e.cause.statusText : e.message);
	}


	
	var init = function(){
		
	}



	
	google.load("gdata", "1");
	google.setOnLoadCallback(getMyFeed);
