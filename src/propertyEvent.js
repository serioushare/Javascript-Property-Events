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
