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

imports("src/propertyEvent.js");

(function(){
	var defineProperty = clone(Object.defineProperty, "Object.defineProperty");
	imports("src/defineProperty.js");

	imports("src/clone.js");
}());

