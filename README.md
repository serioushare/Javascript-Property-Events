# Javascript-Property-Events (JPE)

JPE is a small Javascript library that adds events to user defined properties. It does this by extending the 'Object.defineProperty' function. The descriptor argument (third argument) now accepts some extended properties that will define the base event handlers of the property.

#### Add boolean property 'property' with event to document with Javascript
This is the classical way of defining a property, leaving you with nothing but is mere excistence. This means that all value storage, recovery, type checks, and responce calls (quasy-events) are yours to deal with. And I'm not even talking about bubbling or preventing default behavior.
```javascript
Object.defineProperty(document, "property", {
    get:function(){return myProperty},
    set:function(value){
        if(typeof(value)==="boolean"){   // check if the input is of the type 'boolean'
            if(myProperty!=value){    // check if the input is not the stored value
                var event = {
                    parent:this,
                    caller:this.property,
                    type:"change",
                    oldval:myProperty,
                    newval:value,
                }
                doOnChange(event);
                myProperty = value;
            }
        }
    }
})
var myProperty = false;

function doOnChange(event){
    console.log("document.property changed from '" + event.oldval +
                                          "' to '" + event.newval +
                                          "' in '" + event.parent +
                                               "." + event.caller + "'");
}
```
#### Add boolean property 'property' with event to document with JPE
JPE extends the functionality of Object.definePrototype to handle initialization, input type checking, and throws events when
the property is accessed in any way. You can also ommit the return statement in the getter, and only use the variables within the property's own scope, keeping the current scope clean and save a line or two.
```javascript		
Object.defineProperty(document, "property", {
    default:false,
    type:"boolean",
    get:function(){},
    set:function(value){},
    onchange:doOnChange,
})

function doOnChange(event){
    console.log("document.property changed from '" + event.previousValue +
                                          "' to '" + event.returnValue +
                                          "' in '" + event.srcObject +
                                               "." + event.target + "'");
}}
```
