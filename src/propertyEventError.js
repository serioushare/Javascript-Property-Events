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
