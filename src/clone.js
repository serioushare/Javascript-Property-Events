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