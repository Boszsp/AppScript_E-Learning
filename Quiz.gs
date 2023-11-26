const QUIZS_DB = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1X7icSwOM81sL0XWLBa-DdqztEIB5L9Q8aaLJCR_Todw/")
let QUIZ_DB_NAME = "_quizz"
const QUIZ_ID_INDEX = 0
const QUIZ_TITLE_INDEX = 1
const QUIZ_DESC_INDEX = 2
const QUIZ_RANK_INDEX = 3
const QUIZ_QUIZS_INDEX = 5
const QUIZ_DATE_INDEX = 6
const QUIZ_EXPIRE_INDEX = 7
const QUIZ_SETTING_INDEX = 8
const QUIZ_EXTERNAL_INDEX = 9


function getAllQuizs(courseId) {
  try{
  const quizDb = QUIZS_DB.getSheetByName(courseId+QUIZ_DB_NAME)
  if(quizDb.getLastRow() <= 1 ){
    return []
  }
  return quizDb.getRange(
    2,
    1,
    quizDb.getLastRow()-1,
    quizDb.getLastColumn() > 0 ? quizDb.getLastColumn() : 1 
  ).getValues()
  }catch(err){
    return []
  }
}

function getQuiz({courseId,quizRId,quizzId}){
  try{
  const quizDb = QUIZS_DB.getSheetByName(courseId+QUIZ_DB_NAME)
  if(quizDb.getLastRow() <= 1 || quizRId < 2){
    return []
  }
  const quiz = quizDb.getRange(
    quizRId,
    1,
    1,
    quizDb.getLastColumn() > 0 ? quizDb.getLastColumn() : 1 
  ).getValues()[0]
  //filter ans
  quiz[QUIZ_QUIZS_INDEX] = JSON.parse(quiz[QUIZ_QUIZS_INDEX]).map(
    (quizz)=>{
      if(quizz.values){
        quizz.values = quizz.values.map(
          (q)=>{q.selected = false;return q}
        )
      }
      else if(quizz.value){
        quizz.value = "";
      }
      return quizz
    }
  )
  quiz[QUIZ_QUIZS_INDEX] = JSON.stringify(quiz[QUIZ_QUIZS_INDEX])
  if(quiz[QUIZ_ID_INDEX]+"" === quizzId+"")
  return quiz
  return []
  }catch(err){
    console.error(err)
    return []
  }
}

function createQuiz({token,courseId,title,desc,rank,quiz,expire,setting,url}){
  try{
  const quizDb = QUIZS_DB.getSheetByName(courseId+QUIZ_DB_NAME)
  const tableRow = quizDb?.getLastRow() > 1 ? quizDb?.getLastRow() + 1 : 2
  quizDb.getRange(tableRow,QUIZ_ID_INDEX+1).setValue(genLessonId())
  quizDb.getRange(tableRow,QUIZ_TITLE_INDEX+1).setValue(title)
  //quizDb.getRange(tableRow,QUIZ_DESC_INDEX+1).setValue("")
  quizDb.getRange(tableRow,QUIZ_RANK_INDEX+1).setValue(rank)
  quizDb.getRange(tableRow,QUIZ_EXPIRE_INDEX+1).setValue(expire)
  quizDb.getRange(tableRow,QUIZ_SETTING_INDEX+1).setValue(JSON.stringify(setting))
  quizDb.getRange(tableRow,QUIZ_EXTERNAL_INDEX+1).setValue(url)
  quizDb.getRange(tableRow,QUIZ_QUIZS_INDEX+1).setValue(quiz)
  quizDb.getRange(tableRow,QUIZ_DATE_INDEX+1).setValue(new Date(Date.now()))

  return {status:"success",mss:"created quiz pls refresh this page"}
  }catch(err){
    return {status:"error",mss:JSON.stringify(err)}
  }
}


function testQ(){
  console.log(getQuiz({courseId:"1700586824977955822",quizRId:5,quizzId:"17007208081809"}))
}




