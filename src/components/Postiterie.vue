<template>

  <div class="container">
    <div class="button-container">
      <div class=" button-top button-orange"><i class="material-icons">photo_camera</i></div>
      <span class="button button-orange">Prendre une photo</span>
    </div>

    <div class="small-button-container">
      <label for="file" class="button button-green">Importer une photo <i class="material-icons">photo_library</i></label>
      <input style="display:none" id="file" type="file" @change="getImage($event.target.name, $event.target.files)" accept="image/png, image/jpeg">
    </div>

    <div class="upload-container" v-if="authorized && image && !link">
      <div class="input">
        <input placeholder="nom du fichier" type="text" v-model="fileName">
      </div>
      <div class="round-button_container" >
        <button @click="tracking" class="upload button"><i class="material-icons">cloud_upload</i></button>
      </div>             
    </div> 

    <div class="info" v-else-if="authorized && !link">
      Vous êtes authentifié à google drive !<br> Prenez une photo ou importez en une depuis votre galerie pour générer un schéma
    </div>

    <div class="upload-container" v-else-if="!link">
        <button id="authorize_button" class="button button-orange">S'authentifier</button>        
    </div>

    <div class="button-container" v-if="link">
      <a class="button button-orange" target="_blank"  v-bind:href="link">Ouvrir le schéma avec drawIO</a> 
    </div>
    
    <!-- has to be here for tracking-->
    <img style="display:none"  id="preview" :src="image" alt="">
  </div>

</template>
<script src="../src/tracking.js"></script>

<script>

  var authorizeButton;

export default {

  name: 'Postiterie',
  data () {
    return {
      image: null,
      results: [],
      authorized: false,
      trackingFinished: false,
      trackingFinishedWithNoResult: false,
      fileName: "",
      CLIENT_ID: '222333408772-7babrj6q1uronhdntc2a5fj6lv6m5cff.apps.googleusercontent.com',
      API_KEY: 'AIzaSyCp7-1ieE8KGorrOce7toVfdBriDXss-sM',
      DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      SCOPES: 'https://www.googleapis.com/auth/drive',
      link: null
    }
  },
  methods: {

    /* 
      FUNCTION imageDataToImage
      transform an imageData to an image
      IN : imageData
      OUT : image
    */
    imageDataToImage: function(imagedata) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        let image = new Image();
        image.src = canvas.toDataURL();
        return image;
    },

    /*
      FUNCTION crop
      Crop an image using the coordinates and return its imageData
      IN : x, y (numbers) coordinates from which to start croping
           width, height (numbers) length to crop
      OUT: imageData
    */
    crop: function( x, y, width, height){
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let img = document.getElementById('preview');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      return context.getImageData(x, y, width, height);
    },

    /*
      FUNCTION getImage
      get the uploaded image and start the tracking
      IN : fieldName : the fieldName ;)
           file : the image
    */
    getImage: function(fieldName, file) {
            this.link = null;
            let imageFile = file[0];
            let formData = new FormData();
            let imageURL = URL.createObjectURL(imageFile);
            formData.append(fieldName, imageFile);
            this.image=imageURL;
    },

    /*
      FUNCTION tracking
      Track post-its and add them to results[]
      Then, send the file
      TODO : investigate odd behavior --> the function doesn't work if not started from a onclick event (likely due to tracker.on('track', function(event))) )
    */
    tracking: function () {
      
      let $this = this;
      $this.trackingFinished = false;
      $this.trackingFinishedWithNoResult = false;

      let tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

      tracker.on('track', function(event) {
        
        event.data.forEach(function(rect) {
          
          let croppedImageData = $this.crop(rect.x,rect.y,rect.width,rect.height);
          let croppedImage = $this.imageDataToImage(croppedImageData);
          $this.results.push(croppedImage);
          console.log("+1");

        });

        setTimeout(function(){
          if ($this.results.length){
            $this.sendFile();
          }
          else $this.trackingFinishedWithNoResult = true;

        },3000);

      });

      tracking.track('#preview', tracker);
    },



    // function resultToXML
    // TODO
    // return the XML from the result array[];
    resultToXML: function(){
      let xml = "";
    
      return xml;
    },

    ///////////////////////////////
    //  GOOGLE DRIVE FUNCTIONS   //
    ///////////////////////////////

    //On load, called to load the auth2 library and API client library.
    handleClientLoad: function() {
      gapi.load('client:auth2', this.initClient);
    },

    
    //Initializes the API client library and sets up sign-in state listeners.
    initClient: function() {

      authorizeButton = document.getElementById('authorize_button');
      let $this = this;

      gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen($this.updateSigninStatus);

        // Handle the initial sign-in state.
        $this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = $this.handleAuthClick;
      }, function(error) {
        console.log(JSON.stringify(error, null, 2));
      });
    },

    // Called when the signed in status changes, to update the UI
    //  appropriately. After a sign-in, the API is called.
    updateSigninStatus: function(isSignedIn) {
      if (isSignedIn) {
        this.authorized = true;
      } else {
        this.authorized = false;
      }
    }, 

    // Sign in the user upon button click.
    handleAuthClick: function(event) {
      gapi.auth2.getAuthInstance().signIn();
    },

    // Sign out the user upon button click.
    // not used as of now
    /*handleSignoutClick: function(event) {
      gapi.auth2.getAuthInstance().signOut();
    },*/

    sendFile: function(){
      let $this = this;
      console.log("sending File");
      let fileContent = '<?xml version="1.0" encoding="UTF-8"?><mxGraphModel dx="1190" dy="757" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0"><root><mxCell id="0" /><mxCell id="1" parent="0" /></root></mxGraphModel>'
      //let fileContent = this.resultToXML()
      let file = new Blob([fileContent], {type: 'text/xml'});

      let fileName ="";

      if (this.fileName){
        fileName = this.fileName
      }
      else fileName = "La Postiterie - schéma sans nom"

      let metadata = {
          'name': fileName, // Filename at Google Drive
          'mimeType': 'text/xml', // mimeType at Google Drive
          'parents': ['root'], // Folder ID at Google Drive
      };

      let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
      let form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      form.append('file', file);

      let xhr = new XMLHttpRequest();
      xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.response.id){
          $this.link = 'https://drive.google.com/file/d/' + xhr.response.id + '/view';
        }
      };
      xhr.send(form);
    }
  },
  mounted: function(){
    //TODO : find a way to properly load googleapi with vue
    var gapi=window.gapi=window.gapi||{};gapi._bs=new Date().getTime();(function(){
      var g=window,h=document,m=g.location,n=function(){},q=/\[native code\]/,u=function(a,b,c){return a[b]=a[b]||c},aa=function(a){a=a.sort();for(var b=[],c=void 0,d=0;d<a.length;d++){var e=a[d];e!=c&&b.push(e);c=e}return b},w=function(){var a;if((a=Object.create)&&q.test(a))a=a(null);else{a={};for(var b in a)a[b]=void 0}return a},z=u(g,"gapi",{});var A;A=u(g,"___jsl",w());u(A,"I",0);u(A,"hel",10);var B=function(){var a=m.href;if(A.dpo)var b=A.h;else{b=A.h;var c=/([#].*&|[#])jsh=([^&#]*)/g,d=/([?#].*&|[?#])jsh=([^&#]*)/g;if(a=a&&(c.exec(a)||d.exec(a)))try{b=decodeURIComponent(a[2])}catch(e){}}return b},ba=function(a){var b=u(A,"PQ",[]);A.PQ=[];var c=b.length;if(0===c)a();else for(var d=0,e=function(){++d===c&&a()},f=0;f<c;f++)b[f](e)},C=function(a){return u(u(A,"H",w()),a,w())};var D=u(A,"perf",w()),F=u(D,"g",w()),ca=u(D,"i",w());u(D,"r",[]);w();w();var G=function(a,b,c){var d=D.r;"function"===typeof d?d(a,b,c):d.push([a,b,c])},K=function(a,b,c){b&&0<b.length&&(b=J(b),c&&0<c.length&&(b+="___"+J(c)),28<b.length&&(b=b.substr(0,28)+(b.length-28)),c=b,b=u(ca,"_p",w()),u(b,c,w())[a]=(new Date).getTime(),G(a,"_p",c))},J=function(a){return a.join("__").replace(/\./g,"_").replace(/\-/g,"_").replace(/,/g,"_")};var L=w(),M=[],N=function(a){throw Error("Bad hint"+(a?": "+a:""));};M.push(["jsl",function(a){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b];"object"==typeof c?A[b]=u(A,b,[]).concat(c):u(A,b,c)}if(b=a.u)a=u(A,"us",[]),a.push(b),(b=/^https:(.*)$/.exec(b))&&a.push("http:"+b[1])}]);var da=/^(\/[a-zA-Z0-9_\-]+)+$/,O=[/\/amp\//,/\/amp$/,/^\/amp$/],ea=/^[a-zA-Z0-9\-_\.,!]+$/,fa=/^gapi\.loaded_[0-9]+$/,ha=/^[a-zA-Z0-9,._-]+$/,la=function(a,b,c,d){var e=a.split(";"),f=e.shift(),l=L[f],k=null;l?k=l(e,b,c,d):N("no hint processor for: "+f);k||N("failed to generate load url");b=k;c=b.match(ia);(d=b.match(ja))&&1===d.length&&ka.test(b)&&c&&1===c.length||N("failed sanity: "+a);return k},na=function(a,b,c,d){a=ma(a);fa.test(c)||N("invalid_callback");b=P(b);d=d&&d.length?P(d):null;var e=
      function(a){return encodeURIComponent(a).replace(/%2C/g,",")};return[encodeURIComponent(a.pathPrefix).replace(/%2C/g,",").replace(/%2F/g,"/"),"/k=",e(a.version),"/m=",e(b),d?"/exm="+e(d):"","/rt=j/sv=1/d=1/ed=1",a.a?"/am="+e(a.a):"",a.c?"/rs="+e(a.c):"",a.f?"/t="+e(a.f):"","/cb=",e(c)].join("")},ma=function(a){"/"!==a.charAt(0)&&N("relative path");for(var b=a.substring(1).split("/"),c=[];b.length;){a=b.shift();if(!a.length||0==a.indexOf("."))N("empty/relative directory");else if(0<a.indexOf("=")){b.unshift(a);
      break}c.push(a)}a={};for(var d=0,e=b.length;d<e;++d){var f=b[d].split("="),l=decodeURIComponent(f[0]),k=decodeURIComponent(f[1]);2==f.length&&l&&k&&(a[l]=a[l]||k)}b="/"+c.join("/");da.test(b)||N("invalid_prefix");c=0;for(d=O.length;c<d;++c)O[c].test(b)&&N("invalid_prefix");c=Q(a,"k",!0);d=Q(a,"am");e=Q(a,"rs");a=Q(a,"t");return{pathPrefix:b,version:c,a:d,c:e,f:a}},P=function(a){for(var b=[],c=0,d=a.length;c<d;++c){var e=a[c].replace(/\./g,"_").replace(/-/g,"_");ha.test(e)&&b.push(e)}return b.join(",")},
      Q=function(a,b,c){a=a[b];!a&&c&&N("missing: "+b);if(a){if(ea.test(a))return a;N("invalid: "+b)}return null},ka=/^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,ja=/\/cb=/g,ia=/\/\//g,oa=function(){var a=B();if(!a)throw Error("Bad hint");return a};L.m=function(a,b,c,d){(a=a[0])||N("missing_hint");return"https://apis.google.com"+na(a,b,c,d)};var R=decodeURI("%73cript"),S=/^[-+_0-9\/A-Za-z]+={0,2}$/,T=function(a,b){for(var c=[],d=0;d<a.length;++d){var e=a[d],f;if(f=e){a:{for(f=0;f<b.length;f++)if(b[f]===e)break a;f=-1}f=0>f}f&&c.push(e)}return c},U=function(){var a=A.nonce;return void 0!==a?a&&a===String(a)&&a.match(S)?a:A.nonce=null:h.querySelector?(a=h.querySelector("script[nonce]"))?(a=a.nonce||a.getAttribute("nonce")||"",a&&a===String(a)&&a.match(S)?A.nonce=a:A.nonce=null):null:null},pa=function(a){if("loading"!=h.readyState)V(a);
      else{var b=U(),c="";null!==b&&(c=' nonce="'+b+'"');h.write("<"+R+' src="'+encodeURI(a)+'"'+c+"></"+R+">")}},V=function(a){var b=h.createElement(R);b.setAttribute("src",a);a=U();null!==a&&b.setAttribute("nonce",a);b.async="true";(a=h.getElementsByTagName(R)[0])?a.parentNode.insertBefore(b,a):(h.head||h.body||h.documentElement).appendChild(b)},qa=function(a,b){var c=b&&b._c;if(c)for(var d=0;d<M.length;d++){var e=M[d][0],f=M[d][1];f&&Object.prototype.hasOwnProperty.call(c,e)&&f(c[e],a,b)}},ra=function(a,
      b,c){X(function(){var c=b===B()?u(z,"_",w()):w();c=u(C(b),"_",c);a(c)},c)},Z=function(a,b){var c=b||{};"function"==typeof b&&(c={},c.callback=b);qa(a,c);b=a?a.split(":"):[];var d=c.h||oa(),e=u(A,"ah",w());if(e["::"]&&b.length){a=[];for(var f=null;f=b.shift();){var l=f.split(".");l=e[f]||e[l[1]&&"ns:"+l[0]||""]||d;var k=a.length&&a[a.length-1]||null,v=k;k&&k.hint==l||(v={hint:l,b:[]},a.push(v));v.b.push(f)}var x=a.length;if(1<x){var y=c.callback;y&&(c.callback=function(){0==--x&&y()})}for(;b=a.shift();)Y(b.b,
      c,b.hint)}else Y(b||[],c,d)},Y=function(a,b,c){a=aa(a)||[];var d=b.callback,e=b.config,f=b.timeout,l=b.ontimeout,k=b.onerror,v=void 0;"function"==typeof k&&(v=k);var x=null,y=!1;if(f&&!l||!f&&l)throw"Timeout requires both the timeout parameter and ontimeout parameter to be set";k=u(C(c),"r",[]).sort();var H=u(C(c),"L",[]).sort(),E=[].concat(k),W=function(a,b){if(y)return 0;g.clearTimeout(x);H.push.apply(H,p);var d=((z||{}).config||{}).update;d?d(e):e&&u(A,"cu",[]).push(e);if(b){K("me0",a,E);try{ra(b,
      c,v)}finally{K("me1",a,E)}}return 1};0<f&&(x=g.setTimeout(function(){y=!0;l()},f));var p=T(a,H);if(p.length){p=T(a,k);var r=u(A,"CP",[]),t=r.length;r[t]=function(a){if(!a)return 0;K("ml1",p,E);var b=function(b){r[t]=null;W(p,a)&&ba(function(){d&&d();b()})},c=function(){var a=r[t+1];a&&a()};0<t&&r[t-1]?r[t]=function(){b(c)}:b(c)};if(p.length){var I="loaded_"+A.I++;z[I]=function(a){r[t](a);z[I]=null};a=la(c,p,"gapi."+I,k);k.push.apply(k,p);K("ml0",p,E);b.sync||g.___gapisync?pa(a):V(a)}else r[t](n)}else W(p)&&
      d&&d()};var X=function(a,b){if(A.hee&&0<A.hel)try{return a()}catch(c){b&&b(c),A.hel--,Z("debug_error",function(){try{window.___jsl.hefn(c)}catch(d){throw c;}})}else try{return a()}catch(c){throw b&&b(c),c;}};z.load=function(a,b){return X(function(){return Z(a,b)})};F.bs0=window.gapi._bs||(new Date).getTime();G("bs0");F.bs1=(new Date).getTime();G("bs1");delete window.gapi._bs;}).call(this);
      gapi.load("",{callback:window["gapi_onload"],_c:{"jsl":{"ci":{"deviceType":"desktop","oauth-flow":{"authUrl":"https://accounts.google.com/o/oauth2/auth","proxyUrl":"https://accounts.google.com/o/oauth2/postmessageRelay","disableOpt":true,"idpIframeUrl":"https://accounts.google.com/o/oauth2/iframe","usegapi":false},"debug":{"reportExceptionRate":0.05,"forceIm":false,"rethrowException":false,"host":"https://apis.google.com"},"enableMultilogin":true,"googleapis.config":{"auth":{"useFirstPartyAuthV2":true}},"isPlusUser":true,"inline":{"css":1},"disableRealtimeCallback":false,"drive_share":{"skipInitCommand":true},"csi":{"rate":0.01},"client":{"cors":false},"isLoggedIn":true,"signInDeprecation":{"rate":0.0},"include_granted_scopes":true,"llang":"fr","iframes":{"youtube":{"params":{"location":["search","hash"]},"url":":socialhost:/:session_prefix:_/widget/render/youtube?usegapi\u003d1","methods":["scroll","openwindow"]},"ytsubscribe":{"url":"https://www.youtube.com/subscribe_embed?usegapi\u003d1"},"plus_circle":{"params":{"url":""},"url":":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi\u003d1"},"plus_share":{"params":{"url":""},"url":":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare\u003dtrue\u0026usegapi\u003d1"},"rbr_s":{"params":{"url":""},"url":":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller"},":source:":"3p","playemm":{"url":"https://play.google.com/work/embedded/search?usegapi\u003d1\u0026usegapi\u003d1"},"savetoandroidpay":{"url":"https://pay.google.com/gp/v/widget/save"},"blogger":{"params":{"location":["search","hash"]},"url":":socialhost:/:session_prefix:_/widget/render/blogger?usegapi\u003d1","methods":["scroll","openwindow"]},"evwidget":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/events/widget?usegapi\u003d1"},"partnersbadge":{"url":"https://www.gstatic.com/partners/badge/templates/badge.html?usegapi\u003d1"},"dataconnector":{"url":"https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi\u003d1"},"surveyoptin":{"url":"https://www.google.com/shopping/customerreviews/optin?usegapi\u003d1"},":socialhost:":"https://apis.google.com","shortlists":{"url":""},"hangout":{"url":"https://talkgadget.google.com/:session_prefix:talkgadget/_/widget"},"plus_followers":{"params":{"url":""},"url":":socialhost:/_/im/_/widget/render/plus/followers?usegapi\u003d1"},"post":{"params":{"url":""},"url":":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi\u003d1"},":gplus_url:":"https://plus.google.com","signin":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/signin?usegapi\u003d1","methods":["onauth"]},"rbr_i":{"params":{"url":""},"url":":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation"},"donation":{"url":"https://onetoday.google.com/home/donationWidget?usegapi\u003d1"},"share":{"url":":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi\u003d1"},"plusone":{"params":{"count":"","size":"","url":""},"url":":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi\u003d1"},"comments":{"params":{"location":["search","hash"]},"url":":socialhost:/:session_prefix:_/widget/render/comments?usegapi\u003d1","methods":["scroll","openwindow"]},":im_socialhost:":"https://plus.googleapis.com","backdrop":{"url":"https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi\u003d1"},"visibility":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/visibility?usegapi\u003d1"},"autocomplete":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/autocomplete"},"additnow":{"url":"https://apis.google.com/marketplace/button?usegapi\u003d1","methods":["launchurl"]},":signuphost:":"https://plus.google.com","ratingbadge":{"url":"https://www.google.com/shopping/customerreviews/badge?usegapi\u003d1"},"appcirclepicker":{"url":":socialhost:/:session_prefix:_/widget/render/appcirclepicker"},"follow":{"url":":socialhost:/:session_prefix:_/widget/render/follow?usegapi\u003d1"},"community":{"url":":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi\u003d1"},"sharetoclassroom":{"url":"https://www.gstatic.com/classroom/sharewidget/widget_stable.html?usegapi\u003d1"},"ytshare":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi\u003d1"},"plus":{"url":":socialhost:/:session_prefix:_/widget/render/badge?usegapi\u003d1"},"family_creation":{"params":{"url":""},"url":"https://families.google.com/webcreation?usegapi\u003d1\u0026usegapi\u003d1"},"commentcount":{"url":":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi\u003d1"},"configurator":{"url":":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi\u003d1"},"zoomableimage":{"url":"https://ssl.gstatic.com/microscope/embed/"},"appfinder":{"url":"https://gsuite.google.com/:session_prefix:marketplace/appfinder?usegapi\u003d1"},"savetowallet":{"url":"https://pay.google.com/gp/v/widget/save"},"person":{"url":":socialhost:/:session_prefix:_/widget/render/person?usegapi\u003d1"},"savetodrive":{"url":"https://drive.google.com/savetodrivebutton?usegapi\u003d1","methods":["save"]},"page":{"url":":socialhost:/:session_prefix:_/widget/render/page?usegapi\u003d1"},"card":{"url":":socialhost:/:session_prefix:_/hovercard/card"}}},"h":"m;/_/scs/apps-static/_/js/k\u003doz.gapi.fr.vLkUq-crCSQ.O/am\u003dwQ/rt\u003dj/d\u003d1/rs\u003dAGLTcCMf67GdhabL23WwtV7TJlXnTMw4EQ/m\u003d__features__","u":"https://apis.google.com/js/api.js","hee":true,"fp":"1f656ad1e9249f4b0926312ba3e657e5881a128f","dpo":false},"fp":"1f656ad1e9249f4b0926312ba3e657e5881a128f","annotation":["interactivepost","recobar","signin2","autocomplete","profile"],"bimodal":["signin","share"]}});
    this.handleClientLoad();
  }
}
</script>

<style scoped>
  span{
      font-weight: 100;
      width: 20%;
      text-align: center;
  }

  .button-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: column;
      align-items:center;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .small-button-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: row;
      align-items:center;
      justify-content:center;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .small-button-container .button{
      vertical-align: middle;
  }

  i{
      color:rgba(0,0,0,0.5);
      font-size: 2em!important;
  }

  .button-top{
      padding: 1em;
      padding-top: 0.7em;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      padding-bottom: 0;
      transition: 0.3s;
      cursor: pointer;
      box-shadow: 5px 5px 5px #656565;
  }

  .button-container .button{
      width: 80%;
  }

  .small-button-container .button{
      width: 80%;
  }

  i{
      vertical-align: middle;
  }

  .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
  }

  .button-orange{
      background-color: #478BF9;
  }

  .button-container:active .button-orange{
      box-shadow: 4px 4px 5px #478BF9;
  }

  .button-green{
      background-color: #db99d8;
  }


  .small-button-container:active .button-green{
      background-color: #FF992A;
      box-shadow: 4px 4px 5px #FF992A;
  }

  .upload-container .input{
      width: calc(60% - 1em);
      margin-right: 1em;
      box-sizing: border-box;
  }

  .upload-container .input input{
      background-color: rgba(0,0,0,0);
      border-style:none;
      border-bottom-style:solid;
      border-bottom-color: black;
      width: 100%;
  }

  .upload-container .input input::placeholder{
      font-weight: 100;
      text-transform: uppercase
  }

  .round-button-container{
      width: 20%;
      text-align: center;
  }

  .upload:active{
      background-color: #F8CDE0;
      box-shadow: 4px 4px 5px #F8CDE0;
  }

  .button{
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      padding: 1em;
      cursor: pointer;
      border-style: none;
      border-radius: 4px;
      font-weight: 900;
      transition: 0.3s;
      box-shadow: 5px 5px 5px #656565;
      color: black;
      text-decoration: none;
  }

  .button-green{
    padding: 0.3em;
  }

  .upload{
      background-color: #FF6B81;
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      padding: 1em;
      cursor: pointer;
      border-style: none;
      border-radius: 20px;
      font-weight: 900;
      transition: 0.3s;
      box-shadow: 5px 5px 5px #656565;
  }

  .upload-container{
      width: 100%;
      margin-top: 1em;
      display: flex;
      flex-direction: row;
      align-items:center;
      justify-content:center;
      -webkit-touch-callout: none; /* iOS Safari */   
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently*/
  }

  .info{
    margin-top: 1em;
    text-align:center;
  }

  .open-link{
    margin-top: 1em;
  }

  .margin-top{
    margin-top: 1em;
  }
</style>
