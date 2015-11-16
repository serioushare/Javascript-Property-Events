# Javascript-Property-Events (JPE)

JPE is a small Javascript library that adds events to user defined properties. It does this by extending the 'Object.defineProperty' function. The descriptor argument (third argument) now accepts some extended properties that will define the base event handlers of the property.

## Definition

###### Syntax

```javascript
Object.defineProperty(obj, prop, descriptor)
```

###### New destriptor properties

| property     | function
| ------------ | ------------------------------------
| default      | The initial value for the property.
| type         | Expected value type, prevents the property to be set with a different type.Only used when set.

| events       | trigger
| ------------ | ------------------------------------
| onchange     | Called when the value of the property changed.
| onset        | Called when the value of the property is set, even if it didn't change.
| onget        | Called when the value of the property is revrieved.
| onerror      | Called when an error accurs with the property.
## Comparison Example

###### Add boolean property 'property' with event to document without JPE

This is the classical way of defining a property, leaving you with nothing but is mere excistence. This means that all value storage, recovery, type checks, and responce calls (quasy-events) are yours to deal with. And I'm not even talking about bubbling or preventing default behavior.

```javascript
Object.defineProperty(document, "property", {
    get:function(){                     // Return the value, stored somewhere outside the property
        return myProperty               // This poses the risk of changing it wwithout checks and triggers
    },
    set:function(value){                // Store the value outside the property, with all risks associated
        if(typeof(value)==="boolean"){  // check if the input is of the type 'boolean'
            if(myProperty!=value){      // check if the input is not the stored value
                var event = {           // Create an Object to send to the eventHandler
                    parent:this,
                    caller:this.property,
                    type:"change",
                    oldval:myProperty,
                    newval:value,
                }
                doOnChange(event);      // Call the event handler
                myProperty = value;     // Stroe the value
            }
        }
    }
})
var myProperty = false;                 // This value could be changed without doOnChange being called

function doOnChange(event){
    console.log("document.property changed from '" + event.oldval +
                                          "' to '" + event.newval +
                                          "' in '" + event.parent.name +
                                               "." + event.caller.name + "'");
}
```

###### Add boolean property 'property' with event to document with JPE

JPE extends the functionality of Object.defineProperty to handle initialization, input type checking, and throws events when the property is accessed in any way. You can also ommit the return statement in the getter, and only use the variables within the property's own scope, keeping the current scope clean and save a line or two.

```javascript		
Object.defineProperty(document, "property", {
    default:false,              // The initial value of the property
    type:"boolean",             // Used for type checking when the value is set
    get:function(){},           // The value is always stored inside, and returned if get returns empty
    set:function(value){},      // You can leave this empy when using the internal value
    onchange:doOnChange,        // Only called when the value actually changed
})

function doOnChange(event){
    console.log("document.property changed from '" + event.previousValue +
                                          "' to '" + event.returnValue +
                                          "' in '" + event.srcObject.name +
                                               "." + event.target.name + "'");
}}
```



