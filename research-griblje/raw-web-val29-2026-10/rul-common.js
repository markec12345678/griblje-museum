
function addEvent(obj,event_name,func_name){if(obj.attachEvent){obj.attachEvent("on"+event_name,func_name);}else if(obj.addEventListener){obj.addEventListener(event_name,func_name,true);}else{obj["on"+event_name]=func_name;}}
function removeEvent(obj,event_name,func_name){if(obj.detachEvent){obj.detachEvent("on"+event_name,func_name);}else if(obj.removeEventListener){obj.removeEventListener(event_name,func_name,true);}else{obj["on"+event_name]=null;}}
function stopEvent(evt){evt||window.event;if(evt.stopPropagation){evt.stopPropagation();evt.preventDefault();}else if(typeof evt.cancelBubble!="undefined"){evt.cancelBubble=true;evt.returnValue=false;}
return false;}
function getElement(evt){if(window.event){return window.event.srcElement;}else{return evt.currentTarget;}}
function getTargetElement(evt){if(window.event){return window.event.srcElement;}else{return evt.target;}}
function stopSelect(obj){if(typeof obj.onselectstart!='undefined'){addEvent(obj,"selectstart",function(){return false;});}}
function getCaretEnd(obj){if(typeof obj.selectionEnd!="undefined"){return obj.selectionEnd;}else if(document.selection&&document.selection.createRange){var M=document.selection.createRange();try{var Lp=M.duplicate();Lp.moveToElementText(obj);}catch(e){var Lp=obj.createTextRange();}
Lp.setEndPoint("EndToEnd",M);var rb=Lp.text.length;if(rb>obj.value.length){return-1;}
return rb;}}
function getCaretStart(obj){if(typeof obj.selectionStart!="undefined"){return obj.selectionStart;}else if(document.selection&&document.selection.createRange){var M=document.selection.createRange();try{var Lp=M.duplicate();Lp.moveToElementText(obj);}catch(e){var Lp=obj.createTextRange();}
Lp.setEndPoint("EndToStart",M);var rb=Lp.text.length;if(rb>obj.value.length){return-1;}
return rb;}}
function setCaret(obj,l){obj.focus();if(obj.setSelectionRange){obj.setSelectionRange(l,l);}else if(obj.createTextRange){m=obj.createTextRange();m.moveStart('character',l);m.collapse();m.select();}}
function setSelection(obj,s,e){obj.focus();if(obj.setSelectionRange){obj.setSelectionRange(s,e);}else if(obj.createTextRange){m=obj.createTextRange();m.moveStart('character',s);m.moveEnd('character',e);m.select();}}
String.prototype.addslashes=function(){return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g,'\\$1');}
String.prototype.trim=function(){return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1");};function curTop(obj){toreturn=0;while(obj){toreturn+=obj.offsetTop;obj=obj.offsetParent;}
return toreturn;}
function curLeft(obj){toreturn=0;while(obj){toreturn+=obj.offsetLeft;obj=obj.offsetParent;}
return toreturn;}
function isNumber(a){return typeof a=='number'&&isFinite(a);}
function replaceHTML(obj,text){while(el=obj.childNodes[0]){obj.removeChild(el);};obj.appendChild(document.createTextNode(text));}