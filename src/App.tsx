import React, { useState } from 'react';
import { Typography, TextField, Slider, TextareaAutosize, Button, Checkbox, FormControlLabel, Container } from '@material-ui/core';

import './App.css';
import { TierList, CourseTierPlacement, tierWeights, tierNames, tierName, TierOdds } from './tierList'
import {getRandomPrix, CoursePreferences, CourseKey, getStatistics, courses} from './codes'
import Worker from './worker'

interface AppState {
  courseCount: number | '',
  repeatWeightChange: number,
  courseTiers: CourseTierPlacement[]
}

const worker = new Worker();
let tierOddsPromise: Promise<CoursePreferences[]> = Promise.resolve([])
let nextCourseCount: number;
let nextPreferences: CoursePreferences;
let nextRepeatWeight: number; 
let lastCourseCount: number;
let lastPreferences: CoursePreferences;
let lastRepeatWeight: number; 

async function updateStatistics(courseCount: number, preferences: CoursePreferences, repeatWeight: number) {
  nextCourseCount = courseCount
  nextPreferences = preferences
  nextRepeatWeight = repeatWeight
  await tierOddsPromise
  const preferenceChange = (Object.keys(nextPreferences) as CourseKey[]).filter(key=>!lastPreferences || !(key in lastPreferences) || nextPreferences[key] != lastPreferences[key]).length > 0
  if (nextCourseCount != lastCourseCount || nextRepeatWeight != lastRepeatWeight || preferenceChange){
    tierOddsPromise = worker.runGetStatistics(nextCourseCount, nextPreferences, nextRepeatWeight)
    lastCourseCount = nextCourseCount;
    lastPreferences = nextPreferences;
    lastRepeatWeight = nextRepeatWeight;
  }
  return tierOddsPromise
}

function spookyTime():boolean{
  const date = new Date()
  return date.getMonth()===9 && date.getDate() + 14 >= 31
}

function App() {
  const [state, setState] = useState({
    courseCount: 8 as (number | ''),
    repeatWeightChange: .25,
    courseTiers: (Object.keys(courses) as CourseKey[]).map((courseKey, index)=>{
      let tier
      if (spookyTime() && courses[courseKey].isSpooky) {
        tier = 'S'
      } else if ((tierNames as any[]).includes(localStorage.getItem(courseKey))) {
        tier = localStorage.getItem(courseKey)!
      } else {
        tier = 'B'
      }
      return {
        course: courseKey,
        tier,
        id: index
      }}) as CourseTierPlacement[]});

  const changeCourseTier = (courseKey: CourseKey, tier: tierName) => {
    if (!spookyTime() || !courses[courseKey].isSpooky){
      setState((prevState: AppState)=> ({
        courseCount: prevState.courseCount,
        repeatWeightChange: prevState.repeatWeightChange,
        courseTiers: prevState.courseTiers.map((courseTier: CourseTierPlacement) =>({
                  ...courseTier,
                  tier: courseTier.course === courseKey ? tier : courseTier.tier,
        }))
      }));
    }
  }

  const preferences:CoursePreferences = {}
  for (const tier of state.courseTiers){
    preferences[tier.course] = tierWeights[tier.tier as ('S' | 'A' | 'B' | 'C' | 'D' | 'F')]
    localStorage.setItem(tier.course, tier.tier)
  }

  let oddsPromise = updateStatistics(state.courseCount ? state.courseCount : 1, preferences, state.repeatWeightChange)

  // const courseOdds = getStatistics(state.courseCount ? state.courseCount : 1, preferences, state.repeatWeightChange)

  return <div style={{display: 'flex'}}>
      <div style={{padding: '5px', border: 'solid 1px black', clear: 'both'}}>
        <h2 style={{float: 'left'}}>Choose {spookyTime() ? 'Spooky' : ''} Course Preferences</h2>
        <h2 style={{float: 'right', paddingRight: '20px'}}>{spookyTime() ? 'Spooky' : ''} Odds</h2>
        <TierList courseTiers={state.courseTiers} changeCourseTier={changeCourseTier} tierOddsPromise={oddsPromise}/></div>
      <div style={{border: 'solid 1px black', padding: '5px', width: '1000%'}}>
        <h2>Get {spookyTime() ? 'Spooky' : ''} Prix Code</h2>
        <div style={{display: 'flex', height:'100%'}}>
          <CodeGenerationForm preferences={preferences} courseCount={state.courseCount} setState={setState} repeatWeightChange={state.repeatWeightChange}/>
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
  repeatWeightChange:number,
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
    this.props.repeatWeightChange > 0 ? 20 : Object.values(this.props.preferences).filter((courseWeight: number)=> courseWeight > 0).length

  private handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value === ''){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        repeatWeightChange: prevState.repeatWeightChange,
        courseCount: value
      }));
    }
    else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))){
      this.props.setState((prevState: AppState)=>({
        courseTiers: prevState.courseTiers,
        repeatWeightChange: prevState.repeatWeightChange,
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

  private allowRepeatsChange = (event: any, newValue: number|number[]) => {
    this.props.setState((prevState: AppState)=> ({
      courseTiers: prevState.courseTiers,
      repeatWeightChange: newValue,
      courseCount: prevState.courseCount
    }))
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const courseCountInput = parseInt(document.querySelector<HTMLInputElement>('#courseCountInput')!.value as string)
    const courseCount = courseCountInput > 0 && courseCountInput <= this.getMaxRaces() ? courseCountInput : 4
    const randomPrix = getRandomPrix(courseCount, this.props.preferences, this.props.repeatWeightChange)
    this.setState({
      code: randomPrix.code,
      courses: randomPrix.courses
    });
  }


  render() {
    const buttonEnabled = Number(this.props.courseCount) > 0 && Number(this.props.courseCount) <= this.getMaxRaces()
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id='courseCountInput'
            label={'Prix Length:'}
            value={this.props.courseCount}
            onChange={this.handleCountChange}
            error={!buttonEnabled}
            helperText={buttonEnabled? '': `Length must be between 1 and ${this.getMaxRaces()}`}
          />
          <br/>
          <br/>
          <Typography variant='body1' gutterBottom>Repeat Course Weight Change (0%: No repeats)</Typography>
          <Slider
            value={this.props.repeatWeightChange}
            onChange={this.allowRepeatsChange}
            defaultValue={.25}
            min={0}
            max={1.5}
            step={.1}
            marks={
              [0, .5, 1, 1.5].map(value=>({
                value: value,
                label: `${value*100}%`
              }))
            }
            valueLabelFormat={(value: number)=>`${Math.round(value*100)}%`}
            valueLabelDisplay="auto"
            aria-labelledby="continuous-slider"
          />
          <br/>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.ruinSurprise}
                onChange={this.handleSurpriseChange}
                color='primary'
              />
            }
            label='Ruin Surprise (show names)'
          />
          <br/>
          <Button type='submit' variant='contained' disabled={!buttonEnabled}>Show me some {spookyTime() ? 'Spooky' : ''} races!</Button>
          <br/>
        </form>
        <br/>
        {
          this.state.code && <TextareaAutosize
            readOnly={true}
            value={this.state.code}
          />
        }
        <br/>
        {
          this.state.ruinSurprise && this.state.code && <TextareaAutosize
            readOnly={true}
            rows={this.state.courses.length + 1}
            value={this.state.courses.join('\n')}
          />
        }
      </Container>
      );
  }
}

export default App;
