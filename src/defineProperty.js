	Object.defineProperty = function(obj, prop, descriptor){
	// Create a local variable to store the value of the property.
		var store = descriptor.value || descriptor.default;
	// Create a new descriptor, which will be passed on to the original Object.defineProperty function.
		var newdescriptor = {
			configurable: descriptor.configurable||false,
			enumerable:   descriptor.enumerable  ||false,
		};
	
	// Check whether the property follows the get/set or the value syntax.
	// Throw an error if both get/set and value syntax properties are pressent in the descriptor.
		if(typeof(descriptor.value)!=="undefined"&&(typeof(descriptor.get)!=="undefined"||typeof(descriptor.set)!=="undefined")){
		// Create an PropertyErrorEvent object.
			var event = new PropertyEventError("error", {
				srcObject:obj,
				target:prop,
				errorCode:0xE040,
				errorText:"Uncaught TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>",
			})
		// Call the eventHandler when present.
			if(typeof(descriptor.onerror)==="function"){
				descriptor.onerror(event);
			}
		// Display the event error text in the console.
			console.error(event.errorText);
		}else if(typeof(descriptor.value)!=="undefined"){
		// Store the value in store.	
			store = descriptor.value;
		// Create custom get function for the value property.
			newdescriptor.get = function(){
				var event = {};
				if(typeof(descriptor.onget)==="function"){
				// Detach onget for a bit to prevent stack-overflow.
					var holdOnGet = clone(descriptor.onget);
					descriptor.onget = null;
				// Create an event object for onget
					event = new PropertyEvent("get", {
						srcObject:obj,
						target:prop,
						returnValue:store,
					})
					holdOnGet(event);
				// Re-attach onget.
					descriptor.onget = clone(holdOnGet);
				}
				if(!event.defaultPrevented&&!event.canceled){
				// Return the value of store, if the event was not prevented
					return store;
				}
			}
		// Create custom set function for the value property if it's writable
			if(descriptor.writable==true){
				newdescriptor.set = function(value){
				// Do a check on the input type if the type is set
					if((typeof(descriptor.type)==="undefined")||(typeof(value)===descriptor.type)){
						var event = {}, event_2 = {};
						if(typeof(descriptor.onset)==="function"){
						// Detach onget for a bit to prevent stack-overflow.
							var holdOnGet = clone(descriptor.onget);
							descriptor.onget = null;
						// Create an event object for onset
							event = new PropertyEvent("set", {
								srcObject:obj,
								target:prop,
								returnValue:value,
								previousValue:store,
							})
							descriptor.onset(event);
						// Re-attach onget.
							descriptor.onget = clone(holdOnGet);
						}
						if(store!=value){
							if(typeof(descriptor.onchange)==="function"){
							// Detach onget for a bit to prevent stack-overflow.
								var holdOnGet = clone(descriptor.onget);
								descriptor.onget = null;
							// Create an event object for onchange
								event_2 = new PropertyEvent("change", {
									srcObject:obj,
									target:prop,
									returnValue:value,
									previousValue:store,
								})
								descriptor.onchange(event_2);
							// Re-attach onget.
								descriptor.onget = clone(holdOnGet);
							}
							if(!event.defaultPrevented&&!event.canceled
							&& !event_2.defaultPrevented&&!event_2.canceled){
							// Store the value in store, if the event was not prevented
								store=value;
							}
						}
					}else{
					// Detach onget for a bit to prevent stack-overflow.
						var holdOnGet = clone(descriptor.onget);
						descriptor.onget = null;
					// Create an event object for onerror
						var event = new PropertyEventError("error", {
							srcObject:obj,
							target:prop,
							errorCode:0xE010,
							errorText:"Wrong input type @ '"+typeof(obj)+"."+prop+"'. Received input of type '"+typeof(value)+"' but expects input of type '"+descriptor.type+"'",
						})
						if(typeof(descriptor.onerror)==="function"){
							descriptor.onerror(event);
						}
					// Re-attach onget.
						descriptor.onget = clone(holdOnGet);
					// Display the event error text in the console.
						if(!event.defaultPrevented&&!event.canceled){
							console.error(event.errorText);
						}
					}
				}
			}
		// Create the newly generated property with the original Object.defineProperty clone
			defineProperty(obj, prop, newdescriptor);
		}else{
			if(typeof(descriptor.get)==="function"){
			// Clone the original get function
				var oldget = clone(descriptor.get, "get");
			// Create custom get function for the value property.
				newdescriptor.get = function(){
					var event = {};
					if(typeof(descriptor.onget)==="function"){
					// Detach onget for a bit to prevent stack-overflow.
						var holdOnGet = clone(descriptor.onget);
						descriptor.onget = null;
					// Create an event object for onget
						event = new PropertyEvent("get", {
							srcObject:obj,
							target:prop,
							returnValue:store,
						})
						holdOnGet(event);
					// Re-attach onget.
						descriptor.onget = clone(holdOnGet);
					}
					if(!event.defaultPrevented){
					// Call the original get function, if the event was not prevented
						return oldget()||store;
					}
				}
			}
			if(typeof(descriptor.set)==="function"){
			// Clone the original set function
				var oldset = clone(descriptor.set, "set");
			// Create custom set function for the value property.
				newdescriptor.set = function(value){
					if((typeof(descriptor.type)==="undefined")||(typeof(value)===descriptor.type)){
						var event = {}, event_2 = {};
						if(typeof(descriptor.onset)==="function"){
						// Detach onget for a bit to prevent stack-overflow.
							var holdOnGet = clone(descriptor.onget);
							descriptor.onget = null;
						// Create an event object for onerror
							event = new PropertyEvent("set", {
								srcObject:obj,
								target:prop,
								returnValue:value,
								previousValue:store,
							})
							descriptor.onset(event);
						// Re-attach onget.
							descriptor.onget = clone(holdOnGet);
						}
						if(store!=value){
							if(typeof(descriptor.onchange)==="function"){
							// Detach onget for a bit to prevent stack-overflow.
								var holdOnGet = clone(descriptor.onget);
								descriptor.onget = null;
							// Create an event object for onerror
								event_2 = new PropertyEvent("change", {
									srcObject:obj,
									target:prop,
									returnValue:value,
									previousValue:store,
								})
								descriptor.onchange(event_2);
							// Re-attach onget.
								descriptor.onget = clone(holdOnGet);
							}
							if(!event.defaultPrevented&&!event_2.defaultPrevented){
							// Store the value in store, and call the original set function, if the event was not prevented
								oldset(value);
								store=value;
							}
						}else{
							if(!event.defaultPrevented&&!event_2.defaultPrevented){
							// Call the original set function, if the event was not prevented
								oldset(value);
							}
						}
					}else{
					// Detach onget for a bit to prevent stack-overflow.
						var holdOnGet = clone(descriptor.onget);
						descriptor.onget = null;
					// Create an event object for onerror
						var event = new PropertyEventError("error", {
							srcObject:obj,
							target:prop,
							errorCode:0xE010,
							errorText:"Wrong input type @ '"+typeof(obj)+"."+prop+"'. Received input of type '"+typeof(value)+"' but expects input of type '"+descriptor.type+"'",
						})
						if(typeof(descriptor.onerror)==="function"){
							descriptor.onerror(event);
						}
					// Re-attach onget.
						descriptor.onget = clone(holdOnGet);
					// Display the event error text in the console.
						if(!event.defaultPrevented&&!event.canceled){
							console.error(event.errorText);
						}
					}
				}
			}
		// Create the newly generated property with the original Object.defineProperty clone
			defineProperty(obj, prop, newdescriptor);
		}
	}