import React, { useState } from 'react';
import './App.css';
import { TierList, courseState, tierWeights } from './tierList'
import {getRandomPrix, CoursePreferences} from './codes'

let preferences:CoursePreferences = {}


function updateTiers(tiers: courseState[]):void{
  for (const stateObject of tiers){
    preferences[stateObject.course] = tierWeights[stateObject.tier as ('S' | 'A' |'B' | 'C' | 'D' | 'F')]
  }
  console.log(preferences)
}

function App() {
  const tierList = React.createRef();
  return <div style={{display: 'flex'}}>
      <div style={{padding: '5px', border: 'solid 1px black'}}>
        <h2>Choose Course Preferences</h2>
        <TierList updateTiers={updateTiers}/></div>
      <div style={{border: 'solid 1px black', padding: '5px', width: '1000%'}}>
        <h2>Get Random Courses Code</h2>
        <div style={{display: 'flex', height:'100%'}}>
          <CodeGenerationForm/>
        </div>
        
      </div>

    </div>
}


class CodeGenerationForm extends React.Component<{}, {courseCount: number | '', buttonEnabled: boolean, code: string}> {
  constructor(props:{}){
    super(props)
    this.state = {
      courseCount: 8,
      buttonEnabled: true,
      code: ''
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === ''){
      this.setState({courseCount: value})
    }
    else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))){
      this.setState({courseCount: Number(value)})
    }
    this.setState({buttonEnabled: Number(value) > 0 && Number(value) <= 20})
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const courseCountInput = parseInt(document.querySelector<HTMLInputElement>('#courseCountInput')!.value as string)
    const courseCount = courseCountInput > 0 && courseCountInput <= 20 ? courseCountInput : 4
    this.setState({code: getRandomPrix(courseCount, [preferences])});
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='courseCountInput'>Prix Length:</label>
          <input type='text' id='courseCountInput' value={this.state.courseCount} onChange={this.handleChange}></input>
          <label style={{color: 'orange', display: this.state.buttonEnabled? 'none': 'inline'}}>&nbsp;Prix length must be between 1 and 20</label>
          <br/>
          <button onClick={getNewCode} disabled={!this.state.buttonEnabled}>Show me some races!</button>
          <br/>
        </form>
        <textarea id="code-textarea" readOnly={true} rows={16} value={this.state.code}></textarea>
      </div>
      );
  }
  
}

function getNewCode() {
}

export default App;
