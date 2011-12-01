
MM.type.event = {
			templateMarkup : "<div><h3>${name}</h3>${location.name}</div>"
}
//MM.type.event.prototype = new MM.typeBase();

$.template("event" , MM.type.event.templateMarkup);
