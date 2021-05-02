import {getStatistics, CoursePreferences} from '../codes'

// onmessage = (e)=>{
//     postMessage(getStatistics(e.data))
// }
export async function runGetStatistics(courseCount: number, preferences: CoursePreferences, repeatWeight: number): Promise<CoursePreferences[]> {
    console.log(5)
    return getStatistics(courseCount, preferences, repeatWeight)
}