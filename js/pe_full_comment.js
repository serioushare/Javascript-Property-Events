/**[ Javascript Property Events (JPE) ]**************************************************************
 * JPE is a simple javascript library adding events to the properties of Objects. The events follow *
 * the standard javascript event structure, and  functionality. JPE overrides Object.defineProperty *
 * with the same arguments. Adding event handlers is done throught the destriptor with the keys as  *
 * listed below.                                                                                    *
 *                                                                                                  *
 * descriptor{                                                                                      *
 *     default:*                   | Initial value for get/set properties.                          *
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
 ****************************************************************************************************/

/**[ class PropertyEvent(type, details) ]************************************************************
 * @param type:   string type         | Type of event as srting.                                    *
 * @remark:                                                                                         *
 *   Class representing the events called from the property.                                        *
 ****************************************************************************************************/
function PropertyEvent(type, details){
	var timestamp = Date.now();
	this.__proto__ = new Event(type);
	Object.defineProperties(this, {
		bubbles:          {value:false,             enumerable:true}, // Bubble the event if object is a Dom Element.
		cancelBubble:     {value:true,              enumerable:true}, // Stop the bubbling.
		cancelable:       {value:true,              enumerable:true}, // Whether it's possible to cancle the event.
		currentTarget:    {value:details.object,    enumerable:true}, // 
		eventPhase:       {value:0,                 enumerable:true}, //
		isTrusted:        {value:true,              enumerable:true}, //
		path:             {value:[],                enumerable:true}, //
		previousValue:    {value:details.old_value, enumerable:true}, // The previous property value.
		srcElement:       {value:details.object,    enumerable:true}, //
		target:           {value:details.property,  enumerable:true}, //
		timeStamp:        {value:timestamp,         enumerable:true}, //
		type:             {value:type,              enumerable:true}, //
		
		defaultPrevented: {value:false,             enumerable:true, configurable:true}, // Wherther the default action of the property is prevented.
		returnValue:      {value:details.new_value, enumerable:true, configurable:true}, // The current property value.
	});
	
	this.path.push(details.object[details.property]); // Add property to path
	this.path.push(details.object);                   // Add properties object to path
	
// Add further parent objects to path, if present
	var next = details.object;
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

(function(){
	var defineProperty = clone(Object.defineProperty, "Object.defineProperty");
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

/**[ function clone(object) ]*************************************************************************
 * @param object: object/function     | Object or Function to be cloned.                             *
 * @remark:                                                                                          *
 *   Create a clone of the given object or function, and returns it. An                              *
 *   optional string containing a name for event caller identification and                           *
 *   console output, when cloning an anonimous function.                                             *
 *****************************************************************************************************/
	function clone(object){
		var name = arguments[1]||object.name,
			object2=object,
			clone=function(){return object2.apply(object,arguments)};
		
	// copy all enumerable properties to the clone
		for(var key in object) {
			if (object.hasOwnProperty(key)) {
				clone[key] = object[key];

			}
		}
		
		console.log("created clone of '"+name+"'")
		return object2;
	}
}());

