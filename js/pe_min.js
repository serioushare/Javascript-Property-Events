function PropertyEvent(e,t){var n=Date.now();this.__proto__=new Event(e),Object.defineProperties(this,{bubbles:{value:!1,enumerable:!0},cancelBubble:{value:!0,enumerable:!0},cancelable:{value:!0,enumerable:!0},currentTarget:{value:t.object,enumerable:!0},eventPhase:{value:0,enumerable:!0},isTrusted:{value:!0,enumerable:!0},path:{value:[],enumerable:!0},previousValue:{value:t.old_value,enumerable:!0},srcElement:{value:t.object,enumerable:!0},target:{value:t.property,enumerable:!0},timeStamp:{value:n,enumerable:!0},type:{value:e,enumerable:!0},defaultPrevented:{value:!1,enumerable:!0,configurable:!0},returnValue:{value:t.new_value,enumerable:!0,configurable:!0}}),this.path.push(t.object[t.property]),this.path.push(t.object);for(var r=t.object;"undefined"!=typeof r.parentElement&&null!=r.parentElement;)r=r.parentElement,this.path.push(r);this.path.reverse(),this.preventDefault=function(){Object.defineProperties(this,{defaultPrevented:{value:!0,enumerable:!0,configurable:!1},returnValue:{value:t.old_value,enumerable:!0,configurable:!1}})}}!function(){function e(e){var t=arguments[1]||e.name,n=e,r=function(){return n.apply(e,arguments)};for(var u in e)e.hasOwnProperty(u)&&(r[u]=e[u]);return console.log("created clone of '"+t+"'"),n}var t=e(Object.defineProperty,"Object.defineProperty");Object.defineProperty=function(n,r,u){var a=u.value||u["default"]||"undefined",o={configurable:u.configurable||!1,enumerable:u.enumerable||!1};if("undefined"==typeof u.value||"undefined"==typeof u.get&&"undefined"==typeof u.set){if("function"==typeof u.get){var l=e(u.get,"get");o.get=function(){return"function"!=typeof u.onget?l()||a:(u.onget(event),event.defaultPrevented?void 0:l()||a)}}if("function"==typeof u.set){var p=e(u.set,"set");o.set=function(t){if("undefined"==typeof u.type||typeof t===u.type){if(a!=t){var o=new PropertyEvent("change",{object:n,property:r,new_value:t,old_value:a});if("function"==typeof u.onchange){if(u.onchange(o),!o.defaultPrevented){p(t);{e(a)}a=t}}else{p(t);{e(a)}a=t}}if("function"==typeof u.onset&&(u.onset(o),!o.defaultPrevented)){p(t);{e(a)}a=t}}else"function"==typeof u.onerror?(u.onerror(o),o.defaultPrevented||console.error("Wrong input type @ '"+typeof n+"."+r+"'. Received input of type '"+typeof t+"' but expects input of type '"+u.type+"'")):console.error("Wrong input type @ '"+typeof n+"."+r+"'. Received input of type '"+typeof t+"' but expects input of type '"+u.type+"'")}}t(n,r,o)}else console.error("Uncaught TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>")}}();