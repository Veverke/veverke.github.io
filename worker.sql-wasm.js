
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort
var e;e||(e=typeof Module !== 'undefined' ? Module : {});
e.onRuntimeInitialized=function(){function a(h,m){this.Na=h;this.db=m;this.Ma=1;this.eb=[]}function b(h){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=h){var m=this.filename,q=m?k("//"+m):"/";m=aa(!0,!0);q=ba(q,(void 0!==m?m:438)&4095|32768,0);if(h){if("string"===typeof h){for(var v=Array(h.length),B=0,Q=h.length;B<Q;++B)v[B]=h.charCodeAt(B);h=v}ca(q,m|146);v=l(q,"w");da(v,h,0,h.length,0,void 0);ea(v);ca(q,m)}}this.handleError(f(this.filename,c));this.db=p(c,"i32");qc(this.db);this.bb=
{};this.Ta={}}var c=t(4),d=e.cwrap,f=d("sqlite3_open","number",["string","number"]),g=d("sqlite3_close_v2","number",["number"]),n=d("sqlite3_exec","number",["number","string","number","number","number"]),r=d("sqlite3_changes","number",["number"]),w=d("sqlite3_prepare_v2","number",["number","string","number","number","number"]),u=d("sqlite3_prepare_v2","number",["number","number","number","number","number"]),C=d("sqlite3_bind_text","number",["number","number","number","number","number"]),H=d("sqlite3_bind_blob",
"number",["number","number","number","number","number"]),ka=d("sqlite3_bind_double","number",["number","number","number"]),la=d("sqlite3_bind_int","number",["number","number","number"]),rc=d("sqlite3_bind_parameter_index","number",["number","string"]),sc=d("sqlite3_step","number",["number"]),tc=d("sqlite3_errmsg","string",["number"]),ub=d("sqlite3_data_count","number",["number"]),uc=d("sqlite3_column_double","number",["number","number"]),vc=d("sqlite3_column_text","string",["number","number"]),wc=
d("sqlite3_column_blob","number",["number","number"]),xc=d("sqlite3_column_bytes","number",["number","number"]),yc=d("sqlite3_column_type","number",["number","number"]),zc=d("sqlite3_column_name","string",["number","number"]),Ac=d("sqlite3_reset","number",["number"]),Bc=d("sqlite3_clear_bindings","number",["number"]),Cc=d("sqlite3_finalize","number",["number"]),Dc=d("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Ec=d("sqlite3_value_type",
"number",["number"]),Fc=d("sqlite3_value_bytes","number",["number"]),Gc=d("sqlite3_value_text","string",["number"]),Hc=d("sqlite3_value_blob","number",["number"]),Ic=d("sqlite3_value_double","number",["number"]),Jc=d("sqlite3_result_double","",["number","number"]),vb=d("sqlite3_result_null","",["number"]),Kc=d("sqlite3_result_text","",["number","string","number","number"]),Lc=d("sqlite3_result_blob","",["number","number","number","number"]),Mc=d("sqlite3_result_int","",["number","number"]),wb=d("sqlite3_result_error",
"",["number","string","number"]),qc=d("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Na)throw"Statement closed";this.reset();return Array.isArray(h)?this.sb(h):null!=h&&"object"===typeof h?this.tb(h):!0};a.prototype.step=function(){if(!this.Na)throw"Statement closed";this.Ma=1;var h=sc(this.Na);switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.zb=function(h){null==h&&(h=this.Ma,this.Ma+=1);return uc(this.Na,h)};
a.prototype.Ab=function(h){null==h&&(h=this.Ma,this.Ma+=1);return vc(this.Na,h)};a.prototype.getBlob=function(h){null==h&&(h=this.Ma,this.Ma+=1);var m=xc(this.Na,h);var q=wc(this.Na,h);var v=new Uint8Array(m);for(h=0;h<m;)v[h]=x[q+h],h+=1;return v};a.prototype.get=function(h){var m;null!=h&&this.bind(h)&&this.step();var q=[];h=0;for(m=ub(this.Na);h<m;){switch(yc(this.Na,h)){case 1:case 2:q.push(this.zb(h));break;case 3:q.push(this.Ab(h));break;case 4:q.push(this.getBlob(h));break;default:q.push(null)}h+=
1}return q};a.prototype.getColumnNames=function(){var h;var m=[];var q=0;for(h=ub(this.Na);q<h;)m.push(zc(this.Na,q)),q+=1;return m};a.prototype.getAsObject=function(h){var m;var q=this.get(h);var v=this.getColumnNames();var B={};h=0;for(m=v.length;h<m;){var Q=v[h];B[Q]=q[h];h+=1}return B};a.prototype.run=function(h){null!=h&&this.bind(h);this.step();return this.reset()};a.prototype.wb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);h=fa(h);var q=ha(h);this.eb.push(q);this.db.handleError(C(this.Na,
m,q,h.length-1,0))};a.prototype.rb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);var q=ha(h);this.eb.push(q);this.db.handleError(H(this.Na,m,q,h.length,0))};a.prototype.vb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);this.db.handleError((h===(h|0)?la:ka)(this.Na,m,h))};a.prototype.ub=function(h){null==h&&(h=this.Ma,this.Ma+=1);H(this.Na,h,0,0,0)};a.prototype.kb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);switch(typeof h){case "string":this.wb(h,m);return;case "number":case "boolean":this.vb(h+
0,m);return;case "object":if(null===h){this.ub(m);return}if(null!=h.length){this.rb(h,m);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+h+").";};a.prototype.tb=function(h){var m=this;Object.keys(h).forEach(function(q){var v=rc(m.Na,q);0!==v&&m.kb(h[q],v)});return!0};a.prototype.sb=function(h){var m;for(m=0;m<h.length;)this.kb(h[m],m+1),m+=1;return!0};a.prototype.reset=function(){return 0===Bc(this.Na)&&0===Ac(this.Na)};a.prototype.freemem=function(){for(var h;void 0!==(h=
this.eb.pop());)ia(h)};a.prototype.free=function(){var h=0===Cc(this.Na);delete this.db.bb[this.Na];this.Na=0;return h};b.prototype.run=function(h,m){if(!this.db)throw"Database closed";if(m){h=this.prepare(h,m);try{h.step()}finally{h.free()}}else this.handleError(n(this.db,h,0,0,c));return this};b.prototype.exec=function(h,m){if(!this.db)throw"Database closed";var q=ja();try{var v=ma(h)+1,B=t(v);y(h,x,B,v);var Q=B;var F=t(4);for(h=[];0!==p(Q,"i8");){oa(c);oa(F);this.handleError(u(this.db,Q,-1,c,F));
var na=p(c,"i32");Q=p(F,"i32");if(0!==na){var S=null;var A=new a(na,this);for(null!=m&&A.bind(m);A.step();)null===S&&(S={columns:A.getColumnNames(),values:[]},h.push(S)),S.values.push(A.get());A.free()}}return h}catch(M){throw A&&A.free(),M;}finally{pa(q)}};b.prototype.each=function(h,m,q,v){"function"===typeof m&&(v=q,q=m,m=void 0);h=this.prepare(h,m);try{for(;h.step();)q(h.getAsObject())}finally{h.free()}if("function"===typeof v)return v()};b.prototype.prepare=function(h,m){oa(c);this.handleError(w(this.db,
h,-1,c,0));h=p(c,"i32");if(0===h)throw"Nothing to prepare";var q=new a(h,this);null!=m&&q.bind(m);return this.bb[h]=q};b.prototype["export"]=function(){Object.values(this.bb).forEach(function(m){m.free()});Object.values(this.Ta).forEach(qa);this.Ta={};this.handleError(g(this.db));var h=ra(this.filename);this.handleError(f(this.filename,c));this.db=p(c,"i32");return h};b.prototype.close=function(){null!==this.db&&(Object.values(this.bb).forEach(function(h){h.free()}),Object.values(this.Ta).forEach(qa),
this.Ta={},this.handleError(g(this.db)),sa("/"+this.filename),this.db=null)};b.prototype.handleError=function(h){if(0===h)return null;h=tc(this.db);throw Error(h);};b.prototype.getRowsModified=function(){return r(this.db)};b.prototype.create_function=function(h,m){Object.prototype.hasOwnProperty.call(this.Ta,h)&&(ta.push(this.Ta[h]),delete this.Ta[h]);var q=ua(function(v,B,Q){for(var F,na=[],S=0;S<B;S+=1){var A=p(Q+4*S,"i32"),M=Ec(A);if(1===M||2===M)A=Ic(A);else if(3===M)A=Gc(A);else if(4===M){M=
A;A=Fc(M);M=Hc(M);for(var Ab=new Uint8Array(A),Da=0;Da<A;Da+=1)Ab[Da]=x[M+Da];A=Ab}else A=null;na.push(A)}try{F=m.apply(null,na)}catch(Pc){wb(v,Pc,-1);return}switch(typeof F){case "boolean":Mc(v,F?1:0);break;case "number":Jc(v,F);break;case "string":Kc(v,F,-1,-1);break;case "object":null===F?vb(v):null!=F.length?(B=ha(F),Lc(v,B,F.length,-1),ia(B)):wb(v,"Wrong API use : tried to return a value of an unknown type ("+F+").",-1);break;default:vb(v)}});this.Ta[h]=q;this.handleError(Dc(this.db,h,m.length,
1,0,q,0,0,0));return this};e.Database=b};var va={},z;for(z in e)e.hasOwnProperty(z)&&(va[z]=e[z]);var wa="./this.program",xa=!1,ya=!1,za=!1,Aa=!1;xa="object"===typeof window;ya="function"===typeof importScripts;za="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;Aa=!xa&&!za&&!ya;var D="",Ba,Ca,Ea,Fa;
if(za)D=ya?require("path").dirname(D)+"/":__dirname+"/",Ba=function(a,b){Ea||(Ea=require("fs"));Fa||(Fa=require("path"));a=Fa.normalize(a);return Ea.readFileSync(a,b?null:"utf8")},Ca=function(a){a=Ba(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&(wa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!==typeof module&&(module.exports=e),process.on("unhandledRejection",E),e.inspect=function(){return"[Emscripten Module object]"};else if(Aa)"undefined"!=
typeof read&&(Ba=function(a){return read(a)}),Ca=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(xa||ya)ya?D=self.location.href:document.currentScript&&(D=document.currentScript.src),D=0!==D.indexOf("blob:")?D.substr(0,D.lastIndexOf("/")+
1):"",Ba=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},ya&&(Ca=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)});var Ga=e.print||console.log.bind(console),G=e.printErr||console.warn.bind(console);for(z in va)va.hasOwnProperty(z)&&(e[z]=va[z]);va=null;e.thisProgram&&(wa=e.thisProgram);function Ha(a){var b=I[Ia>>2];I[Ia>>2]=b+a+15&-16;return b}var ta=[];
function ua(a){if(ta.length)var b=ta.pop();else{b=Ja.length;try{Ja.grow(1)}catch(g){if(!(g instanceof RangeError))throw g;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}}try{Ja.set(b,a)}catch(g){if(!(g instanceof TypeError))throw g;assert(!0,"Missing signature argument to addFunction");if("function"===typeof WebAssembly.Function){for(var c={i:"i32",j:"i64",f:"f32",d:"f64"},d={parameters:[],results:[]},f=1;4>f;++f)d.parameters.push(c["viii"[f]]);a=new WebAssembly.Function(d,a)}else{c=[1,
0,1,96];d={i:127,j:126,f:125,d:124};c.push(3);for(f=0;3>f;++f)c.push(d["iii"[f]]);c.push(0);c[1]=c.length-2;f=new Uint8Array([0,97,115,109,1,0,0,0].concat(c,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));f=new WebAssembly.Module(f);a=(new WebAssembly.Instance(f,{e:{f:a}})).exports.f}Ja.set(b,a)}return b}function qa(a){ta.push(a)}var Ka;e.wasmBinary&&(Ka=e.wasmBinary);var noExitRuntime;e.noExitRuntime&&(noExitRuntime=e.noExitRuntime);"object"!==typeof WebAssembly&&G("no native wasm support detected");
function oa(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":x[a>>0]=0;break;case "i8":x[a>>0]=0;break;case "i16":La[a>>1]=0;break;case "i32":I[a>>2]=0;break;case "i64":J=[0,(K=0,1<=+Ma(K)?0<K?(Na(+Oa(K/4294967296),4294967295)|0)>>>0:~~+Pa((K-+(~~K>>>0))/4294967296)>>>0:0)];I[a>>2]=J[0];I[a+4>>2]=J[1];break;case "float":Qa[a>>2]=0;break;case "double":Ra[a>>3]=0;break;default:E("invalid type for setValue: "+b)}}
function p(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return x[a>>0];case "i8":return x[a>>0];case "i16":return La[a>>1];case "i32":return I[a>>2];case "i64":return I[a>>2];case "float":return Qa[a>>2];case "double":return Ra[a>>3];default:E("invalid type for getValue: "+b)}return null}var Sa,Ja=new WebAssembly.Table({initial:384,element:"anyfunc"}),Ta=!1;function assert(a,b){a||E("Assertion failed: "+b)}
function Ua(a){var b=e["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Va(a,b,c,d){var f={string:function(u){var C=0;if(null!==u&&void 0!==u&&0!==u){var H=(u.length<<2)+1;C=t(H);y(u,L,C,H)}return C},array:function(u){var C=t(u.length);x.set(u,C);return C}},g=Ua(a),n=[];a=0;if(d)for(var r=0;r<d.length;r++){var w=f[c[r]];w?(0===a&&(a=ja()),n[r]=w(d[r])):n[r]=d[r]}c=g.apply(null,n);c=function(u){return"string"===b?N(u):"boolean"===b?!!u:u}(c);0!==a&&pa(a);return c}var Wa=0,Xa=3;
function ha(a){var b=Wa;if("number"===typeof a){var c=!0;var d=a}else c=!1,d=a.length;var f;b==Xa?f=g:f=[Ya,t,Ha][b](Math.max(d,1));if(c){var g=f;assert(0==(f&3));for(a=f+(d&-4);g<a;g+=4)I[g>>2]=0;for(a=f+d;g<a;)x[g++>>0]=0;return f}a.subarray||a.slice?L.set(a,f):L.set(new Uint8Array(a),f);return f}var Za="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function $a(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&Za)return Za.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|g);else{var n=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|n:(f&7)<<18|g<<12|n<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function N(a){return a?$a(L,a,void 0):""}
function y(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var g=0;g<a.length;++g){var n=a.charCodeAt(g);if(55296<=n&&57343>=n){var r=a.charCodeAt(++g);n=65536+((n&1023)<<10)|r&1023}if(127>=n){if(c>=d)break;b[c++]=n}else{if(2047>=n){if(c+1>=d)break;b[c++]=192|n>>6}else{if(65535>=n){if(c+2>=d)break;b[c++]=224|n>>12}else{if(c+3>=d)break;b[c++]=240|n>>18;b[c++]=128|n>>12&63}b[c++]=128|n>>6&63}b[c++]=128|n&63}}b[c]=0;return c-f}
function ma(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");function ab(a){var b=ma(a)+1,c=Ya(b);c&&y(a,x,c,b);return c}var bb,x,L,La,I,Qa,Ra;
function cb(a){bb=a;e.HEAP8=x=new Int8Array(a);e.HEAP16=La=new Int16Array(a);e.HEAP32=I=new Int32Array(a);e.HEAPU8=L=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Qa=new Float32Array(a);e.HEAPF64=Ra=new Float64Array(a)}var Ia=62880,db=e.INITIAL_MEMORY||16777216;e.wasmMemory?Sa=e.wasmMemory:Sa=new WebAssembly.Memory({initial:db/65536});Sa&&(bb=Sa.buffer);db=bb.byteLength;cb(bb);I[Ia>>2]=5305920;
function eb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b();else{var c=b.yb;"number"===typeof c?void 0===b.fb?e.dynCall_v(c):e.dynCall_vi(c,b.fb):c(void 0===b.fb?null:b.fb)}}}var fb=[],gb=[],hb=[],ib=[];function jb(){var a=e.preRun.shift();fb.unshift(a)}var Ma=Math.abs,Pa=Math.ceil,Oa=Math.floor,Na=Math.min,kb=0,lb=null,mb=null;e.preloadedImages={};e.preloadedAudios={};
function E(a){if(e.onAbort)e.onAbort(a);Ga(a);G(a);Ta=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function nb(){var a=ob;return String.prototype.startsWith?a.startsWith("data:application/octet-stream;base64,"):0===a.indexOf("data:application/octet-stream;base64,")}var ob="sql-wasm.wasm";if(!nb()){var pb=ob;ob=e.locateFile?e.locateFile(pb,D):D+pb}
function qb(){try{if(Ka)return new Uint8Array(Ka);if(Ca)return Ca(ob);throw"both async and sync fetching of the wasm failed";}catch(a){E(a)}}function rb(){return Ka||!xa&&!ya||"function"!==typeof fetch?new Promise(function(a){a(qb())}):fetch(ob,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+ob+"'";return a.arrayBuffer()}).catch(function(){return qb()})}var K,J;gb.push({yb:function(){sb()}});
function tb(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}function xb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function k(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=xb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function yb(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function zb(a){if("/"===a)return"/";var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}function Bb(a){e.___errno_location&&(I[e.___errno_location()>>2]=a)}
function Cb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=xb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Db=[];function Eb(a,b){Db[a]={input:[],output:[],Ya:b};Fb(a,Gb)}
var Gb={open:function(a){var b=Db[a.node.rdev];if(!b)throw new O(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.Ya.flush(a.tty)},flush:function(a){a.tty.Ya.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.Ya.ob)throw new O(60);for(var f=0,g=0;g<d;g++){try{var n=a.tty.Ya.ob(a.tty)}catch(r){throw new O(29);}if(void 0===n&&0===f)throw new O(6);if(null===n||void 0===n)break;f++;b[c+g]=n}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.Ya.hb)throw new O(60);
try{for(var f=0;f<d;f++)a.tty.Ya.hb(a.tty,b[c+f])}catch(g){throw new O(29);}d&&(a.node.timestamp=Date.now());return f}},Hb={ob:function(a){if(!a.input.length){var b=null;if(za){var c=Buffer.qb?Buffer.qb(256):new Buffer(256),d=0;try{d=Ea.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(-1!=f.toString().indexOf("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==
typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=fa(b,!0)}return a.input.shift()},hb:function(a,b){null===b||10===b?(Ga($a(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ga($a(a.output,0)),a.output=[])}},Ib={hb:function(a,b){null===b||10===b?(G($a(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(G($a(a.output,0)),a.output=[])}},P={Ra:null,Sa:function(){return P.createNode(null,
"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new O(63);P.Ra||(P.Ra={dir:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa,lookup:P.Ja.lookup,Za:P.Ja.Za,rename:P.Ja.rename,unlink:P.Ja.unlink,rmdir:P.Ja.rmdir,readdir:P.Ja.readdir,symlink:P.Ja.symlink},stream:{Va:P.Ka.Va}},file:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa},stream:{Va:P.Ka.Va,read:P.Ka.read,write:P.Ka.write,jb:P.Ka.jb,$a:P.Ka.$a,ab:P.Ka.ab}},link:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa,readlink:P.Ja.readlink},stream:{}},lb:{node:{Qa:P.Ja.Qa,
Pa:P.Ja.Pa},stream:Jb}});c=Kb(a,b,c,d);R(c.mode)?(c.Ja=P.Ra.dir.node,c.Ka=P.Ra.dir.stream,c.Ia={}):32768===(c.mode&61440)?(c.Ja=P.Ra.file.node,c.Ka=P.Ra.file.stream,c.Oa=0,c.Ia=null):40960===(c.mode&61440)?(c.Ja=P.Ra.link.node,c.Ka=P.Ra.link.stream):8192===(c.mode&61440)&&(c.Ja=P.Ra.lb.node,c.Ka=P.Ra.lb.stream);c.timestamp=Date.now();a&&(a.Ia[b]=c);return c},Ib:function(a){if(a.Ia&&a.Ia.subarray){for(var b=[],c=0;c<a.Oa;++c)b.push(a.Ia[c]);return b}return a.Ia},Jb:function(a){return a.Ia?a.Ia.subarray?
a.Ia.subarray(0,a.Oa):new Uint8Array(a.Ia):new Uint8Array(0)},mb:function(a,b){var c=a.Ia?a.Ia.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)|0),0!=c&&(b=Math.max(b,256)),c=a.Ia,a.Ia=new Uint8Array(b),0<a.Oa&&a.Ia.set(c.subarray(0,a.Oa),0))},Fb:function(a,b){if(a.Oa!=b)if(0==b)a.Ia=null,a.Oa=0;else{if(!a.Ia||a.Ia.subarray){var c=a.Ia;a.Ia=new Uint8Array(b);c&&a.Ia.set(c.subarray(0,Math.min(b,a.Oa)))}else if(a.Ia||(a.Ia=[]),a.Ia.length>b)a.Ia.length=b;else for(;a.Ia.length<b;)a.Ia.push(0);a.Oa=
b}},Ja:{Qa:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Oa:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.xb=4096;b.blocks=Math.ceil(b.size/b.xb);return b},Pa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&P.Fb(a,
b.size)},lookup:function(){throw Lb[44];},Za:function(a,b,c,d){return P.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=Mb(b,c)}catch(g){}if(d)for(var f in d.Ia)throw new O(55);}delete a.parent.Ia[a.name];a.name=c;b.Ia[c]=a;a.parent=b},unlink:function(a,b){delete a.Ia[b]},rmdir:function(a,b){var c=Mb(a,b),d;for(d in c.Ia)throw new O(55);delete a.Ia[b]},readdir:function(a){var b=[".",".."],c;for(c in a.Ia)a.Ia.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=P.createNode(a,
b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new O(28);return a.link}},Ka:{read:function(a,b,c,d,f){var g=a.node.Ia;if(f>=a.node.Oa)return 0;a=Math.min(a.node.Oa-f,d);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=g[f+d];return a},write:function(a,b,c,d,f,g){b.buffer===x.buffer&&(g=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ia||a.Ia.subarray)){if(g)return a.Ia=b.subarray(c,c+d),a.Oa=d;if(0===a.Oa&&0===f)return a.Ia=
b.slice(c,c+d),a.Oa=d;if(f+d<=a.Oa)return a.Ia.set(b.subarray(c,c+d),f),d}P.mb(a,f+d);if(a.Ia.subarray&&b.subarray)a.Ia.set(b.subarray(c,c+d),f);else for(g=0;g<d;g++)a.Ia[f+g]=b[c+g];a.Oa=Math.max(a.Oa,f+d);return d},Va:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Oa);if(0>b)throw new O(28);return b},jb:function(a,b,c){P.mb(a.node,b+c);a.node.Oa=Math.max(a.node.Oa,b+c)},$a:function(a,b,c,d,f,g,n){if(32768!==(a.node.mode&61440))throw new O(43);a=a.node.Ia;if(n&
2||a.buffer!==b.buffer){if(0<f||f+d<a.length)a.subarray?a=a.subarray(f,f+d):a=Array.prototype.slice.call(a,f,f+d);f=!0;n=b.buffer==x.buffer;d=Ya(d);if(!d)throw new O(48);(n?x:b).set(a,d)}else f=!1,d=a.byteOffset;return{Eb:d,cb:f}},ab:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new O(43);if(f&2)return 0;P.Ka.write(a,b,0,d,c,!1);return 0}}},Nb=null,Ob={},T=[],Pb=1,U=null,Qb=!0,V={},O=null,Lb={};
function W(a,b){a=Cb("/",a);b=b||{};if(!a)return{path:"",node:null};var c={nb:!0,ib:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.ib)throw new O(32);a=xb(a.split("/").filter(function(n){return!!n}),!1);var f=Nb;c="/";for(d=0;d<a.length;d++){var g=d===a.length-1;if(g&&b.parent)break;f=Mb(f,a[d]);c=k(c+"/"+a[d]);f.Wa&&(!g||g&&b.nb)&&(f=f.Wa.root);if(!g||b.Ua)for(g=0;40960===(f.mode&61440);)if(f=Rb(c),c=Cb(yb(c),f),f=W(c,{ib:b.ib}).node,40<g++)throw new O(32);}return{path:c,node:f}}
function Sb(a){for(var b;;){if(a===a.parent)return a=a.Sa.pb,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Tb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%U.length}function Ub(a){var b=Tb(a.parent.id,a.name);if(U[b]===a)U[b]=a.Xa;else for(b=U[b];b;){if(b.Xa===a){b.Xa=a.Xa;break}b=b.Xa}}
function Mb(a,b){var c;if(c=(c=Vb(a,"x"))?c:a.Ja.lookup?0:2)throw new O(c,a);for(c=U[Tb(a.id,b)];c;c=c.Xa){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ja.lookup(a,b)}function Kb(a,b,c,d){a=new Wb(a,b,c,d);b=Tb(a.parent.id,a.name);a.Xa=U[b];return U[b]=a}function R(a){return 16384===(a&61440)}var Xb={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};
function Yb(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}function Vb(a,b){if(Qb)return 0;if(-1===b.indexOf("r")||a.mode&292){if(-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73))return 2}else return 2;return 0}function Zb(a,b){try{return Mb(a,b),20}catch(c){}return Vb(a,"wx")}function $b(a,b,c){try{var d=Mb(a,b)}catch(f){return f.La}if(a=Vb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Sb(d))return 10}else if(R(d.mode))return 31;return 0}
function ac(a){var b=4096;for(a=a||0;a<=b;a++)if(!T[a])return a;throw new O(33);}function bc(a,b){cc||(cc=function(){},cc.prototype={});var c=new cc,d;for(d in a)c[d]=a[d];a=c;b=ac(b);a.fd=b;return T[b]=a}var Jb={open:function(a){a.Ka=Ob[a.node.rdev].Ka;a.Ka.open&&a.Ka.open(a)},Va:function(){throw new O(70);}};function Fb(a,b){Ob[a]={Ka:b}}
function dc(a,b){var c="/"===b,d=!b;if(c&&Nb)throw new O(10);if(!c&&!d){var f=W(b,{nb:!1});b=f.path;f=f.node;if(f.Wa)throw new O(10);if(!R(f.mode))throw new O(54);}b={type:a,Kb:{},pb:b,Db:[]};a=a.Sa(b);a.Sa=b;b.root=a;c?Nb=a:f&&(f.Wa=b,f.Sa&&f.Sa.Db.push(b))}function ba(a,b,c){var d=W(a,{parent:!0}).node;a=zb(a);if(!a||"."===a||".."===a)throw new O(28);var f=Zb(d,a);if(f)throw new O(f);if(!d.Ja.Za)throw new O(63);return d.Ja.Za(d,a,b,c)}function X(a,b){ba(a,(void 0!==b?b:511)&1023|16384,0)}
function ec(a,b,c){"undefined"===typeof c&&(c=b,b=438);ba(a,b|8192,c)}function fc(a,b){if(!Cb(a))throw new O(44);var c=W(b,{parent:!0}).node;if(!c)throw new O(44);b=zb(b);var d=Zb(c,b);if(d)throw new O(d);if(!c.Ja.symlink)throw new O(63);c.Ja.symlink(c,b,a)}
function sa(a){var b=W(a,{parent:!0}).node,c=zb(a),d=Mb(b,c),f=$b(b,c,!1);if(f)throw new O(f);if(!b.Ja.unlink)throw new O(63);if(d.Wa)throw new O(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){G("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ja.unlink(b,c);Ub(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){G("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}}
function Rb(a){a=W(a).node;if(!a)throw new O(44);if(!a.Ja.readlink)throw new O(28);return Cb(Sb(a.parent),a.Ja.readlink(a))}function hc(a,b){a=W(a,{Ua:!b}).node;if(!a)throw new O(44);if(!a.Ja.Qa)throw new O(63);return a.Ja.Qa(a)}function ic(a){return hc(a,!0)}function ca(a,b){var c;"string"===typeof a?c=W(a,{Ua:!0}).node:c=a;if(!c.Ja.Pa)throw new O(63);c.Ja.Pa(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function jc(a){var b;"string"===typeof a?b=W(a,{Ua:!0}).node:b=a;if(!b.Ja.Pa)throw new O(63);b.Ja.Pa(b,{timestamp:Date.now()})}function kc(a,b){if(0>b)throw new O(28);var c;"string"===typeof a?c=W(a,{Ua:!0}).node:c=a;if(!c.Ja.Pa)throw new O(63);if(R(c.mode))throw new O(31);if(32768!==(c.mode&61440))throw new O(28);if(a=Vb(c,"w"))throw new O(a);c.Ja.Pa(c,{size:b,timestamp:Date.now()})}
function l(a,b,c,d){if(""===a)throw new O(44);if("string"===typeof b){var f=Xb[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=k(a);try{g=W(a,{Ua:!(b&131072)}).node}catch(n){}}f=!1;if(b&64)if(g){if(b&128)throw new O(20);}else g=ba(a,c,0),f=!0;if(!g)throw new O(44);8192===(g.mode&61440)&&(b&=-513);if(b&65536&&!R(g.mode))throw new O(54);if(!f&&(c=g?40960===(g.mode&61440)?32:R(g.mode)&&
("r"!==Yb(b)||b&512)?31:Vb(g,Yb(b)):44))throw new O(c);b&512&&kc(g,0);b&=-641;d=bc({node:g,path:Sb(g),flags:b,seekable:!0,position:0,Ka:g.Ka,Hb:[],error:!1},d);d.Ka.open&&d.Ka.open(d);!e.logReadFiles||b&1||(lc||(lc={}),a in lc||(lc[a]=1,G("FS.trackingDelegate error on read file: "+a)));try{V.onOpenFile&&(g=0,1!==(b&2097155)&&(g|=1),0!==(b&2097155)&&(g|=2),V.onOpenFile(a,g))}catch(n){G("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+n.message)}return d}
function ea(a){if(null===a.fd)throw new O(8);a.gb&&(a.gb=null);try{a.Ka.close&&a.Ka.close(a)}catch(b){throw b;}finally{T[a.fd]=null}a.fd=null}function mc(a,b,c){if(null===a.fd)throw new O(8);if(!a.seekable||!a.Ka.Va)throw new O(70);if(0!=c&&1!=c&&2!=c)throw new O(28);a.position=a.Ka.Va(a,b,c);a.Hb=[]}
function nc(a,b,c,d,f){if(0>d||0>f)throw new O(28);if(null===a.fd)throw new O(8);if(1===(a.flags&2097155))throw new O(8);if(R(a.node.mode))throw new O(31);if(!a.Ka.read)throw new O(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new O(70);b=a.Ka.read(a,b,c,d,f);g||(a.position+=b);return b}
function da(a,b,c,d,f,g){if(0>d||0>f)throw new O(28);if(null===a.fd)throw new O(8);if(0===(a.flags&2097155))throw new O(8);if(R(a.node.mode))throw new O(31);if(!a.Ka.write)throw new O(28);a.flags&1024&&mc(a,0,2);var n="undefined"!==typeof f;if(!n)f=a.position;else if(!a.seekable)throw new O(70);b=a.Ka.write(a,b,c,d,f,g);n||(a.position+=b);try{if(a.path&&V.onWriteToFile)V.onWriteToFile(a.path)}catch(r){G("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+r.message)}return b}
function ra(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||"r";b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=l(a,b.flags);a=hc(a).size;var f=new Uint8Array(a);nc(d,f,0,a,0);"utf8"===b.encoding?c=$a(f,0):"binary"===b.encoding&&(c=f);ea(d);return c}
function oc(){O||(O=function(a,b){this.node=b;this.Gb=function(c){this.La=c};this.Gb(a);this.message="FS error"},O.prototype=Error(),O.prototype.constructor=O,[44].forEach(function(a){Lb[a]=new O(a);Lb[a].stack="<generic error, no stack>"}))}var pc;function aa(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Nc(a,b,c){a=k("/dev/"+a);var d=aa(!!b,!!c);Oc||(Oc=64);var f=Oc++<<8|0;Fb(f,{open:function(g){g.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(g,n,r,w){for(var u=0,C=0;C<w;C++){try{var H=b()}catch(ka){throw new O(29);}if(void 0===H&&0===u)throw new O(6);if(null===H||void 0===H)break;u++;n[r+C]=H}u&&(g.node.timestamp=Date.now());return u},write:function(g,n,r,w){for(var u=0;u<w;u++)try{c(n[r+u])}catch(C){throw new O(29);}w&&(g.node.timestamp=Date.now());return u}});
ec(a,d,f)}var Oc,Y={},cc,lc,Qc={};
function Rc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&k(b)!==k(Sb(f.node)))return-54;throw f;}I[c>>2]=d.dev;I[c+4>>2]=0;I[c+8>>2]=d.ino;I[c+12>>2]=d.mode;I[c+16>>2]=d.nlink;I[c+20>>2]=d.uid;I[c+24>>2]=d.gid;I[c+28>>2]=d.rdev;I[c+32>>2]=0;J=[d.size>>>0,(K=d.size,1<=+Ma(K)?0<K?(Na(+Oa(K/4294967296),4294967295)|0)>>>0:~~+Pa((K-+(~~K>>>0))/4294967296)>>>0:0)];I[c+40>>2]=J[0];I[c+44>>2]=J[1];I[c+48>>2]=4096;I[c+52>>2]=d.blocks;I[c+56>>2]=d.atime.getTime()/1E3|0;I[c+60>>2]=0;I[c+64>>2]=d.mtime.getTime()/
1E3|0;I[c+68>>2]=0;I[c+72>>2]=d.ctime.getTime()/1E3|0;I[c+76>>2]=0;J=[d.ino>>>0,(K=d.ino,1<=+Ma(K)?0<K?(Na(+Oa(K/4294967296),4294967295)|0)>>>0:~~+Pa((K-+(~~K>>>0))/4294967296)>>>0:0)];I[c+80>>2]=J[0];I[c+84>>2]=J[1];return 0}var Sc=void 0;function Tc(){Sc+=4;return I[Sc-4>>2]}function Z(a){a=T[a];if(!a)throw new O(8);return a}var Uc={};
function Vc(){if(!Wc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:wa||"./this.program"},b;for(b in Uc)a[b]=Uc[b];var c=[];for(b in a)c.push(b+"="+a[b]);Wc=c}return Wc}var Wc;y("GMT",L,62944,4);
function Xc(){function a(g){return(g=g.toTimeString().match(/\(([A-Za-z ]+)\)$/))?g[1]:"GMT"}if(!Yc){Yc=!0;I[Zc()>>2]=60*(new Date).getTimezoneOffset();var b=(new Date).getFullYear(),c=new Date(b,0,1);b=new Date(b,6,1);I[$c()>>2]=Number(c.getTimezoneOffset()!=b.getTimezoneOffset());var d=a(c),f=a(b);d=ab(d);f=ab(f);b.getTimezoneOffset()<c.getTimezoneOffset()?(I[ad()>>2]=d,I[ad()+4>>2]=f):(I[ad()>>2]=f,I[ad()+4>>2]=d)}}var Yc,bd;
za?bd=function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:"undefined"!==typeof dateNow?bd=dateNow:bd=function(){return performance.now()};function cd(a){for(var b=bd();bd()-b<a/1E3;);}e._usleep=cd;function Wb(a,b,c,d){a||(a=this);this.parent=a;this.Sa=a.Sa;this.Wa=null;this.id=Pb++;this.name=b;this.mode=c;this.Ja={};this.Ka={};this.rdev=d}
Object.defineProperties(Wb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});oc();U=Array(4096);dc(P,"/");X("/tmp");X("/home");X("/home/web_user");
(function(){X("/dev");Fb(259,{read:function(){return 0},write:function(d,f,g,n){return n}});ec("/dev/null",259);Eb(1280,Hb);Eb(1536,Ib);ec("/dev/tty",1280);ec("/dev/tty1",1536);if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);var b=function(){crypto.getRandomValues(a);return a[0]}}else if(za)try{var c=require("crypto");b=function(){return c.randomBytes(1)[0]}}catch(d){}b||(b=function(){E("random_device")});Nc("random",b);Nc("urandom",b);X("/dev/shm");
X("/dev/shm/tmp")})();X("/proc");X("/proc/self");X("/proc/self/fd");dc({Sa:function(){var a=Kb("/proc/self","fd",16895,73);a.Ja={lookup:function(b,c){var d=T[+c];if(!d)throw new O(8);b={parent:null,Sa:{pb:"fake"},Ja:{readlink:function(){return d.path}}};return b.parent=b}};return a}},"/proc/self/fd");function fa(a,b){var c=Array(ma(a)+1);a=y(a,c,0,c.length);b&&(c.length=a);return c}
var fd={a:function(a,b,c,d){E("Assertion failed: "+N(a)+", at: "+[b?N(b):"unknown filename",c,d?N(d):"unknown function"])},x:function(a){try{return a=N(a),sa(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof O||E(b),-b.La}},t:function(a,b){try{return a=N(a),ca(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},E:function(a,b){try{if(0===b)return-28;if(b<ma("/")+1)return-68;y("/",L,a,b);return a}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},w:function(a,
b,c,d,f,g){try{a:{g<<=12;var n=!1;if(0!==(d&16)&&0!==a%16384)var r=-28;else{if(0!==(d&32)){var w=dd(16384,b);if(!w){r=-48;break a}ed(w,0,b);n=!0}else{var u=T[f];if(!u){r=-8;break a}var C=g,H=L;if(0!==(c&2)&&0===(d&2)&&2!==(u.flags&2097155))throw new O(2);if(1===(u.flags&2097155))throw new O(2);if(!u.Ka.$a)throw new O(43);var ka=u.Ka.$a(u,H,a,b,C,c,d);w=ka.Eb;n=ka.cb}Qc[w]={Cb:w,Bb:b,cb:n,fd:f,flags:d,offset:g};r=w}}return r}catch(la){return"undefined"!==typeof Y&&la instanceof O||E(la),-la.La}},G:function(a,
b,c){try{var d=T[a];if(!d)throw new O(8);if(0===(d.flags&2097155))throw new O(28);kc(d.node,c);return 0}catch(f){return"undefined"!==typeof Y&&f instanceof O||E(f),-f.La}},f:function(a,b){try{return a=N(a),Rc(hc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},s:function(a,b){try{return a=N(a),Rc(ic,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},r:function(a,b){try{var c=Z(a);return Rc(hc,c.path,b)}catch(d){return"undefined"!==typeof Y&&d instanceof
O||E(d),-d.La}},d:function(){return 42},I:function(){return 0},C:function(a){try{var b=T[a];if(!b)throw new O(8);jc(b.node);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},B:function(a){try{return a=N(a),jc(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof O||E(b),-b.La}},b:function(a,b,c){Sc=c;try{var d=Z(a);switch(b){case 0:var f=Tc();return 0>f?-28:l(d.path,d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;case 4:return f=Tc(),d.flags|=f,0;case 12:return f=
Tc(),La[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;case 9:return Bb(28),-1;default:return-28}}catch(g){return"undefined"!==typeof Y&&g instanceof O||E(g),-g.La}},F:function(a,b,c){try{var d=Z(a);return nc(d,x,b,c)}catch(f){return"undefined"!==typeof Y&&f instanceof O||E(f),-f.La}},h:function(a,b){try{a=N(a);if(b&-8)var c=-28;else{var d;(d=W(a,{Ua:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Vb(d,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof Y&&f instanceof
O||E(f),-f.La}},p:function(a,b){try{return a=N(a),a=k(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),X(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),-c.La}},A:function(a){try{a=N(a);var b=W(a,{parent:!0}).node,c=zb(a),d=Mb(b,c),f=$b(b,c,!0);if(f)throw new O(f);if(!b.Ja.rmdir)throw new O(63);if(d.Wa)throw new O(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){G("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ja.rmdir(b,c);Ub(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){G("FS.trackingDelegate['onDeletePath']('"+
a+"') threw an exception: "+g.message)}return 0}catch(g){return"undefined"!==typeof Y&&g instanceof O||E(g),-g.La}},i:function(a,b,c){Sc=c;try{var d=N(a),f=Tc();return l(d,b,f).fd}catch(g){return"undefined"!==typeof Y&&g instanceof O||E(g),-g.La}},y:function(a,b,c){try{a=N(a);if(0>=c)var d=-28;else{var f=Rb(a),g=Math.min(c,ma(f)),n=x[b+g];y(f,L,b,c+1);x[b+g]=n;d=g}return d}catch(r){return"undefined"!==typeof Y&&r instanceof O||E(r),-r.La}},v:function(a,b){try{if(-1===a||0===b)var c=-28;else{var d=
Qc[a];if(d&&b===d.Bb){var f=T[d.fd],g=d.flags,n=d.offset,r=L.slice(a,a+b);f&&f.Ka.ab&&f.Ka.ab(f,r,n,b,g);Qc[a]=null;d.cb&&ia(d.Cb)}c=0}return c}catch(w){return"undefined"!==typeof Y&&w instanceof O||E(w),-w.La}},u:function(a,b){try{var c=T[a];if(!c)throw new O(8);ca(c.node,b);return 0}catch(d){return"undefined"!==typeof Y&&d instanceof O||E(d),-d.La}},l:function(a,b,c){L.copyWithin(a,b,b+c)},c:function(a){var b=L.length;if(2147418112<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,
a+100663296);d=Math.max(16777216,a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Sa.grow(Math.min(2147418112,d)-bb.byteLength+65535>>16);cb(Sa.buffer);var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},n:function(a,b){var c=0;Vc().forEach(function(d,f){var g=b+c;f=I[a+4*f>>2]=g;for(g=0;g<d.length;++g)x[f++>>0]=d.charCodeAt(g);x[f>>0]=0;c+=d.length+1});return 0},o:function(a,b){var c=Vc();I[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});I[b>>2]=d;return 0},e:function(a){try{var b=Z(a);
ea(b);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),c.La}},m:function(a,b){try{var c=Z(a);x[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){return"undefined"!==typeof Y&&d instanceof O||E(d),d.La}},k:function(a,b,c,d,f){try{var g=Z(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;mc(g,a,d);J=[g.position>>>0,(K=g.position,1<=+Ma(K)?0<K?(Na(+Oa(K/4294967296),4294967295)|0)>>>0:~~+Pa((K-+(~~K>>>0))/4294967296)>>>0:0)];I[f>>
2]=J[0];I[f+4>>2]=J[1];g.gb&&0===a&&0===d&&(g.gb=null);return 0}catch(n){return"undefined"!==typeof Y&&n instanceof O||E(n),n.La}},D:function(a){try{var b=Z(a);return b.Ka&&b.Ka.fsync?-b.Ka.fsync(b):0}catch(c){return"undefined"!==typeof Y&&c instanceof O||E(c),c.La}},H:function(a,b,c,d){try{a:{for(var f=Z(a),g=a=0;g<c;g++){var n=da(f,x,I[b+8*g>>2],I[b+(8*g+4)>>2],void 0);if(0>n){var r=-1;break a}a+=n}r=a}I[d>>2]=r;return 0}catch(w){return"undefined"!==typeof Y&&w instanceof O||E(w),w.La}},g:function(a){var b=
Date.now();I[a>>2]=b/1E3|0;I[a+4>>2]=b%1E3*1E3|0;return 0},j:function(a){Xc();a=new Date(1E3*I[a>>2]);I[15724]=a.getSeconds();I[15725]=a.getMinutes();I[15726]=a.getHours();I[15727]=a.getDate();I[15728]=a.getMonth();I[15729]=a.getFullYear()-1900;I[15730]=a.getDay();var b=new Date(a.getFullYear(),0,1);I[15731]=(a.getTime()-b.getTime())/864E5|0;I[15733]=-(60*a.getTimezoneOffset());var c=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();b=b.getTimezoneOffset();a=(c!=b&&a.getTimezoneOffset()==Math.min(b,
c))|0;I[15732]=a;a=I[ad()+(a?4:0)>>2];I[15734]=a;return 62896},memory:Sa,J:function(a,b){if(0===a)return Bb(28),-1;var c=I[a>>2];a=I[a+4>>2];if(0>a||999999999<a||0>c)return Bb(28),-1;0!==b&&(I[b>>2]=0,I[b+4>>2]=0);return cd(1E6*c+a/1E3)},z:function(a){switch(a){case 30:return 16384;case 85:return 131068;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:case 79:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}Bb(28);return-1},
table:Ja,K:function(a){var b=Date.now()/1E3|0;a&&(I[a>>2]=b);return b},q:function(a,b){if(b){var c=1E3*I[b+8>>2];c+=I[b+12>>2]/1E3}else c=Date.now();a=N(a);try{b=c;var d=W(a,{Ua:!0}).node;d.Ja.Pa(d,{timestamp:Math.max(b,c)});return 0}catch(f){a=f;if(!(a instanceof O)){a+=" : ";a:{d=Error();if(!d.stack){try{throw Error();}catch(g){d=g}if(!d.stack){d="(no stack trace available)";break a}}d=d.stack.toString()}e.extraStackTrace&&(d+="\n"+e.extraStackTrace());d=tb(d);throw a+d;}Bb(a.La);return-1}}},gd=
function(){function a(f){e.asm=f.exports;kb--;e.monitorRunDependencies&&e.monitorRunDependencies(kb);0==kb&&(null!==lb&&(clearInterval(lb),lb=null),mb&&(f=mb,mb=null,f()))}function b(f){a(f.instance)}function c(f){return rb().then(function(g){return WebAssembly.instantiate(g,d)}).then(f,function(g){G("failed to asynchronously prepare wasm: "+g);E(g)})}var d={a:fd};kb++;e.monitorRunDependencies&&e.monitorRunDependencies(kb);if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return G("Module.instantiateWasm callback failed with error: "+
f),!1}(function(){if(Ka||"function"!==typeof WebAssembly.instantiateStreaming||nb()||"function"!==typeof fetch)return c(b);fetch(ob,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(g){G("wasm streaming compile failed: "+g);G("falling back to ArrayBuffer instantiation");c(b)})})})();return{}}();e.asm=gd;
var sb=e.___wasm_call_ctors=function(){return(sb=e.___wasm_call_ctors=e.asm.L).apply(null,arguments)},ed=e._memset=function(){return(ed=e._memset=e.asm.M).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.N).apply(null,arguments)};e.___errno_location=function(){return(e.___errno_location=e.asm.O).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.P).apply(null,arguments)};
e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.Q).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.R).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.S).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.T).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.U).apply(null,arguments)};
e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.V).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.W).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.X).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.Y).apply(null,arguments)};e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.Z).apply(null,arguments)};
e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm._).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm.$).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.aa).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.ba).apply(null,arguments)};e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ca).apply(null,arguments)};
e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.da).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.ea).apply(null,arguments)};e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.fa).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ga).apply(null,arguments)};e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ha).apply(null,arguments)};
e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ia).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ja).apply(null,arguments)};e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.ka).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.la).apply(null,arguments)};e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.ma).apply(null,arguments)};
e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.na).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.pa).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.qa).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.ra).apply(null,arguments)};
e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.sa).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.ta).apply(null,arguments)};e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.ua).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.va).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.wa).apply(null,arguments)};
var Ya=e._malloc=function(){return(Ya=e._malloc=e.asm.xa).apply(null,arguments)},ia=e._free=function(){return(ia=e._free=e.asm.ya).apply(null,arguments)};e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.za).apply(null,arguments)};
var ad=e.__get_tzname=function(){return(ad=e.__get_tzname=e.asm.Aa).apply(null,arguments)},$c=e.__get_daylight=function(){return($c=e.__get_daylight=e.asm.Ba).apply(null,arguments)},Zc=e.__get_timezone=function(){return(Zc=e.__get_timezone=e.asm.Ca).apply(null,arguments)},dd=e._memalign=function(){return(dd=e._memalign=e.asm.Da).apply(null,arguments)},ja=e.stackSave=function(){return(ja=e.stackSave=e.asm.Ea).apply(null,arguments)},t=e.stackAlloc=function(){return(t=e.stackAlloc=e.asm.Fa).apply(null,
arguments)},pa=e.stackRestore=function(){return(pa=e.stackRestore=e.asm.Ga).apply(null,arguments)};e.dynCall_vi=function(){return(e.dynCall_vi=e.asm.Ha).apply(null,arguments)};e.asm=gd;e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!d?Ua(a):function(){return Va(a,b,c,arguments)}};e.stackSave=ja;e.stackRestore=pa;e.stackAlloc=t;var hd;mb=function id(){hd||jd();hd||(mb=id)};
function jd(){function a(){if(!hd&&(hd=!0,e.calledRun=!0,!Ta)){e.noFSInit||pc||(pc=!0,oc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Nc("stdin",e.stdin):fc("/dev/tty","/dev/stdin"),e.stdout?Nc("stdout",null,e.stdout):fc("/dev/tty","/dev/stdout"),e.stderr?Nc("stderr",null,e.stderr):fc("/dev/tty1","/dev/stderr"),l("/dev/stdin","r"),l("/dev/stdout","w"),l("/dev/stderr","w"));eb(gb);Qb=!1;eb(hb);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();ib.unshift(b)}eb(ib)}}if(!(0<kb)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)jb();eb(fb);0<kb||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=jd;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();noExitRuntime=!0;jd();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */
var db;

function onModuleReady(SQL) {
    "use strict";

    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"])
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    "use strict";

    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        "use strict";

        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}