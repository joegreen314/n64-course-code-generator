import React, { useState } from 'react';
import './App.css';
import { TierList, CourseTierPlacement, tierWeights, tierNames, tierName, TierOdds } from './tierList'
import {getRandomPrix, CoursePreferences, CourseKey, getStatistics, courses} from './codes'

interface AppState {
  courseCount: number | '',
  allowRepeats: boolean,
  courseTiers: CourseTierPlacement[]
}

function App() {
  const [state, setState] = useState({
    courseCount: 8 as (number | ''),
    allowRepeats: true,
    courseTiers: (Object.keys(courses) as CourseKey[]).map((courseKey, index)=>({
        course: courseKey,
        tier: (tierNames as any[]).includes(localStorage.getItem(courseKey)) ? localStorage.getItem(courseKey)! : 'B',
        id: index
      })) as CourseTierPlacement[]});

  const changeCourseTier = (courseKey: CourseKey, tier: tierName) => {
    setState((prevState: AppState)=> ({
      courseCount: prevState.courseCount,
      allowRepeats: prevState.allowRepeats,
      courseTiers: prevState.courseTiers.map((courseTier: CourseTierPlacement) =>({
                ...courseTier,
                tier: courseTier.course === courseKey ? tier : courseTier.tier,
            })
        )}));
  }

  const preferences:CoursePreferences = {}
  for (const tier of state.courseTiers){
    preferences[tier.course] = tierWeights[tier.tier as ('S' | 'A' |'B' | 'C' | 'D' | 'F')]
    localStorage.setItem(tier.course, tier.tier)
  }
  console.log(preferences)
  const courseOdds = getStatistics(state.courseCount ? state.courseCount : 1, preferences, state.allowRepeats)
  const tierOdds:TierOdds = {};
  state.courseTiers.forEach((courseTier:CourseTierPlacement)=>{
    tierOdds[courseTier.tier] = [courseOdds[0][courseTier.course]!, courseOdds[1][courseTier.course]!];
  });

  return <div style={{display: 'flex'}}>
      <div style={{padding: '5px', border: 'solid 1px black', clear: 'both'}}>
        <h2 style={{float: 'left'}}>Choose Course Preferences</h2><h2 style={{float: 'right', paddingRight: '20px'}}>Odds</h2>
        <TierList courseTiers={state.courseTiers} changeCourseTier={changeCourseTier} tierOdds={tierOdds}/></div>
      <div style={{border: 'solid 1px black', padding: '5px', width: '1000%'}}>
        <h2>Get Prix Code</h2>
        <div style={{display: 'flex', height:'100%'}}>
          <CodeGenerationForm preferences={preferences} courseCount={state.courseCount} setState={setState} allowRepeats={state.allowRepeats}/>
        </div>
      </div>
    </div>
}

interface CodeGenerationFormState {
  ruinSurprise: boolean,
  code: string,
  courses: CourseKey[]
}

interface CodeGenerationFormProps {
  preferences: CoursePreferences,
  courseCount: number | '',
  allowRepeats:boolean,
  setState:any 
}

class CodeGenerationForm extends React.Component<CodeGenerationFormProps, CodeGenerationFormState> {
  constructor(props:CodeGenerationFormProps){
    super(props)
    this.state = {
      code: '',
      courses: [],
      ruinSurprise: false
    }
  }

  private getMaxRaces = () =>
    this.props.allowRepeats ? 20 : Object.values(this.props.preferences).filter((courseWeight: number)=> courseWeight > 0).length

  private handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === ''){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        allowRepeats: prevState.allowRepeats,
        courseCount: value
      }));
    }
    else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        allowRepeats: prevState.allowRepeats,
        courseCount: Number(value)
      }));
    }
    // this.setState({buttonEnabled: Number(value) > 0 && Number(value) <= this.getMaxRaces()})
  }

  private handleSurpriseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ruinSurprise: event.target.checked
    })
  }

  private allowRepeatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setState((prevState: AppState)=> ({
      courseTiers: prevState.courseTiers,
      allowRepeats: event.target.checked,
      courseCount: prevState.courseCount
    }))
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const courseCountInput = parseInt(document.querySelector<HTMLInputElement>('#courseCountInput')!.value as string)
    const courseCount = courseCountInput > 0 && courseCountInput <= this.getMaxRaces() ? courseCountInput : 4
    const randomPrix = getRandomPrix(courseCount, this.props.preferences, this.props.allowRepeats)
    this.setState({
      code: randomPrix.code,
      courses: randomPrix.courses
    });
  }


  render() {
    const buttonEnabled = Number(this.props.courseCount) > 0 && Number(this.props.courseCount) <= this.getMaxRaces()
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='courseCountInput'>Prix Length:</label>
          <input type='text' id='courseCountInput' value={this.props.courseCount} onChange={this.handleCountChange}></input><br/>
          <label style={{color: 'red', display: buttonEnabled? 'none': 'inline'}}>&nbsp;Length must be between 1 and {this.getMaxRaces()}</label>
          <br/>
          <input type='checkbox' id='allowRepeatsBox' checked={this.props.allowRepeats} onChange={this.allowRepeatsChange}></input>
          <label htmlFor='allowRepeatsBox'>Allow repeat races</label>
          <br/>
          <input type='checkbox' id='ruinSurpriseBox' checked={this.state.ruinSurprise} onChange={this.handleSurpriseChange}></input>
          <label htmlFor='ruinSurpriseBox'>Ruin Surprise (reveal course names)</label>
          <br/>
          <button disabled={!buttonEnabled}>Show me some races!</button>
          <br/>
        </form>
        <textarea id="code-textarea" readOnly={true} rows={10} value={this.state.code}
            style={{display: this.state.code? 'inline-block' : 'none'}}></textarea>
        <textarea id="courses-textarea" readOnly={true} rows={10} value={this.state.courses.join('\n')}
                  style={{display: this.state.ruinSurprise && this.state.code ? 'inline-block' : 'none'}}></textarea>
      </div>
      );
  }
}

export default App;
