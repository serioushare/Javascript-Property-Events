# Javascript-Property-Events (JPE)

JPE is a small Javascript library that adds events to user defined properties. It does this by extending the 'Object.defineProperty' function. The descriptor argument (third argumen) now accepts some extended properties that will define the base event handlers of the property.

### Add property 'usesSomething' to document with Javascript
```javascript
Object.defineProperty(document, "usesSomething", {
    get:function(){return usesSomething},
    set:function(value){
        if(typeof(value)==="boolean"){   // check if the input is of the type 'boolean'
            if(usesSomething!=value){    // check if the input is not the stored value
                usesSomething = value;
                doOnChange();
            }
        }
    }
})
var usesSomething = false;

function doOnChange(){
    console.info("This function is called because document.usesSomething is changed. "+
        "It took 2 if statements (check for type, and compare to previous value) before it was called.");
}
```

### Add property 'usesSomething' to document with JPE
```javascript
Object.defineProperty(document, "usesSomething", {
    default:false,
    type:"boolean",
    get:function(){},
    set:function(value){},
    onchange:doOnChange,
})

function doOnChange(){
    console.info("This function is called because document.usesSomething is changed. "+
        "There was no need for if statements before it was called.");
}
```
