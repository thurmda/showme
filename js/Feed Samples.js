(function(){

var samples = [

// WEBCAST on SPARQ
{
    uid: 100001,
    type: "Webcast",
    platform: "SparQ",
    date: new Date(1288610700000),
    topics: [
		"Consumer Goods and Services"
	],
    location: {
        _lat: "42°34'30.20N",
        _lng: "8° 8'1.88W",
        lat : 42.57331,
        lng : -8.135376,
        name: "Galicia, Spain"
    },
    participants: [
		{
		    _lat: "41°23'16.50N",
		    _lng: "2°10'11.71E",
		    lat : 41.387885,
		    lng : 2.1698,
		    name: "Barcelona, Spain"
		},
		{
		    _lat: "35°41'22.16N",
		    _lng: "139°41'30.14E",
		    lat : 35.689649,
		    lng : 139.691162,
		    name: "Tokyo, Japan"
		},
		{
		    _lat: "48°19'5.45N",
		    _lng: "7°26'29.85E",
		    lat : 48.317908,
		    lng : 7.440491,
		    name: "Alsace, France"
		}
	],
    card: {
        title: "Webcast: Fine Spanish Cheeses",
        image: "http://www.caviarmore.com/buy-caviar/image.php?type=P&id=16960",
        description: "Many Spaniards may argue that their region is the most renowned for fine cheese production. The diversity among the different types (and price) of Spanish cheese is vast, but one thing is a given….. all are ripe with rich flavour and are fantastic. Depending on your palette and preference of goat, sheep or cow cheese….cured or uncured, there will be one to your liking and the search will be worthwhile."
    }
},

//COMMENT
{
    uid: 100004,
    type: "Comment",
    platform: "Shoshin",
    date: new Date(1288780400000),
    topics: [
		    "Manfacturing",
            "Dairy"
	    ],
    location: {
        _lat: "19°25'37.38N",
        _lng: "99° 7'39.26W",
        name: "Mexico City"
    },
    participants: [
		    {
		        _lat: "41°23'16.50N",
		        _lng: "2°10'11.71E",
		        lat : 37.775057,
		        lng : -122.419281,
		        name: "San Francisco"
		    }
	    ],
    card: {
        title: "Cheesemaking Techniques in Latin America",
        image: "http://www.californiaheartland.org/this_season/episode_908/908_3_cheese_maker_001.jpg",
        description: "If I'm not currently making cheese, do I still consider myself a cheesemaker? Absofuckinglutely. John and I will make cheese again"
    }
},
{
    type: "video",
    platform: "YouTube",
    date: new Date(1288610700000),
    topics: ["Nonsense"],
    location : {name : "Gloucestershire" },
	card : {
    	duration : 8,
		description : "<object width='480' height='385'><param name='movie' value='http://www.youtube.com/v/KOyQBSMeIhM?autoplay=1'></param><param name='allowFullScreen' value='true'></param><param name='allowscriptaccess' value='always'></param><embed src='http://www.youtube.com/v/KOyQBSMeIhM?autoplay=1' type='application/x-shockwave-flash' allowscriptaccess='always'  width='480' height='385'></embed></object>"
	}
},
{
    type: "none",
    platform: "none",
    date: new Date(1288610700000),
    topics: ["No location"],
	card : {
		duration : 8000, 
		title : "Why Do People Say the Moon is Made of Green Cheese?",
		image : "http://www.kraskland.com/innovaeditor/assets/PestoCheese.jpg",
		description : "There are some sayings which were designed to be said with a tongue firmly planted in the speaker's cheek, and the supposed connection between the Moon and green cheese is one of them. When people say the moon is made of green cheese, they are almost invariably being sarcastic or deliberately obtuse. "
	}
},
{
    type: "video",
    platform: "YouTube",
    date: new Date(1288610700000),
    topics: ["Nonsense"],
    location : {name : "Red Rocks", tilt: 80 },
	card : {
    	title: "The String Cheese Incident", 
    	duration : 3,
		description : "<object width='100%' height='385'><param name='movie' value='http://www.youtube.com/v/6adCobNZl4I?autoplay=1&amp;hl=en_US'></param><param name='allowFullScreen' value='true'></param><param name='allowscriptaccess' value='always'></param><embed src='http://www.youtube.com/v/6adCobNZl4I?autoplay=1&amp;hl=en_US' type='application/x-shockwave-flash' allowscriptaccess='always' allowfullscreen='true' width='100%' height='385'></embed></object>"
	}
},
// ANSWER on SPARQ
{
    uid: 100002,
    type: "Answer",
    platform: "SparQ",
    date: new Date(1288670400000),
    topics: [
		    "Global Cheese"
	    ],
    location: {
        _lat: "43°47'3.98N",
        _lng: "88°47'16.32W",
        name: "Wisconsin"
    },
    participants: [
		    {
		        _lat: "41°23'16.50N",
		        _lng: "2°10'11.71E",
		        lat : 13.723377,
		        lng : 100.476837,
		        name: "Bangkok"
		    }
	    ],
    card: {
        title: "Why don't people in China eat cheese?",
        image: "http://thisfoodthing.files.wordpress.com/2008/09/blue-cheese.jpg",
        description: "Chinese eat very little dairy of any kind - milk, cheese, cream, yogurt etc. I saw no dairy cows in China when I was there. I think it's never been part of the culture. Perhaps dairy cows weren't adapted to local farming? Many Chinese find even the smell of dairy unpleasant. My mother absolutely refused to eat any cheese unless it was unrecognizable."
    }
},
// VIDEO
{
    uid: 100003,
    type: "Video",
    platform: "Shoshin",
    date: new Date(1288632100000),
    topics: [
		    "Manfacturing",
            "Dairy"
	    ],
    location: {
        _lat: "19°25'37.38N",
        _lng: "99° 7'39.26W",
        name: "Mexico City"
    },
    card: {
        title: "Cheesemaking Techniques in Latin America",
        image: "http://s2.hubimg.com/u/1832353_f520.jpg",
        description: "Many areas in South America are famous for cattle farming, so it's not surprising that countries like Argentina, Brazil, and Chile would produce some notable cheeses, too. With endless miles of grazing land, the cheeses of South America are often produced from the milk of cows fed from only from natural pastures."
    }
}

/*

{
    type: "video",
    platform: "YouTube",
    date: new Date(1288610700000),
    topics: ["Nonsense"],
    location: {
        name: "Milwaukee"
    },
	card : {
    	duration : 17600,
		title : "<center>The Cheese Mart</center>",
		description : "<center><object width='480' height='385'><param name='movie' value='http://www.youtube.com/v/yvppFMRy0ZE?autoplay=1'></param><param name='allowFullScreen' value='true'></param><param name='allowscriptaccess' value='always'></param><embed src='http://www.youtube.com/v/yvppFMRy0ZE?autoplay=1' type='application/x-shockwave-flash' allowscriptaccess='always' width='480' height='385'></embed></object></center>"
	}
},

*//*
// ARTICLE
{
    uid: 100004,
    type: "Article",
    platform: "Shoshin",
    date: new Date(1288780400000),
    topics: [
		    "Marketing",
            "Agriculture"
	    ],
    location: {
        _lat: "19°25'37.38N",
        _lng: "99° 7'39.26W",
        name: "Leicester"
    },
    card: {
        title: "20 Cheese marketing opportunities for the coming decade",
        image: "http://www.foodsubs.com/Photos/explorateurcheese.jpg",
        description: "As much as 60 percent of cheese sold at retail is sold with some form of merchandising, notes Roberta MacDonald, vice president of marketing for Cabot Creamery, Cabot, Vt. After paying the freight on trade promotions, most companies 'have no money left over to articulate the difference between brands,' she says. The result: Consumers often buy whatever cheese is on sale that week."
    }
}

//ARTICLE
{
    uid: 100004,
    type: "GreaseTruck",
    platform: "Chow Boi",
    date: new Date(1288780400000),
    topics: [
		    "Lunch",
            "Demo"
	    ],
	location: {name: "850 3rd Ave", lat: 40.756573, lng : -73.970255},
    participants: [
              		{
              		    lat : 40.753270,
              		    lng : -73.970251,
              		    name: "Truck 1",
              		    icon: "http://www.jasonomalley.com/users/JasonOMalley7064/images/JasonOMalley7064757912T.jpg"
              		},
              		{
              		    lat : 40.756578,
              		    lng : -73.970835,
              		    name: "Truck 2",
                  		icon: "http://www.fritesnmeats.com/img/logo_400.png"
              		},
              		{
              		    lat : 40.759283,
              		    lng : -73.97408,
              		    name: "Truck 3",
                  		icon: "http://www.mobilecravings.com/wp-content/themes/arras-theme-1/arras-theme-1/library/timthumb.php?src=http://mobilecravings.com/wp-content/uploads/2009/10/schnitzel-and-things-food-truck.png&w=205&h=95&zc=1"
              		}
              	]    ,
    card: {
        title: "Lunch trucks...",
        image: "http://www.foodsubs.com/Photos/explorateurcheese.jpg",
        description: "As much as 60 percent of cheese sold at retail is sold with some form of merchandising, notes Roberta MacDonald, vice president of marketing for Cabot Creamery, Cabot, Vt. After paying the freight on trade promotions, most companies 'have no money left over to articulate the difference between brands,' she says. The result: Consumers often buy whatever cheese is on sale that week."
    }
}
*/

];


var pointer = -1;
$(function(){
	var fakeFeed = function(){
//		pointer = (pointer + 1 + Math.floor(Math.random() * 3)) % samples.length;
		pointer = (pointer + 1) % samples.length;
		var rnd = samples[pointer];		
		MM.data.dataReciever(null , rnd);		
	}
	
setInterval(fakeFeed, 4000);
});


})();