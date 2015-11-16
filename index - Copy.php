<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Property Events</title>
        
        <link rel="stylesheet" type="text/css" href="../css/desx.css">
		
		<!--<script src="src/build.php"></script>-->
        <script src="current/jpe.min.js"></script>
        
        <script>
			var testObject = new function TestObject(){};
			
			// passed
			Object.defineProperty(testObject, "ClassicGetSetProperty", {
				get: function(){
					return myClassicGetSetProperty;
				},
				set: function(value){
					myClassicGetSetProperty = value;
				}
			})
			var myClassicGetSetProperty = true
			
			// passed
			Object.defineProperty(testObject, "ClassicConfigurableGetSetProperty", {
				get: function(){
					return myClassicConfigurableGetSetProperty;
				},
				set: function(value){
					myClassicConfigurableGetSetProperty = value;
				},
				configurable: true,
			})
			var myClassicConfigurableGetSetProperty = true
			// passed
			Object.defineProperty(testObject, "ClassicConfigurableGetSetProperty", {
				get: function(){
					return myClassicConfigurableGetSetPropertyAlt;
				},
				set: function(value){
					myClassicConfigurableGetSetPropertyAlt = value;
				},
				configurable: true,
			})
			var myClassicConfigurableGetSetPropertyAlt = "blah";
			
			// passed
			Object.defineProperty(testObject, "ClassicValueProperty", {
				value: true,
			})
			
			// passed
			Object.defineProperty(testObject, "ClassicWritableValueProperty", {
				value: true,
				writable: true,
			})
			
			// passed
			Object.defineProperty(testObject, "ClassicConfigurableValueProperty", {
				value: true,
				configurable: true,
			})
			// passed
			Object.defineProperty(testObject, "ClassicConfigurableValueProperty", {
				value: "next",
				configurable: true,
			})
			
			/*
			// passed
			Object.defineProperty(testObject, "ClassicIncorrectMixedProperty", {
				value: true,
				get: function(){console.info("get")},
			})
			*/
			
			// passed
			Object.defineProperty(testObject, "JpeGetSetProperty", {
				default: true,
				get: function(){},
				set: function(value){},
			})
			
			// passed
			Object.defineProperty(testObject, "JpeTypeGetSetProperty", {
				default: true,
				type: "boolean",
				get: function(){},
				set: function(value){},
			})
			
			// passed
			Object.defineProperty(testObject, "JpeOnChangeGetSetProperty", {
				default: true,
				get: function(){},
				set: function(value){},
				onget: onGet,
				onset: onSet,
				onchange: onChange,
			})
			
			// passed
			Object.defineProperty(testObject, "JpeWritableTypeValueProperty", {
				type: "boolean",
				value: true,
				writable: true,
			})
			
			
			
			
			
			function onGet(event){
				console.trace("Retreived '" + event.returnValue + "' @ '" + (event.srcObject.name||event.srcObject.constructor.name) + "." + event.target + "'");
			}
			
			function onSet(event){
				console.trace("Set to '" + event.returnValue + "' @ '" + (event.srcObject.name||event.srcObject.constructor.name) + "." + event.target + "'");
			}
			
			function onChange(event){
				console.trace("Changed from '" + event.previousValue + "' to '" + event.returnValue + "' @ '" + (event.srcObject.name||event.srcObject.constructor.name) + "." + event.target + "'");
			}
			
		</script>
	</head>
	
	<body>
    	<div class="desx_devenv_title">
        
        </div>
    	<div class="desx_devenv_pbody">
        
        </div>
        <div class="desx_devenv_source">
        	<textarea id="desx_devenv_source">
            </textarea>
        </div>
        <div class="desx_devenv_console">
        	
        </div>
	</body>
</html>
