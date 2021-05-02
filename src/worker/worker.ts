import {getStatistics, CoursePreferences} from '../codes'

// onmessage = (e)=>{
//     postMessage(getStatistics(e.data))
// }

export async function doWork(courseCount: number, preferences: CoursePreferences, repeatWeight: number): Promise<CoursePreferences[]> {
    console.log(6)
    return getStatistics(courseCount, preferences, repeatWeight)
}