import React, { useState } from 'react';
import './App.css';
import { TierList, courseState, tierWeights } from './tierList'
import {getRandomPrix, CoursePreferences, CourseKey, getStatistics} from './codes'

let preferences:CoursePreferences = {}

function updateTiers(tiers: courseState[]):void{
  for (const stateObject of tiers){
    preferences[stateObject.course] = tierWeights[stateObject.tier as ('S' | 'A' |'B' | 'C' | 'D' | 'F')]
    localStorage.setItem(stateObject.course, stateObject.tier)
  }
  console.log(preferences, tiers)
}

function App() {
  console.log(localStorage)
  // const [items, setItems] = useState({preferences: });
  const tierList = React.createRef();
  return <div style={{display: 'flex'}}>
      <div style={{padding: '5px', border: 'solid 1px black'}}>
        <h2>Choose Course Preferences</h2>
        <TierList updateTiers={updateTiers}/></div>
      <div style={{border: 'solid 1px black', padding: '5px', width: '1000%'}}>
        <h2>Get Prix Code</h2>
        <div style={{display: 'flex', height:'100%'}}>
          <CodeGenerationForm/>
        </div>
      </div>
    </div>
}

interface CodeGenerationFormState {
  courseCount: number | '',
  buttonEnabled: boolean,
  ruinSurprise: boolean,
  code: string,
  courses: CourseKey[]
}

class CodeGenerationForm extends React.Component<{}, CodeGenerationFormState> {
  constructor(props:{}){
    super(props)
    this.state = {
      courseCount: 8,
      buttonEnabled: true,
      code: '',
      courses: [],
      ruinSurprise: false,
    }
  }


  private handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === ''){
      this.setState({courseCount: value})
    }
    else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))){
      this.setState({courseCount: Number(value)})
    }
    this.setState({buttonEnabled: Number(value) > 0 && Number(value) <= 20})
    getStatistics(Number(value), preferences)
  }

  private handleSurpriseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ruinSurprise: event.target.checked
    })
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const courseCountInput = parseInt(document.querySelector<HTMLInputElement>('#courseCountInput')!.value as string)
    const courseCount = courseCountInput > 0 && courseCountInput <= 20 ? courseCountInput : 4
    const randomPrix = getRandomPrix(courseCount, [preferences])
    this.setState({
      code: randomPrix.code,
      courses: randomPrix.courses
    });
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='courseCountInput'>Prix Length:</label>
          <input type='text' id='courseCountInput' value={this.state.courseCount} onChange={this.handleCountChange}></input><br/>
          <label style={{color: 'red', display: this.state.buttonEnabled? 'none': 'inline'}}>&nbsp;Length must be between 1 and 20</label>
          <br/><label htmlFor='ruinSurpriseBox'>Show Courses / Ruin Surprise:</label>
          <input type='checkbox' id='ruinSurpriseBox' checked={this.state.ruinSurprise} onChange={this.handleSurpriseChange}></input>
          <br/>
          <button disabled={!this.state.buttonEnabled}>Show me some races!</button>
          <br/>
        </form>
        <textarea id="code-textarea" readOnly={true} rows={20} value={this.state.code}
            style={{display: this.state.code? 'inline-block' : 'none'}}></textarea>
        <textarea id="courses-textarea" readOnly={true} rows={20} value={this.state.courses.join('\n')}
                  style={{display: this.state.ruinSurprise && this.state.code ? 'inline-block' : 'none'}}></textarea>
      </div>
      );
  }
  
}

export default App;
