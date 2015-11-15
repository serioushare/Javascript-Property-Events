# Javascript-Property-Events (JPE, JPEX)

JPE is a small Javascript library that adds events to user defined properties. It does this by extending the 'Object.defineProperty' function. The descriptor argument (third argumen) now accepts some extended properties that will define the base event handlers of the property.

### Add property 'usesSomething' to document without JPE
```javascript
Object.defineProperty(document, "usesSomething", {
    get:function(){return usesJPE},
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
                 "It used 2 if statements (check for type, and compare to previous value)");
}
```

### Add property 'usesSomething' to document with JPE
```javascript
Object.defineProperty(document, "usesSomething", {
    get:function(){return usesJPE},
    set:function(value){
        if(typeof(value)==="boolean"){   // check if the input is of the type 'boolean'
            usesSomething = value;
            doOnChange();
        }
    },
    onchange:doOnChange
})
var usesSomething = false;

function doOnChange(){
    console.info("This function is called because document.usesSomething is changed. "+
                 "It used 2 if statements (check for type, and compare to previous value)");
}
```
