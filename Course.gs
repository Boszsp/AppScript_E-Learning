const COURSES_DB = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1X7icSwOM81sL0XWLBa-DdqztEIB5L9Q8aaLJCR_Todw/")
let COURSES_DB_NAME = "courses"
const COURSES = COURSES_DB.getSheetByName(COURSES_DB_NAME).getRange(
  2,
  1,
  COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastRow() - 1 > 0 ? COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastRow() - 1 : 1,
  COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastColumn() > 0 ? COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastColumn() : 1)

const COURSE_ID_INDEX = 0
const COURSE_NAME_INDEX = 1
const COURSE_DESC_INDEX = 2
const COURSE_ENROLLKEY_INDEX = 3
const COURSE_SETTING_INDEX = 4
const COURSE_CREATEDATE_INDEX = 5
const COURSE_EXPIREDATE_INDEX = 6



function genCourseId() {
  return String(Date.now()) + ((Math.round(Math.random() * 10000)).toString(16)) + ((Math.round(Math.random() * 10000)).toString(16))
}

function getCoursesNum(){
  return COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastRow()
}

function getAllCouses(offset, limit) {
  if(COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastRow() == 1){
    return []
  }
  if (offset && limit && parseInt(offset) && parseInt(limit)) {
    offset = parseInt(offset)
    limit = parseInt(limit)
    return COURSES.getValues().slice((offset - 1) * limit, offset * limit)
  }
  return COURSES.getValues()

}

function getCouse(rid) {
  return COURSES_DB.getSheetByName(COURSES_DB_NAME).getRange(rid, 1, 1, COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastColumn() > 0 ? COURSES_DB.getSheetByName(COURSES_DB_NAME).getLastColumn() : 1).getValues()[0]

}

function createCourse({token,name, desc, enrollKey, setting, expire}) {
  const createCourseDB = COURSES_DB.getSheetByName(COURSES_DB_NAME)
  const tableRow = createCourseDB.getLastRow() > 1 ? createCourseDB.getLastRow() + 1 : 2
  const courseId = genCourseId()
  createCourseDB.getRange(tableRow, COURSE_ID_INDEX + 1).setValue(courseId)
  createCourseDB.getRange(tableRow, COURSE_NAME_INDEX + 1).setValue(String(name))
  createCourseDB.getRange(tableRow, COURSE_DESC_INDEX + 1).setValue(desc)
  createCourseDB.getRange(tableRow, COURSE_ENROLLKEY_INDEX + 1).setValue(enrollKey)
  createCourseDB.getRange(tableRow, COURSE_SETTING_INDEX + 1).setValue(JSON.stringify(setting ?? {}))
  createCourseDB.getRange(tableRow, COURSE_CREATEDATE_INDEX + 1).setValue(new Date(Date.now()))
  createCourseDB.getRange(tableRow, COURSE_EXPIREDATE_INDEX + 1).setValue(expire ?? "")
  const courseQuizz = COURSES_DB.insertSheet(courseId + "_quizz")
  courseQuizz.appendRow(["quizzId", "quizz_name", "quizz_desc", "quizz_rank", "quizz_score", "quizz", "quizz_createdate", "quizz_expire", "quizz_setting", "g_form_link"])
  const courseProblem = COURSES_DB.insertSheet(courseId + "_problem")
  courseProblem.appendRow(["problemId", "problem_name", "problem_desc", "problem_rank", "problem_score", "sample_testcase", "problem_createdate", "problem_expire", "problem_setting", "testcase"])
  const courseSubmissionPb = COURSES_DB.insertSheet(courseId + "_submission_problem")
  courseSubmissionPb.appendRow(["submiss_id", "u_id", "submission_code", "status", "problem_id"])
  const courseSubmissionQ = COURSES_DB.insertSheet(courseId + "_submission_quizz")
  courseSubmissionQ.appendRow(["submiss_id", "u_id", "quiz_score", "status", "quiz_id"])
  const courseLesson = COURSES_DB.insertSheet(courseId + "_lesson")
  courseLesson.appendRow(["lesson_id", "lesson_title", "lesson_desc"])

  return { status: "success", mss: "course created" }
}


function deleteCourse({token,rid,courseId}){
  const courseDB = COURSES_DB.getSheetByName(COURSES_DB_NAME)
  //const tableColNum = courseDB.getLastColumn()
  try{
  if(courseId === courseDB.getRange(rid,COURSE_ID_INDEX+1).getValue()){
    COURSES_DB.getSheetByName(courseId+"_lesson")?.deleteSheet()
    COURSES_DB.getSheetByName(courseId+"_problem")?.deleteSheet()
    COURSES_DB.getSheetByName(courseId+"_quizz")?.deleteSheet()
    COURSES_DB.getSheetByName(courseId+"_submission_problem")?.deleteSheet()
    COURSES_DB.getSheetByName(courseId+"_submission_quizz")?.deleteSheet()
    courseDB.deleteRow(rid)
    return {"status":"success","mss":"course deleted"}
  }
  return {"status":"error","mss":"wrong course id"}
  }catch(err){
    return {"status":"error","mss":err}
  }

}


function editCourse({token,rid,courseId,name,desc,enrollKey}){
  const courseDB = COURSES_DB.getSheetByName(COURSES_DB_NAME)
  try{
  if(courseId == courseDB.getRange(rid,COURSE_ID_INDEX+1).getValue()){
    courseDB.getRange(rid,COURSE_ENROLLKEY_INDEX+1).setValue(enrollKey)
    courseDB.getRange(rid,COURSE_NAME_INDEX+1).setValue(name)
    courseDB.getRange(rid,COURSE_DESC_INDEX+1).setValue(desc)
    return {"status":"success","mss":"course edited"}
  }
  return {"status":"error","mss":"wrong course id"}
  }catch(err){
    return {"status":"error","mss":err}
  }

}


function testCourse() {
  console.log(getAllCouses())
}
