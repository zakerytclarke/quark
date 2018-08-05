var state=0;
changestate(0);
function changestate(newstate){
  state=newstate;
  //Hide all States
  document.getElementById("login").style.display="none";
  document.getElementById("editor").style.display="none";
  document.getElementById("side").style.display="none";
  document.getElementById("hidemenu").style.display="none";
  document.getElementById("menubutton").style.display="none";
  document.getElementById("menumobile").style.display="none";
  document.getElementById("home").style.display="none";
  document.getElementById("error").style.display="none";
  switch(state){
    case 0://Login
      document.getElementById("login").style.display="block";
    break;
    case 1://Repos
      document.getElementById("editor").style.display="home";
    break;
    case 2://Editor
      document.getElementById("editor").style.display="block";
      document.getElementById("side").style.display="block";
      if(window.innerHeight>window.innerWidth){
        document.getElementById("menubutton").style.display="block";
      }else{
        document.getElementById("hidemenu").style.display="block";
      }
    break;
    case 3://Settings

    break;
    case 4://Error
      document.getElementById("error").style.display="block";
    break;
    default:
    state=0;
  }
}
//if(getCookie("user")!=null&&getCookie("token")!=null){
if(getCookie("user")!=null){
  user=getCookie("user");
  token=getCookie("token");
  url="https://api.github.com/users/"+user+"/repos?access_token="+token;
  gituser.open("GET",url,true);
  gituser.send();

  document.getElementById("login").style.display="none";
  document.getElementById("home").style.display="block";
}

var menu=0;
function menuclick(){
var top=document.getElementById("menutop");
var middle=document.getElementById("menumiddle");
var bottom=document.getElementById("menubottom");
if(menu==0){
  middle.style.display="none";
  top.style.transform="rotate(45deg)";
  bottom.style.transform="rotate(-45deg)";
  top.style.top="40%";
  bottom.style.top="40%";
  menu=1;

  document.getElementById("menumobile").style.display="block";
}else{
  middle.style.display="block";
  top.style.transform="rotate(0deg)";
  bottom.style.transform="rotate(0deg)";
  top.style.top="15%";
  bottom.style.top="65%";
  menu=0;
  document.getElementById("menumobile").style.display="none";
}
}




function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD',image_url,true);
    http.send();
    return http.status != 404;
}
function login(){
  if(document.getElementById("userin").value==null||document.getElementById("userin").value==""){
    document.getElementById("userin").style.border="3px #ff5538 solid";
  }else{
    document.getElementById("userin").style.border="3px #313c47 solid";
    user=document.getElementById("userin").value;
  }
  if(document.getElementById("patin").value==null||document.getElementById("patin").value==""){
    document.getElementById("patin").style.border="3px #ff5538 solid";
  }else{
    document.getElementById("patin").style.border="3px #313c47 solid";
    token=document.getElementById("patin").value;
  }
  if(document.getElementById("userin").value==null||document.getElementById("userin").value==""||document.getElementById("patin").value==null||document.getElementById("patin").value==""){

  }else{
    if(document.getElementById("remember").checked){
      setCookie("user",user,36500);
      setCookie("token",token,36500);
    }

    url="https://api.github.com/users/"+user+"/repos?access_token="+token;
    gituser.open("GET",url,true);
    gituser.send();
    document.getElementById("login").style.display="none";
    document.getElementById("home").style.display="block";
  }

}
function logout(){
  deleteCookie("user");
  deleteCookie("token");
  changestate(0);
}

function deleteCookie(name, path, domain) {
  // If the cookie exists
  if (getCookie(name))
    createCookie(name, "", -1, path, domain);
}
function setCookie(name, value, expires, path, domain) {
  var cookie = name + "=" + escape(value) + ";";

  if (expires) {
    // If it's a date
    if(expires instanceof Date) {
      // If it isn't a valid date
      if (isNaN(expires.getTime()))
       expires = new Date();
    }
    else
      expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

    cookie += "expires=" + expires.toGMTString() + ";";
  }

  if (path)
    cookie += "path=" + path + ";";
  if (domain)
    cookie += "domain=" + domain + ";";

  document.cookie = cookie;
}

function getCookie(name) {
  var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
  var result = regexp.exec(document.cookie);
  return (result === null) ? null : result[1];
}

function gohome(){
  changestate(1);
  menuclick();
  editor.session.setValue("");
}
function error(msg){
  if(msg!=""&&msg!="OK"){
    document.getElementById("errormsg").innerHTML=msg;
    changestate(4);
  }
}
var ftmap={
  "js":"javascript",
  "html":"html",
  "php":"php",
  "css":"css",
  "txt":"text",
  "json":"json",
  "bas":"basic",
  "md":"markdown"
}
var repo="";
var url;
var file="";
var sha="";
var user;
var token;




function savefile(){
   var code=editor.getValue();
   var msg=btoa(code);
   var data={"path":file,"message":"Updated From quark editor.","content":msg,"sha":sha};
   var url="https://api.github.com/repos/"+user+"/"+repo+"/contents/"+file+"?access_token="+token;

   filesave.open("PUT",url,true);
   filesave.send(JSON.stringify(data));

}
var filesave=new XMLHttpRequest();
filesave.onreadystatechange=function(){
 if(this.readyState==4&&this.status==200){
   document.getElementById("savebtn").innerHTML="Saved";
   setTimeout(function(){document.getElementById("savebtn").innerHTML="Save File";},3000);
   loadfile(file);
 }else{
   error(this.statusText);
 }
};


function loadfile(file){
  var ext=file.substr(file.indexOf(".")+1);
  if(ext in ftmap){
    url="https://api.github.com/repos/"+user+"/"+repo+"/contents/"+file;
    editor.session.setMode("ace/mode/"+ftmap[ext]);
    gitfile.open("GET",url,true);
    gitfile.send();
  }else{
    window.open("https://github.com/"+user+"/"+repo+"/blob/master/"+file, '_blank');
  }
}
var gitfile=new XMLHttpRequest();

gitfile.onreadystatechange=function(){
 if(this.readyState==4&&this.status==200){
   var filetxt=JSON.parse(this.responseText);
   editor.session.setValue(atob(filetxt["content"]));
   sha=filetxt["sha"];
   file=filetxt["name"];
 }else{
    error(this.statusText);
 }
};
var gituser=new XMLHttpRequest();

var repos;
gituser.onreadystatechange=function(){
 if(this.readyState==4&&this.status==200){
   repos=JSON.parse(this.responseText);
   init();
 }else{
  error(this.statusText);
 }
};


//Editor vars
var repo;
var file;

function init(){
  var home=document.getElementById("home");
  home.innerHTML="";
  for(var i=0;i<repos.length;i++){
    home.innerHTML+="<div onclick='gitload(&quot;"+repos[i]["name"]+"&quot;);' class='gitcont'><u><h2>"+repos[i]["name"]+"</h2></u><p>"+repos[i]["description"]+"</p></div>"
  }
}


function gitload(name){
  repo=name;
  document.getElementById("repotitle").innerHTML=repo;
  url="https://api.github.com/repos/"+user+"/"+repo+"/contents/?access_token="+token;
  document.getElementById("viewproject").href="https://"+user+".github.io/"+repo;
  document.getElementById("viewgithub").href="https://github.com/"+user+"/"+repo;
  gitrepo.open("GET",url,true);
  gitrepo.send();
}

  var gitrepo=new XMLHttpRequest();

  gitrepo.onreadystatechange=function(){
   if(this.readyState==4&&this.status==200){
     var files=JSON.parse(this.responseText);
     document.getElementById("repotitle").innerHTML=repo;
     document.getElementById("sidebar").innerHTML="";
      document.getElementById("mobilefile").innerHTML="";
     for(var i=0;i<files.length;i++){
       document.getElementById("sidebar").innerHTML+="<p onclick='loadfile(&quot;"+files[i]["name"]+"&quot);' class='file'>&gt;"+files[i]["name"]+"</p><br>";
       document.getElementById("mobilefile").innerHTML+="<p onclick='loadfile(&quot;"+files[i]["name"]+"&quot);' class='file'>&gt;"+files[i]["name"]+"</p><br>";
     }
     editor.session.setValue("");
     changestate(2)
   }else{
     error(this.statusText);
   }
  };
