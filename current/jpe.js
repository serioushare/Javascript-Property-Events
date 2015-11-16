/***[ Javascript Property Events (JPE) ]*************************************************************
 * JPE is a simple javascript library adding events to the properties of Objects. The events follow *
 * the standard javascript event structure, and  functionality. JPE overrides Object.defineProperty *
 * with the same arguments. Adding event handlers is done throught the destriptor with the keys as  *
 * listed below.                                                                                    *
 *                                                                                                  *
 * descriptor{                                                                                      *
 *     default:*                   | Initial value when using get/set properties.                   *
 *     value:*                     | Initial value when not using get/set.                          *
 *     type:value-type             | Primary type of value, optional, throws errors.                *
 *     get:function()              | What to do when the property value is retrieved.               *
 *     set:function(value)         | What to do when a value is set.                                *
 *     onget:function(event)       | EventHandler: Called when the property value is retrieved.     *
 *     onset:function(event)       | EventHandler: Called when the property value is set, even if   *
 *                                 | it didn't change.                                              *
 *     onchange:function(event)    | EventHandler: Called when the property value is changed.       *
 *     onerror:function(event)     | EventHandler: Called when an error occurs with the property.   *
 * }                                                                                                *
 *********************************************************************************[ Serious Hare ]***/

// Import: propertyEvent.js
/***[ class PropertyEvent(type, details) ]***********************************************************
 * @param type:    string     | Type of event as srting.                                            *
 * @param details: object     | Object containing properties that need to be applies to the event.  *
 *                                                                                                  *
 * @remark:                                                                                         *
 *   Class representing the events called from the property.                                        *
 *********************************************************************************[ Serious Hare ]***/
function PropertyEvent(type, details){
	var timestamp = Date.now();
	this.__proto__ = new Event(type);
	Object.defineProperties(this, {
		bubbles:          {value:false,                 enumerable:true}, // Bubble the event if object is a Dom Element.
		cancelBubble:     {value:true,                  enumerable:true}, // Stop the bubbling.
		cancelable:       {value:true,                  enumerable:true}, // Whether it's possible to cancle the event.
		currentTarget:    {value:details.target,        enumerable:true}, // 
		eventPhase:       {value:0,                     enumerable:true}, //
		isTrusted:        {value:true,                  enumerable:true}, //
		path:             {value:[],                    enumerable:true}, //
		previousValue:    {value:details.previousValue, enumerable:true}, // The previous property value.
		srcObject:        {value:details.srcObject,     enumerable:true}, //
		target:           {value:details.target,        enumerable:true}, //
		timeStamp:        {value:timestamp,             enumerable:true}, //
		type:             {value:type,                  enumerable:true}, //
		defaultPrevented: {value:false,                 enumerable:true, configurable:true}, // Wherther the default action of the property is prevented.
		returnValue:      {value:details.returnValue,   enumerable:true, configurable:true}, // The current property value.
	});
	
	this.path.push(details.srcObject[details.target]); // Add property to path
	this.path.push(details.srcObject);                 // Add properties object to path
	
// Add further parent objects to path, if present
	var next = details.srcObject;
	while(typeof(next.parentElement)!=="undefined"&&next.parentElement!=null){
		next = next.parentElement;
		this.path.push(next);
	}
	
// Reverse the path array, to match the path array of other events.
	this.path.reverse();
	
// Prevent default behavior of the property
	this.preventDefault=function(){
		Object.defineProperties(this, {
			defaultPrevented: {value:true,              enumerable:true, configurable:false},
			returnValue:      {value:details.old_value, enumerable:true, configurable:false},
		});
	}
}
// Import: propertyEventError.js
/***[ class PropertyEvent(type, details) ]***********************************************************
 * @param type:    string     | Type of event as srting.                                            *
 * @param details: object     | Object containing properties that need to be applies to the event.  *
 *                                                                                                  *
 * @remark:                                                                                         *
 *   Class representing the events called from the property.                                        *
 *********************************************************************************[ Serious Hare ]***/
function PropertyEventError(type, details){
	var timestamp = Date.now();
	this.__proto__ = new PropertyEvent(type, details);
	Object.defineProperties(this, {
		errorCode:        {value:details.errorCode,     enumerable:true}, //
		errorText:        {value:details.errorText,     enumerable:true}, //
	});
	
	this.path.push(details.srcObject[details.target]); // Add property to path
	this.path.push(details.srcObject);                 // Add properties object to path
	
// Add further parent objects to path, if present
	var next = details.srcObject;
	while(typeof(next.parentElement)!=="undefined"&&next.parentElement!=null){
		next = next.parentElement;
		this.path.push(next);
	}
	
// Reverse the path array, to match the path array of other events.
	this.path.reverse();
	
// Prevent default behavior of the property
	this.preventDefault=function(){
		Object.defineProperties(this, {
			defaultPrevented: {value:true,              enumerable:true, configurable:false},
			returnValue:      {value:details.old_value, enumerable:true, configurable:false},
		});
	}
}

// Initialize JPE with an immediately invoked function
(function(){
// Create a local clone of Object.defineProperty.
// It is scoped within the anonymous function so it's not accessable outside the JPE properties.
	var defineProperty = clone(Object.defineProperty);
// Import: defineProperty.js
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

// Import: clone.js
/***[ function clone(object) ]***********************************************************************
 * @param object: object/function     | Object or Function to be cloned.                            *
 *                                                                                                  *
 * @remark:                                                                                         *
 *   Create a clone of the given object or function, and returns it.                                *
 *********************************************************************************[ Serious Hare ]***/
	function clone(object){
	// check if there's an object to clone.
		if(typeof(object)==="undefined"||object==null){
		// return null if there is no object.
			return null;
		}else{
			var name = arguments[1]||object.name||object.constructor.name,
				object2=object,
				clone=function(){return object2.apply(object,arguments)};
			
		// copy all enumerable properties to the clone
			for(var key in object) {
				if (object.hasOwnProperty(key)) {
					clone[key] = object[key];
				}
			}
		// Return the cloned object
			return object2;
		}
	}
}());

