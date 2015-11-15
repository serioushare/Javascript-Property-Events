# Javascript-Property-Events (JPE)

JPE is a small Javascript library that adds events to user defined properties. It does this by extending the 'Object.defineProperty' function. The descriptor argument (third argumen) now accepts some extended properties that will define the base event handlers of the property.

#### Add boolean property 'property' with event to document with Javascript
This is the classical way of defining a property, 
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

#### Add property 'property' with event to document with JPE



```javascript
Object.defineProperty(document, "property", {
    get:function(){return myProperty},		
    set:function(value){		
        if(typeof(value)==="boolean"){   // check if the input is of the type 'boolean'		
            myProperty = value;		
        }		
    },		
    onchange:doOnChange
})		
var myProperty = false;		
		
function doOnChange(event){
    console.log("document.property changed from '" + event.previousValue +
                                          "' to '" + event.returnValue +
                                          "' in '" + event.srcObject +
                                            "." + event.target + "'");
}}		
```		

You can also ommit the return statement in the getter, and only use the variables within the property's own scope, keeping the current scope clean.

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
