const USERS_DB = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1X7icSwOM81sL0XWLBa-DdqztEIB5L9Q8aaLJCR_Todw/")
const USERS_DB_NAME = "users"
const USERS = USERS_DB.getSheetByName(USERS_DB_NAME).getRange(2, 1, USERS_DB.getSheetByName(USERS_DB_NAME).getLastRow() - 1 > 0 ? USERS_DB.getSheetByName(USERS_DB_NAME).getLastRow() - 1 : 1, USERS_DB.getSheetByName(USERS_DB_NAME).getLastColumn() > 0 ? USERS_DB.getSheetByName(USERS_DB_NAME).getLastColumn() : 1)

// Count Follow Array Index Rule
const UER_UID_INDEX = 0
const UER_UNAME_INDEX = 1
const UER_PASSWORD_INDEX = 2
const UER_ROLE_INDEX = 3
const UER_NAME_INDEX = 4
const UER_LASTNAME_INDEX = 5
const UER_COURSEIDS_INDEX = 6
const UER_SUBMISSION_PROBLEM_INDEX = 7
const UER_SUBMISSION_QUIZZ_INDEX = 8
const UER_SCORE_INDEX = 9
const UER_TOKEN_INDEX = 10



function getAllUsers() {
  return USERS.getValues()
}

function genUId() {
  return String(Date.now()) + ((Math.round(Math.random() * 10000)).toString(16)) + ((Math.round(Math.random() * 10000)).toString(16))
}

function login(username, password) {
  const allUsers = getAllUsers()
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i][UER_UNAME_INDEX] == username) {
      if (allUsers[i][UER_PASSWORD_INDEX] == password) {
        const TOKEN = ScriptApp.getOAuthToken()
        USERS_DB.getSheetByName(USERS_DB_NAME).getRange(i + 2, UER_TOKEN_INDEX + 1).setValue(TOKEN)
        CacheService.getScriptCache().put(TOKEN, JSON.stringify({ "rowIndex": i + 2,"rId": i + 2, "uid": allUsers[i][UER_UID_INDEX], "username": allUsers[i][UER_UNAME_INDEX], "lastname": allUsers[i][UER_LASTNAME_INDEX], "role": allUsers[i][UER_ROLE_INDEX] }), 86400)
        return { "status": "success", "token": TOKEN }
      }
      return { "status": "error", "error": "password", "mss": "password " + password + " is incorrect" }
    }
  }
  return { "status": "error", "error": "username", "mss": "user " + username + " not found" }
}

function regis(username, password, name, lastname, role) {
  if (login(username, password).error != "user") {
    return { "status": "error", "error": "username", "mss": "haved username" }
  }
  const regisDB = USERS_DB.getSheetByName(USERS_DB_NAME)
  const tableRow = regisDB.getLastRow() > 1 ? regisDB.getLastRow() + 1 : 2
  regisDB.getRange(tableRow, UER_UID_INDEX + 1).setValue(genUId())
  regisDB.getRange(tableRow, UER_UNAME_INDEX + 1).setValue(username)
  regisDB.getRange(tableRow, UER_PASSWORD_INDEX + 1).setValue(password)
  regisDB.getRange(tableRow, UER_ROLE_INDEX + 1).setValue(role == "teacher" ? "teacher" : "student")
  regisDB.getRange(tableRow, UER_NAME_INDEX + 1).setValue(name)
  regisDB.getRange(tableRow, UER_LASTNAME_INDEX + 1).setValue(lastname)
  regisDB.getRange(tableRow, UER_COURSEIDS_INDEX + 1).setValue("[]")
  regisDB.getRange(tableRow, UER_SUBMISSIONIDS_INDEX + 1).setValue("[]")
  regisDB.getRange(tableRow, UER_SUBMISSION_QUIZZ_INDEX + 1).setValue("[]")
  regisDB.getRange(tableRow, UER_SCORE_INDEX + 1).setValue("{}")
  return { "status": "success", "mss": "user created" }
}

function getSession(token) {
  const session = JSON.parse(CacheService.getScriptCache().get(token))
  if (session && session.uid) {
    const pevUser = USERS_DB.getSheetByName(USERS_DB_NAME)
    const courses = pevUser.getRange(parseInt(session.rowIndex), UER_COURSEIDS_INDEX + 1 ).getValue()
    const submission_problem = pevUser.getRange(parseInt(session.rowIndex), UER_SUBMISSION_PROBLEM_INDEX + 1).getValue()
    const submission_quizz = pevUser.getRange(parseInt(session.rowIndex), UER_SUBMISSION_QUIZZ_INDEX + 1).getValue()
    const score = pevUser.getRange(parseInt(session.rowIndex), UER_SCORE_INDEX + 1).getValue()
    session["courses"] = JSON.parse(courses)
    session["submission_problem"] = JSON.parse(submission_problem)
    session["submission_quizz"] = JSON.parse(submission_quizz)
    session["score"] = JSON.parse(score)
    return session
  }
  return undefined
}

function enroll(courseId,courseRId,token,enrollKey){
  const session = getSession(token)
  const courseEnrollKey = USERS_DB.getSheetByName("courses").getRange(courseRId,4).getValue();
  console.log(courseEnrollKey,enrollKey)
  if(courseEnrollKey==enrollKey){
  const userDB = USERS_DB.getSheetByName(USERS_DB_NAME).getRange(session.rowIndex,UER_COURSEIDS_INDEX+1)
  //const oldVal = JSON.stringify(courseDB.getValue())
  userDB.setValue(JSON.stringify([...new Set([...session.courses,courseId])]))
  return {status:"success",mss:"enroll success pls refresh this page"}
  }
  return {status:"error",mss:"wrong enrollKey"}
}


function testA() {
  console.log(genUId())
}
