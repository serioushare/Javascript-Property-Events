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