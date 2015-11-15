	Object.defineProperty = function(obj, prop, descriptor){
		var store = descriptor.value || descriptor.default || "undefined";
		
		var newdescriptor = {
			configurable: descriptor.configurable||false,
			enumerable:   descriptor.enumerable  ||false,
		};
		
		if(typeof(descriptor.value)!=="undefined"&&(typeof(descriptor.get)!=="undefined"||typeof(descriptor.set)!=="undefined")){
			console.error("Uncaught TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>");
		}else{
			if(typeof(descriptor.get)==="function"){
				var oldget = clone(descriptor.get, "get");
				newdescriptor.get = function(){
					if(typeof(descriptor.onget)==="function"){
						descriptor.onget(event);
						if(!event.defaultPrevented){
							return oldget()||store;
						}
					}else{
						return oldget()||store;
					}
				}
			}
			
			if(typeof(descriptor.set)==="function"){
				var oldset = clone(descriptor.set, "set");
				newdescriptor.set = function(value){
					if((typeof(descriptor.type)==="undefined")||(typeof(value)===descriptor.type)){
						if(store!=value){
							var event = new PropertyEvent("change", {
								object:obj,
								property:prop,
								new_value:value,
								old_value:store,
							})
							if(typeof(descriptor.onchange)==="function"){
								descriptor.onchange(event);
								if(!event.defaultPrevented){
									oldset(value);
									var pstore = clone(store);
									store=value;
								}
							}else{
								oldset(value);
								var pstore = clone(store);
								store=value;
							}
						}
						if(typeof(descriptor.onset)==="function"){
							descriptor.onset(event);
							if(!event.defaultPrevented){
								oldset(value);
								var pstore = clone(store);
								store=value;
							}
						}
					}else{
						if(typeof(descriptor.onerror)==="function"){
							descriptor.onerror(event);
							if(!event.defaultPrevented){
								console.error("Wrong input type @ '"+typeof(obj)+"."+prop+"'. Received input of type '"+typeof(value)+"' but expects input of type '"+descriptor.type+"'");
							}
						}else{
							console.error("Wrong input type @ '"+typeof(obj)+"."+prop+"'. Received input of type '"+typeof(value)+"' but expects input of type '"+descriptor.type+"'");
						}
					}
				}
			}
			
			defineProperty(obj, prop, newdescriptor);
		}
	}