
(function(){
	console.info("apply mod to Object.defineProperty");
	var defineProperty = clone(Object.defineProperty);
	
	Object.defineProperty = function(obj, prop, descriptor){
		var store    = descriptor.value    || descriptor.default;
		var type     = descriptor.type     || "undefined";
		var get      = descriptor.get;
		var set      = descriptor.set;
		var value    = descriptor.value;
		var onget    = descriptor.onget    || function(){};
		var onset    = descriptor.onset    || function(){};
		var onchange = descriptor.onchange || function(){};
		
		var newdescriptor = {};
		
		if(typeof(value)!=="undefined"&&(typeof(get)!=="undefined"||typeof(set)!=="undefined")){
			console.error("Uncaught TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>");
		}else{
			if(typeof(get)==="function"){
				var oldget = clone(get);
				newdescriptor.get = function(){
					return oldget()||store;
				}
			}
			
			if(typeof(set)==="function"||typeof(value)==="undefined"){
				var oldset = clone(set);
				newdescriptor.set = function(value){
					if((type==="undefined")||(typeof(value)===type)){
						if(store!=value){
							var event = new PropertyEvent("change", {
								object:obj,
								property:prop,
								new_value:value,
								old_value:store,
							})
							onchange(event);
							if(!event.defaultPrevented){
								oldset(value);
								var pstore = clone(store);
								store=value;
							}
						}
					}else{
						console.error("Wrong input type @ '"+typeof(obj)+"."+prop+"'. Received input of type '"+typeof(value)+"' but expects input of type '"+type+"'");
					}
				}
			}
			
			defineProperty(obj, prop, newdescriptor);
		}
	}
	
	function clone(object){
		var that = object;
		var temp = function(){return that.apply(object, arguments);};
		for(var key in object) {
			if (object.hasOwnProperty(key)) {
				temp[key] = object[key];
			}
		}
		return temp;
	}
}());

function PropertyEvent(type, details){
	var timestamp = Date.now();
	this.__proto__ = new Event(type);
	Object.defineProperties(this, {
		bubbles:          {value:false,             enumerable:true},
		cancelBubble:     {value:true,              enumerable:true},
		cancelable:       {value:true,              enumerable:true},
		currentTarget:    {value:null,              enumerable:true},
		defaultPrevented: {value:false,             enumerable:true, configurable:true},
		eventPhase:       {value:0,                 enumerable:true},
		isTrusted:        {value:true,              enumerable:true},
		path:             {value:[],                enumerable:true},
		previousValue:    {value:details.old_value, enumerable:true},
		returnValue:      {value:details.new_value, enumerable:true},
		srcElement:       {value:details.object,    enumerable:true},
		target:           {value:details.property,  enumerable:true},
		timeStamp:        {value:timestamp,         enumerable:true},
		type:             {value:type,              enumerable:true},
	});
	this.path.push(details.object[details.property]);
	this.path.push(details.object);
	var next = details.object;
	while(typeof(next.parentElement)!=="undefined"&&next.parentElement!=null){
		next = next.parentElement;
		this.path.push(next);
	}
	
	this.path.reverse();
	
	this.preventDefault=function(){
		Object.defineProperties(this, {defaultPrevented: {value:true,enumerable:true}});
	}
}
