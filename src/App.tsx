import React, { useState } from 'react';
import './App.css';
import { TierList, courseState, tierWeights } from './tierList'
import {courses, CourseKey, getRandomPrix, CoursePreferences} from './codes'

let preferences:CoursePreferences = {}


function updateTiers(tiers: courseState[]):void{
  for (const stateObject of tiers){
    preferences[stateObject.course] = tierWeights[stateObject.tier as ('S' | 'A' |'B' | 'C' | 'D' | 'F')]
  }
  console.log(preferences)
}

function App() {
  const tierList = React.createRef();
  return <div>
      <label>Drag and drop the course icons to change course liklihood</label>
      <TierList updateTiers={updateTiers}/>
      <label htmlFor='courseCountInput'>Prix Length:</label>
      <input type='text' id='courseCountInput' value='8'></input>
      <br/>
      <button onClick={getNewCode}>Show me some races!</button>
      <br/>
      <textarea id="code-textarea" readOnly={true} rows={16} ></textarea>
    </div>
}

function getNewCode() {
  const courseCountInput = parseInt(document.querySelector<HTMLInputElement>('#courseCountInput')!.value as string)
  const courseCount = courseCountInput > 0 && courseCountInput <= 20 ? courseCountInput : 4
  document.querySelector('#code-textarea')!.innerHTML = getRandomPrix(courseCount, [preferences])
}

export default App;
