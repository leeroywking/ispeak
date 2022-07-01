import React, {useState } from "react";

import * as Survey from "survey-react";
import * as SurveyReact from "survey-react-ui";
import surveyJSON from "./surveyJSON.json"

function Results(props){
  let resultsObj = props.resultsObj
  return (
    <div>
      <h2>
        Communication Preferences<br/>
        </h2>

      <h3>
        FC (Favorable Conditions)<br/>
        </h3>
      I = {resultsObj.FC.I}<br/>
      T = {resultsObj.FC.T}<br/>
      F = {resultsObj.FC.F}<br/>
      S = {resultsObj.FC.S}<br/>
<br/>
      <h3>
        SC (Stress Conditions)<br/>
        </h3>
      I = {resultsObj.SC.I}<br/>
      T = {resultsObj.SC.T}<br/>
      F = {resultsObj.SC.F}<br/>
      S = {resultsObj.SC.S}<br/>
    </div>
  )
}

export default function SurveyPage() {
  const [surveyDone, setSurveyDone] = useState(false)
  const [resultsObj, setResultsObj] = useState({})
  Survey.StylesManager.applyTheme("defaultV2");
  // var surveyJSON = 
  function sendDataToServer(survey) {
    // console.log(survey.data)
    let page1Results = []
    let page2Results = []
    let page3Results = []

    page1Order.forEach(name => {
      page1Results.push(getOrder(name, survey.data))
    })
    page2Order.forEach(name => {
      page2Results.push(getOrder(name, survey.data))
    })
    page3Order.forEach(name => {
      page3Results.push(getOrder(name, survey.data))
    })
    let allResults = [page1Results, page2Results, page3Results]
    let counts = {
      "FC": {
        "I": 0,
        "T": 0,
        "F": 0,
        "S": 0,
      },
      "SC": {
        "I": 0,
        "T": 0,
        "F": 0,
        "S": 0,
      }
    }
    let block1 = ["S", "F", "T", "I"]
    let block2 = ["F", "T", "S", "I"]
    let block3 = ["I", "T", "F", "S"]
    let block4 = ["T", "I", "S", "F"]
    let block5 = ["F", "T", "S", "I"]
    let block6 = ["T", "S", "I", "F"]
    let blocks = [block1, block2, block3, block4, block5, block6]
    for (let pagenum = 0; pagenum < 3; pagenum++) {
      for (let blocknum = 0; blocknum < 6; blocknum++) {
        for (let choicenum = 0; choicenum < 4; choicenum++) {
          if (blocknum < 3) {
            counts["FC"][blocks[blocknum][choicenum]] += allResults[pagenum][blocknum][choicenum]
          }
          else {
            counts["SC"][blocks[blocknum][choicenum]] += allResults[pagenum][blocknum][choicenum]
          }
        }
      }
    }
    console.log({ counts })
    setResultsObj(counts)
    setSurveyDone(true)
  }

  function getOrder(quesName, surveyData) {
    let originalOrder
    surveyJSON.pages.forEach(page => page.elements.forEach(el => {
      if (el.name === quesName) { originalOrder = el.choices }
    }))
    let results = []
    originalOrder.forEach((choice) => {
      surveyData[quesName].forEach((userChoice, idx) => {
        if (userChoice === choice) {
          results.push(idx + 1)
        }
      })

    })
    return results
  }

  let page1 = surveyJSON.pages[0]
  let page2 = surveyJSON.pages[1]
  let page3 = surveyJSON.pages[2]

  let page1Order = []
  let page2Order = []
  let page3Order = []
  page1.elements.forEach(el => page1Order.push(el.name))
  page2.elements.forEach(el => page2Order.push(el.name))
  page3.elements.forEach(el => page3Order.push(el.name))
  console.log({ page1Order, page2Order, page3Order })



  var model = new Survey.Model(surveyJSON);
  // model.showCompletedPage = true;
  return (
    // <div className="main">
    surveyDone?<Results resultsObj={resultsObj}/>:<SurveyReact.Survey model={model} onComplete={sendDataToServer} />
    // </div>
  );
}
