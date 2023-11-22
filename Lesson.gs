const LESSONS_DB = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1X7icSwOM81sL0XWLBa-DdqztEIB5L9Q8aaLJCR_Todw/")
let LESSON_DB_NAME = "_lesson"
const LESSON_ID_INDEX = 0
const LESSON_TITLE_INDEX = 1
const LESSON_DESC_INDEX = 2
const LESSON_DATE_INDEX = 3


function genLessonId() {
  return String(Date.now()) + ((Math.round(Math.random() * 10)).toString(16)) 
}

function getAllLessons(courseId) {
  try{
  const lessonDb = LESSONS_DB.getSheetByName(courseId+LESSON_DB_NAME)
  if(lessonDb.getLastRow() <= 1 ){
    return []
  }
  return lessonDb.getRange(
    2,
    1,
    lessonDb.getLastRow()-1,
    lessonDb.getLastColumn() > 0 ? lessonDb.getLastColumn() : 1 
  ).getValues()
  }catch(err){
    return []
  }
}


function createLesson({token,courseId,title,desc}){
  try{
  const lessonDb = LESSONS_DB.getSheetByName(courseId+LESSON_DB_NAME)
  const tableRow = lessonDb?.getLastRow() > 1 ? lessonDb?.getLastRow() + 1 : 2
  lessonDb.getRange(tableRow,LESSON_ID_INDEX+1).setValue(genLessonId())
  lessonDb.getRange(tableRow,LESSON_TITLE_INDEX+1).setValue(title)
  lessonDb.getRange(tableRow,LESSON_DESC_INDEX+1).setValue(desc.trim())
  lessonDb.getRange(tableRow,LESSON_DATE_INDEX+1).setValue(new Date(Date.now()))

  return {status:"success",mss:"created lesson pls refresh this page"}
  }catch(err){
    return {status:"error",mss:JSON.stringify(err)}
  }
}

function deleteLesson({token,courseId,lid,rid}){
  try{
  const lessonDb = LESSONS_DB.getSheetByName(courseId+LESSON_DB_NAME)
  if(lessonDb.getRange( rid,LESSON_ID_INDEX+1).getValue() != lid)return {status:"error",mss:"wrong lesson id"}
  lessonDb.deleteRow(rid)
  return {status:"success",mss:"deleted lesson  pls refresh this page"}
  }catch(err){
    return {status:"error",mss:JSON.stringify(err)}
  }
}

function editLesson({token,courseId,title,desc,lid,rid}){
  try{
  const lessonDb = LESSONS_DB.getSheetByName(courseId+LESSON_DB_NAME)
  if(lessonDb.getRange( rid,LESSON_ID_INDEX+1).getValue() != lid)return {status:"error",mss:"wrong lesson id"}
  lessonDb.getRange( rid,LESSON_TITLE_INDEX+1).setValue(title)
  lessonDb.getRange( rid,LESSON_DESC_INDEX+1).setValue(desc.trim())
  return {status:"success",mss:"edited lesson pls refresh this page"}
  }catch(err){
    return {status:"error",mss:JSON.stringify(err)}
  }
}

function testL(){
  //console.log(getAllLessons("1700586824977955822"))
  //console.log(createLesson({courseId:"1700586824977955822",title:"Lesson1",desc:"<p>Hello</p>"}))
  console.log(deleteLesson({courseId:"1700586824977955822",lid:"17005893908977",rid:"3"}))
}
