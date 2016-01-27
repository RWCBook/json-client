/*******************************************************
 * json-client HTML/SPA client engine
 * June 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Ornette Coleman Six Classic Albums (2012)
 *******************************************************/

/*  
  NOTE:
  - has fatal dependency on dom-help.js
  - uses no external libs/frameworks
  - built/tested for chrome browser (YMMV on other browsers)

  ISSUES:
  - memorized the serialized msg for "task" and "user" object array & selected fields
  - memorized all 18 documented actions and associated args, HTTP details
  - will ignore non-breaking changes from server (new actions, objects, fields)
  - may crash on breaking changes from server (changed actions, objects, fields)
*/

function json() {

  /********************************
   DELCARATIONS
  ********************************/ 
  var d = domHelp();  
  var g = {};
  
  g.url = '';
  g.msg = null;
  g.title = "JSON Client";
  g.atype = "application/json";
  g.ctype = "application/json";
  g.object = "";
  
  // control objects
  g.fields = {};
  g.actions = {};
  g.content = {};

  /********************************
    HOME CONTROLS
  ********************************/
  // home controls
  g.fields.home = [];
  
  // home object content
  g.content.home = "";
  g.content.home =  '<div class="ui segment">';
  g.content.home += '  <h3>Welcome to TPS at BigCo!</h3>';
  g.content.home += '  <p><b>Select one of the actions above</b></p>';
  g.content.home += '</div>';

  // home actions
  g.actions.home = {
    home:       {target:"app", func:httpGet, href:"/home/", prompt:"Home"}, 
    tasks:      {target:"app", func:httpGet, href:"/task/", prompt:"Tasks"}, 
    users:      {target:"app", func:httpGet, href:"/user/", prompt:"Users"}  
  };

  /********************************
    TASK CONTROLS
  ********************************/
  // task fields 
  g.fields.task = ["id","title","completeFlag","assignedUser"];
  
  // task object content
  g.content.task = "";
  g.content.task += '<div class="ui segment">';
  g.content.task += '  <h3>Manage your TPS Tasks here.</h3>';
  g.content.task += '  <p>You can do the following:</p>';
  g.content.task += '  <ul>';
  g.content.task += '    <li>Add, Edit and Delete tasks</li>';
  g.content.task += '    <li>Mark tasks "complete", assign tasks to a user</li>';
  g.content.task += '    <li>Filter the list by Title, Assigned User, and Completed Status</li>';
  g.content.task += '  </ul>';
  g.content.task += '</div>';

  // task object actions
  g.actions.task = {
    home:       {target:"app", func:httpGet, href:"/home/", prompt:"Home"}, 
    tasks:      {target:"app", func:httpGet, href:"/task/", prompt:"Tasks"}, 
    users:      {target:"app", func:httpGet, href:"/user/", prompt:"Users"},  
    active:     {target:"list", func:httpGet, href:"/task/?completeFlag=false", prompt:"Active Tasks"}, 
    closed:     {target:"list", func:httpGet, href:"/task/?completeFlag=true", prompt:"Completed Tasks"}, 
    byTitle:    {target:"list", func:jsonForm, href:"/task", prompt:"By Title", method:"GET",
                  args:{
                    title: {value:"", prompt:"Title", required:true}
                  }
                }, 
    byUser:     {target:"list", func:jsonForm, href:"/task", prompt:"By User", method:"GET",
                  args:{
                    assignedUser: {value:"", prompt:"Assigned User", required:true}
                  }
                }, 
    add:        {target:"list", func:jsonForm, href:"/task/", prompt:"Add Task", method:"POST",
                  args:{
                    title: {value:"", prompt:"Title", required:true},
                    completeFlag: {value:"", prompt:"completeFlag"}
                  }
                },
    item:       {target:"item", func:httpGet, href:"/task/{id}", prompt:"Item"},
    edit:       {target:"single", func:jsonForm, href:"/task/{id}", prompt:"Edit", method:"PUT",
                  args:{
                    id: {value:"{id}", prompt:"Id", readOnly:true},
                    title: {value:"{title}", prompt:"Title", required:true},
                    completeFlag: {value:"{completeFlag}", prompt:"completeFlag"}
                  }
                },
    delete:     {target:"single", func:httpDelete, href:"/task/{id}", prompt:"Delete", method:"DELETE", args:{}},
    assign:     {target:"single", func:jsonForm, href:"/task/assign/{id}", prompt:"Assign User", method:"POST",
                  args:{
                    id: {value:"{id}", prompt:"Id", readOnly:true},
                    assignedUser: {value:"{assignedUser}", prompt:"Assigned User", required:true}
                  }
                },    
    completed:  {target:"single", func:jsonForm, href:"/task/completed/{id}", prompt:"Mark Complete", method:"POST"},
  };

  /********************************
    USER CONTROLS
  ********************************/
  // user fields
  g.fields.user = ["nick","name","password"];

  // user object content
  g.content.user = "";
  g.content.user += '<div class="ui segment">';
  g.content.user += '  <h3>Manage your TPS Users here.</h3>';
  g.content.user += '  <p>You can do the following:</p>';
  g.content.user += '  <ul>';
  g.content.user += '    <li>Add and Edit users</li>';
  g.content.user += '    <li>Change the password, view the tasks assigned to a user</li>';
  g.content.user += '    <li>Filter the list by Nickname or FullName</li>';
  g.content.user += '  </ul>';
  g.content.user += '</div>';
  
  // user object actions
  g.actions.user = {
    home:       {target:"app", func:httpGet, href:"/home/", prompt:"Home"}, 
    tasks:      {target:"app", func:httpGet, href:"/task/", prompt:"Tasks"}, 
    users:      {target:"app", func:httpGet, href:"/user/", prompt:"Users"},  
    byNick:     {target:"list", func:jsonForm, href:"/user", prompt:"By Nickname", method:"GET",
                  args:{
                    nick: {value:"", prompt:"Nickname", required:true}
                  }
                }, 
    byName:     {target:"list", func:jsonForm, href:"/user", prompt:"By Name", method:"GET",
                  args:{
                    name: {value:"", prompt:"Name", required:true}
                  }
                }, 
    add:        {target:"list", func:jsonForm, href:"/user/", prompt:"Add User", method:"POST",
                  args:{
                    nick: {value:"", prompt:"Nickname", required:true, pattern:"[a-zA-Z0-9]+"},
                    password: {value:"", prompt:"Password", required:true, pattern:"[a-zA-Z0-9!@#$%^&*-]+"},
                    name: {value:"", prompt:"Full Name", required:true},
                  }
                },
    item:       {target:"item", func:httpGet, href:"/user/{id}", prompt:"Item"},
    edit:       {target:"single", func:jsonForm, href:"/user/{id}", prompt:"Edit", method:"PUT",
                  args:{
                    nick: {value:"{nick}", prompt:"Nickname", readOnly:true},
                    name: {value:"{name}", prompt:"Full Name",required:true}
                  }
                },
    changepw:   {target:"single", func:jsonForm, href:"/task/pass/{id}", prompt:"Change Password", method:"POST",
                  args:{
                    nick: {value:"{nick}", prompt:"NickName", readOnly:true},
                    oldPass: {value:"", prompt:"Old Password", required:true, pattern:"[a-zA-Z0-9!@#$%^&*-]+"},
                    newPass: {value:"", prompt:"New Password", required:true, pattern:"[a-zA-Z0-9!@#$%^&*-]+"},
                    checkPass: {value:"", prompt:"Confirm New", required:true, pattern:"[a-zA-Z0-9!@#$%^&*-]+"},
                  }
                },    
    assigned:   {target:"single", func:httpGet, href:"/task/?assignedUser={id}", prompt:"Assigned Tasks"}
  };
  

  /********************************
    MAIN CODE
  ********************************/
  // init library and start
  function init(url, title) {
    if(!url || url==='') {
      alert('*** ERROR:\n\nMUST pass starting URL to the library');
    }
    else {
      g.title = title||"JSON Client";
      g.url = url;
      req(g.url,"get");
    }
  }

  // process loop
  function parseMsg() {
    dump();
    title();
    setObject();
    toplinks();
    content();
    items();
    actions();
    clearForm();
  }

  // set response object pointer
  function setObject() {
    if(g.msg.task) {g.object = "task";}
    if(g.msg.user) {g.object = "user";}
    if(g.msg.home) {g.object = "home";}    
  }
  
  // handle response dump
  function dump() {
    var elm = d.find("dump");
    elm.innerText = JSON.stringify(g.msg, null, 2);
  }
  
  // handle title
  function title() {
    var elm;
    
    elm = d.find("title");
    elm.innerText = g.title;
    
    elm = d.tags("title");
    elm[0].innerText = g.title;
  }
  
  // emit links for all views
  function toplinks() {
    var act, actions;   
    var elm, coll;
    var ul, li, a;

    elm = d.find("toplinks");
    d.clear(elm);
    ul = d.node("ul");
    
    actions = g.actions[g.object];
    for(var act in actions) {
      link = actions[act]
      if(link.target==="app") {
        li = d.node("li");
        a = d.anchor({
          href:link.href,
          rel:(link.rel||"collection"),
          className:"action",
          text:link.prompt
        });
        a.onclick = link.func;
        d.push(a,li);
        d.push(li, ul);
      }
    }
    d.push(ul,elm);    
  }
  
  // emit any static content
  function content() {
    var elm;
    
    elm = d.find("content");
    elm.innerHTML = g.content[g.object];
  }
  
  // handle item collection
  function items() {
    var msg, flds;
    var elm, coll, link;
    var ul, li, dl, dt, dd, p;

    elm = d.find("items");
    d.clear(elm);
    
    msg = g.msg[g.object];
    flds = g.fields[g.object];
    
    // handle returned objects
    if(msg) {
      coll = msg;
      ul = d.node("ul");

      for(var item of coll) {
        li = d.node("li");
        dl = d.node("dl");
        dt = d.node("dt");
        
        // emit item-level actions
        dt = itemActions(dt, item, (coll.length===1));

        // emit the data elements
        dd = d.node("dd");
        for(var f of flds) {
          p = d.data({className:"item "+f, text:f, value:item[f]+"&nbsp;"});
          d.push(p,dd);
        }
        
        d.push(dt,dl);        
        d.push(dd,dl);
        d.push(dl,li);
        d.push(li,ul);
      }
      d.push(ul,elm);
    }
  }
  
  // handle item-level actions
  function itemActions(dt, item, single) {
    var act, actions, link, a;
    
    actions = g.actions[g.object];
    for(act in actions) {
      link = actions[act];
      if(link.target==="item") {
        a = d.anchor({
          href:link.href.replace(/{id}/g,item.id),
          rel:(link.rel||"item"),
          className:"item action",
          text:link.prompt
        });
        a.onclick = link.func
        a.setAttribute("method",(link.method||"GET"));
        a.setAttribute("args",(link.args?JSON.stringify(link.args):"{}"));
        d.push(a,dt);
      }
    }
    
    // only when showing single record
    if(single===true) {
      for(act in actions) {
        link = actions[act];
        if(link.target==="single") {
          a = d.anchor({
            href:link.href.replace(/{id}/g,item.id),
            rel:(link.rel||"item"),
            className:"item action",
            text:link.prompt
          });
          a.onclick = link.func
          a.setAttribute("method",(link.method||""));
          a.setAttribute("args",(link.args?JSON.stringify(link.args):"{}"));
          d.push(a,dt);
        }
      }
    }
    return dt;  
  }
  
  // handle list-level actions
  function actions() {
    var actions;   
    var elm, coll;
    var ul, li, a;

    elm = d.find("actions");
    d.clear(elm);
    ul = d.node("ul");
    
    actions = g.actions[g.object];
    for(var act in actions) {
      link = actions[act];
      if(link.target==="list") {
        li = d.node("li");
        a = d.anchor({
          href:link.href,
          rel:"collection",
          className:"action",
          text:link.prompt
        });
        a.onclick = link.func;
        a.setAttribute("method",(link.method||"GET"));
        a.setAttribute("args",(link.args?JSON.stringify(link.args):"{}"));
        d.push(a,li);
        d.push(li, ul);
      }
    }
    d.push(ul, elm);      
  }
  
  /********************************
   JSON-CLIENT HELPERS
  ********************************/
  // function clear out any form
  function clearForm() {
    var elm;
    
    elm = d.find("form");
    d.clear(elm);
  }
  
  // generate a form for user input
  function jsonForm(e) {
    var msg;
    var elm, coll, link, val;
    var form, lg, fs, p, inp;
     
    msg = g.msg[g.object];
    
    elm = d.find("form");
    d.clear(elm);
    link = e.target;
    
    form = d.node("form");
    form.action = link.href;
    form.className = link.rel;
    switch(link.getAttribute("method")) {
      case "POST":
        form.onsubmit = httpPost;
        break;
      case "PUT":
        form.onsubmit = httpPut;
        break;
      case "GET":
      default:
        form.onsubmit = httpQuery;
        break;
    }    
    fs = d.node("fieldset");
    lg = d.node("legend");
    lg.innerHTML = link.title||"Form";
    d.push(lg, fs);

    coll = JSON.parse(link.getAttribute("args"));
    for(var prop in coll) {
      val = coll[prop].value;
      if(msg[0][prop]) {
        val = val.replace("{"+prop+"}",msg[0][prop]);
      } 
      p = d.input({
        prompt:coll[prop].prompt,
        name:prop,
        value:val, 
        required:coll[prop].required,
        readOnly:coll[prop].readOnly,
        pattern:coll[prop].pattern
      });
      d.push(p,fs);
    }
    
    p = d.node("p");
    inp = d.node("input");
    inp.type = "submit";
    d.push(inp,p);

    inp = d.node("input");
    inp.type = "button";
    inp.value = "Cancel";
    inp.onclick = function(){elm = d.find("form");d.clear(elm);}
    d.push(inp,p);

    d.push(p,fs);            
    d.push(fs,form);
    d.push(form, elm);
    
    return false;
  }
  
  /********************************
   AJAX HELPERS
  ********************************/  
  // mid-level HTTP handlers
  function httpGet(e) {
    req(e.target.href, "get", null);
    return false;
  }

  function httpQuery(e) {
    var form, coll, query, i, x, q;

    q=0;
    form = e.target;
    query = form.action+"/?";
    nodes = d.tags("input", form);
    for(i=0, x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        if(q++!==0) {
          query += "&";
        }
        query += nodes[i].name+"="+escape(nodes[i].value);
      }
    }
    req(query,"get",null);
    return false;
  }

  function httpPost(e) {
    var form, nodes, data;

    data = {};
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data[nodes[i].name]=nodes[i].value+"";
      }
    }
    req(form.action,'post',JSON.stringify(data));
    return false;
  }

  function httpPut(e) {
    var form, nodes, data;

    data = {};
    form = e.target;
    nodes = d.tags("input",form);
    for(i=0,x=nodes.length;i<x;i++) {
      if(nodes[i].name && nodes[i].name!=='') {
        data[nodes[i].name]=nodes[i].value+"";
      }
    }
    req(form.action,'put',JSON.stringify(data));
    return false;
  }

  function httpDelete(e) {
    if(confirm("Ready to delete?")===true) {
      req(e.target.href, "delete", null);
    }
    return false;
  }

  // low-level HTTP stuff
  function req(url, method, body) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){rsp(ajax)};
    ajax.open(method, url);
    ajax.setRequestHeader("accept",g.atype);
    if(body && body!==null) {
      ajax.setRequestHeader("content-type", g.ctype);
    }
    ajax.send(body);
  }

  function rsp(ajax) {
    if(ajax.readyState===4) {
      g.msg = JSON.parse(ajax.responseText);
      parseMsg();
    }
  }

  /********************************
    EXPORT FUNCTIONS
  *********************************/
  var that = {};
  that.init = init;
  return that;
}

// *** EOD ***
