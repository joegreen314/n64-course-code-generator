import React, { useState } from 'react';
import './App.css';
import { TierList, CourseTierPlacement, tierWeights, tierNames, tierName, TierOdds } from './tierList'
import {getRandomPrix, CoursePreferences, CourseKey, getStatistics, courses} from './codes'

interface AppState {
  courseCount: number | '',
  courseTiers: CourseTierPlacement[]
}

function App() {
  const [state, setState] = useState({
    courseCount: 8 as (number | ''),
    courseTiers: (Object.keys(courses) as CourseKey[]).map((courseKey, index)=>({
        course: courseKey,
        tier: (tierNames as any[]).includes(localStorage.getItem(courseKey)) ? localStorage.getItem(courseKey)! : 'B',
        id: index
      })) as CourseTierPlacement[]});

  const changeCourseTier = (courseKey: CourseKey, tier: tierName) => {
    setState((prevState: AppState)=> ({
      courseCount: prevState.courseCount,
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
  
  const courseOdds = getStatistics(state.courseCount ? state.courseCount : 1, preferences)
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
          <CodeGenerationForm preferences={preferences} courseCount={state.courseCount} setState={setState}/>
        </div>
      </div>
    </div>
}

interface CodeGenerationFormState {
  buttonEnabled: boolean,
  ruinSurprise: boolean,
  code: string,
  courses: CourseKey[]
}

class CodeGenerationForm extends React.Component<{preferences: CoursePreferences, courseCount: number | '', setState:any }, CodeGenerationFormState> {
  constructor(props:{preferences: CoursePreferences, courseCount: number | '', setState:any}){
    super(props)
    this.state = {
      buttonEnabled: true,
      code: '',
      courses: [],
      ruinSurprise: false,
    }
  }

  private handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === ''){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        courseCount: value
      }));
    }
    else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        courseCount: Number(value)
      }));
    }
    this.setState({buttonEnabled: Number(value) > 0 && Number(value) <= 20})
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
    const randomPrix = getRandomPrix(courseCount, [this.props.preferences])
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
          <input type='text' id='courseCountInput' value={this.props.courseCount} onChange={this.handleCountChange}></input><br/>
          <label style={{color: 'red', display: this.state.buttonEnabled? 'none': 'inline'}}>&nbsp;Length must be between 1 and 20</label>
          <br/><label htmlFor='ruinSurpriseBox'>Show Course Names / Ruin Surprise:</label>
          <input type='checkbox' id='ruinSurpriseBox' checked={this.state.ruinSurprise} onChange={this.handleSurpriseChange}></input>
          <br/>
          <button disabled={!this.state.buttonEnabled}>Show me some races!</button>
          <br/>
        </form>
        <textarea id="code-textarea" readOnly={true} rows={10} value={this.state.code}
            style={{display: this.state.code? 'inline-block' : 'none'}}></textarea>
        <textarea id="courses-textarea" readOnly={true} rows={10} value={this.state.courses.join('\n')}
                  style={{display: this.state.ruinSurprise && this.state.code ? 'inline-block' : 'none'}}></textarea>
        {/* <Statistics courseCount={Number(this.state.courseCount)} preferences={this.props.preferences}/> */}
      </div>
      );
  }
}

// function Statistics({courseCount, preferences}: {courseCount: number, preferences: CoursePreferences}){
//   const statistics: CoursePreferences[] = getStatistics(courseCount, preferences)
//   const singleString: string = Object.entries(statistics[0]).map(([key, value])=>`${key}:\t${Math.floor(value*100)}%`).join('\n')
//   const multipleString: string = Object.entries(statistics[1]).map(([key, value])=>`${key}:\t${Math.floor(value*100)}%`).join('\n')
//   return <>
//     <br/><label>Odds of getting course: </label><br/>
//     <textarea id="code-textarea" readOnly={true} rows={16} value={singleString}></textarea>
//     <br/><label>Odds of getting course more than once: </label><br/>
//     <textarea id="code-textarea" readOnly={true} rows={16} value={multipleString}></textarea>
//   </>;
// }

export default App;
