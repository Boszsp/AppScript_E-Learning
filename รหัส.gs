//URL : https://script.google.com/macros/s/AKfycbxTbpPoobh3Pwshlkor5GsknOq7YtsBb3kbvoOoeKg2/dev

let PEV_ID

function renderJSONContent(json) {
  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON)
}

function doGet(e) {
  const service = e.pathInfo;
  if (service && service == "api/session") {
    const token = e.parameter.token;
    if (token && token != "")
      return renderJSONContent(getSession(token))
    return renderJSONContent({ "Error": "Require Token" })
  }
  else if (service && service == "api/login") {
    const username = e.parameter.username;
    const password = e.parameter.password;
    if (username && password && password != "" && username != "") return renderJSONContent(login(username, password))
    return renderJSONContent({ "Error": "Require Username & Password" })
  }

  else if (service && service == "api/regis") {
    const username = e.parameter.username;
    const password = e.parameter.password;
    const name = e.parameter.name;
    const lastname = e.parameter.lastname;
    const role = e.parameter.role ?? "student";

    if (username && password && name && lastname && role && password != "" && username != "") return renderJSONContent(regis(username, password, name, lastname, role))
    return renderJSONContent({ "Error": "Require Username & Password" })
  }

  else if (service && service == "api/users") {
    return renderJSONContent(getAllUsers())
  }

  else if (service && service == "api/courses") {
    return getAllCouses(e.parameter.offset, e.parameter.limit)
  }

  else if (service && service == "api") {
    return ContentService.createTextOutput("404 Not Found " + service)
  }
  try {
    if(service && service.startsWith("course/")){
    PEV_ID = service.split("course/")[1]
     if(service.endsWith("/lessons")){
      PEV_ID = PEV_ID.split("/lessons")[0]
      return HtmlService.createTemplateFromFile("lessons").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setSandboxMode(HtmlService.SandboxMode.EMULATED).setTitle(service).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
     }else if(service.endsWith("/quizs")){
      PEV_ID = PEV_ID.split("/quizs")[0]
      return HtmlService.createTemplateFromFile("quizs").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setSandboxMode(HtmlService.SandboxMode.EMULATED).setTitle(service).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
     }
    return HtmlService.createTemplateFromFile("course").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setSandboxMode(HtmlService.SandboxMode.EMULATED).setTitle(service ?? "home").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    }
    return HtmlService.createTemplateFromFile(service ?? "home").evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setSandboxMode(HtmlService.SandboxMode.EMULATED).setTitle(service ?? "home").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  } catch (err) {
    return ContentService.createTextOutput(err)
  }

}


function doPost(e) {
  const service = e.pathInfo;

  return ContentService.createTextOutput("404 Not Found " + service)
}


function getURL() {
  return ScriptApp.getService().getUrl()
}



function include(fileName) {
  return HtmlService.createTemplateFromFile(fileName).evaluate().getContent()

}
