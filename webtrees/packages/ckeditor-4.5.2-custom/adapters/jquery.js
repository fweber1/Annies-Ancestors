(function(b){if("undefined"==typeof b){throw Error("jQuery should be loaded before CKEditor jQuery adapter.")}if("undefined"==typeof CKEDITOR){throw Error("CKEditor should be loaded before CKEditor jQuery adapter.")}CKEDITOR.config.jqueryOverrideVal="undefined"==typeof CKEDITOR.config.jqueryOverrideVal?!0:CKEDITOR.config.jqueryOverrideVal;b.extend(b.fn,{ckeditorGet:function(){var c=this.eq(0).data("ckeditorInstance");if(!c){throw"CKEditor is not initialized yet, use ckeditor() with a callback."}return c},ckeditor:function(e,i){if(!CKEDITOR.env.isCompatible){throw Error("The environment is incompatible.")}if(!b.isFunction(e)){var a=i;i=e;e=a}var c=[];i=i||{};this.each(function(){var d=b(this),m=d.data("ckeditorInstance"),k=d.data("_ckeditorInstanceLock"),j=this,g=new b.Deferred;c.push(g.promise());if(m&&!k){e&&e.apply(m,[this]),g.resolve()}else{if(k){m.once("instanceReady",function(){setTimeout(function(){m.element?(m.element.$==j&&e&&e.apply(m,[j]),g.resolve()):setTimeout(arguments.callee,100)},0)},null,null,9999)}else{if(i.autoUpdateElement||"undefined"==typeof i.autoUpdateElement&&CKEDITOR.config.autoUpdateElement){i.autoUpdateElementJquery=!0}i.autoUpdateElement=!1;d.data("_ckeditorInstanceLock",!0);m=b(this).is("textarea")?CKEDITOR.replace(j,i):CKEDITOR.inline(j,i);d.data("ckeditorInstance",m);m.on("instanceReady",function(l){var f=l.editor;setTimeout(function(){if(f.element){l.removeListener();f.on("dataReady",function(){d.trigger("dataReady.ckeditor",[f])});f.on("setData",function(o){d.trigger("setData.ckeditor",[f,o.data])});f.on("getData",function(o){d.trigger("getData.ckeditor",[f,o.data])},999);f.on("destroy",function(){d.trigger("destroy.ckeditor",[f])});f.on("save",function(){b(j.form).submit();return !1},null,null,20);if(f.config.autoUpdateElementJquery&&d.is("textarea")&&b(j.form).length){var n=function(){d.ckeditor(function(){f.updateElement()})};b(j.form).submit(n);b(j.form).bind("form-pre-serialize",n);d.bind("destroy.ckeditor",function(){b(j.form).unbind("submit",n);b(j.form).unbind("form-pre-serialize",n)})}f.on("destroy",function(){d.removeData("ckeditorInstance")});d.removeData("_ckeditorInstanceLock");d.trigger("instanceReady.ckeditor",[f]);e&&e.apply(f,[j]);g.resolve()}else{setTimeout(arguments.callee,100)}},0)},null,null,9999)}}});var h=new b.Deferred;this.promise=h.promise();b.when.apply(this,c).then(function(){h.resolve()});this.editor=this.eq(0).data("ckeditorInstance");return this}});CKEDITOR.config.jqueryOverrideVal&&(b.fn.val=CKEDITOR.tools.override(b.fn.val,function(a){return function(j){if(arguments.length){var g=this,h=[],i=this.each(function(){var d=b(this),m=d.data("ckeditorInstance");if(d.is("textarea")&&m){var k=new b.Deferred;m.setData(j,function(){k.resolve()});h.push(k.promise());return !0}return a.call(d,j)});if(h.length){var e=new b.Deferred;b.when.apply(this,h).done(function(){e.resolveWith(g)});return e.promise()}return i}var i=b(this).eq(0),l=i.data("ckeditorInstance");return i.is("textarea")&&l?l.getData():a.call(i)}}))})(window.jQuery);