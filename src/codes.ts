

class Course {
    constructor(
        public name: string,
        public code: string,
        public length?: number,
    ) {
    }
}

type CourseKey = 'mario' | 'choco' | 'bowser' | 'banshee' | 'yoshi' | 'frappe' | 'koopa' | 'royal' |
    'luigi' | 'moomoo' | 'toad' | 'kalimari' | 'sherbert' | 'rainbow' | 'wario' | 'dk'
// enum CourseKey {
//     mario,
//     choco,
//     bowser,
//     banshee,
//     yoshi,
//     frappe,
//     koopa,
//     royal,
//     luigi,
//     moomoo,
//     toad,
//     kalimari,
//     sherbert,
//     rainbow,
//     wario,
//     dk
// }

interface CoursePreferences {
    mario?: number,
    choco?: number,
    bowser?: number,
    banshee?: number,
    yoshi?: number,
    frappe?: number,
    koopa?: number,
    royal?: number,
    luigi?: number,
    moomoo?: number,
    toad?: number,
    kalimari?: number,
    sherbert?: number,
    rainbow?: number,
    wario?: number,
    dk?: number
}

const joeCoursePreferences: CoursePreferences = {
    rainbow: 0,
    yoshi: 5,
    dk: 4,
    royal: 3,
    mario: 1
}

const kelseyCoursePreferences: CoursePreferences = {
    banshee: 0,
    yoshi: 5,
    toad: 5,
    koopa: 3,
    kalimari: 3,
    frappe: 3,
    sherbert: 3,
    rainbow: 0,
    bowser: 0
}

const joshCoursePreferences: CoursePreferences = {
    koopa: 2,
    wario: 2,
    dk: 2
}

// const everyoneCoursePreferences: CoursePreferences = {
//     mario: 1,
//     choco: 3,
//     bowser: 2,
//     banshee: 2,
//     yoshi: 5,
//     frappe: 3,
//     koopa: 5,
//     royal: 3,
//     luigi: 3,
//     moomoo: 2,
//     toad: 3,
//     kalimari: 3,
//     sherbert: 4,
//     rainbow: 0,
//     wario: 3,
//     dk: 4
// }

const everyoneCoursePreferences: CoursePreferences = {
    mario: 1,
    choco: 1.5,
    bowser: 2,
    banshee: 2,
    yoshi: 2.5,
    frappe: 3,
    koopa: 2.5,
    royal: 3,
    luigi: 3,
    moomoo: 2,
    toad: 1.5,
    kalimari: 3,
    sherbert: 4,
    rainbow: 0,
    wario: 1.5,
    dk: 2
}

const derek: CoursePreferences = {
    mario: 0,
    choco: 1,
    bowser: .75,
    banshee: .75,
    yoshi: 3,
    frappe: 1.5,
    koopa: 3,
    royal: 1.5,
    luigi: 1,
    moomoo: 0,
    toad: 1.5,
    kalimari: 1.5,
    sherbert: 1.5,
    rainbow: 0,
    wario: 1.5,
    dk: 2
}

const difficulty: CoursePreferences = {
    mario: 5,
    choco: 3,
    bowser: 4,
    banshee: 4,
    yoshi: 1,
    frappe: 2,
    koopa: 1,
    royal: 2,
    luigi: 1,
    moomoo: 1,
    toad: 2,
    kalimari: 1,
    sherbert: 2,
    rainbow: 1,
    wario: 1,
    dk: 1
}

const noPreferences: CoursePreferences = {
}

const courses: {
    [key in CourseKey]: Course
} = {
    mario: new Course("Mario Raceway", '0000'),
    choco: new Course("Choco Mountain", '0001'),
    bowser: new Course("Bowser's Castle", '0002'),
    banshee: new Course("Banshee Boardwalk", '0003'),
    yoshi: new Course("Yoshi Valley", '0004'),
    frappe: new Course("Frappe Snowland", '0005'),
    koopa: new Course("Koopa Troopa Beach", '0006'),
    royal: new Course("Royal Raceway", '0007'),
    luigi: new Course("Luigi Raceway", '0008'),
    moomoo: new Course("Moo Moo Farm", '0009'),
    toad: new Course("Toad's Turnpike", '000A'),
    kalimari: new Course("Kalimari Desert", '000B'),
    sherbert: new Course("Sherbert Land", '000C'),
    rainbow: new Course("Rainbow Road", '000D'),
    wario: new Course("Wario Stadium", '000E'),
    dk: new Course("DK's Jungle Parkway", '0012')
}

// const positionCode = ['B5', 'B7', 'B9', 'BB', ]

const positionCodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(index=>(parseInt('B5', 16) + 2 * index).toString(16))

function getCourseSwapCode(course: CourseKey, position: number): string {
    return `800F2B${positionCodes[position]} ${courses[course].code}`
}

function padNumber(num: string, size: number) {
    var s = String(num);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }
  

function getPrixLengthCodes(courseCount: number): string[] {
    const codes = (courseCount > 4) ? ['8018EE09 0000'] : [];
    codes.push(`8128E3C6 ${padNumber((courseCount - 1).toString(16), 4)}`)
    return codes
}

function getPrixCodes(courses: CourseKey[]): string[] {
    return getPrixLengthCodes(courses.length).concat(courses.map((course, i)=>getCourseSwapCode(course, i)));
}

function getRandomChoiceFromWeightedArray(dataDict: CoursePreferences): CourseKey {
    const data = Object.entries(dataDict)
    let total = 0
    for (let i = 0; i < data.length; ++i) {
        total += data[i][1];
    }
    const threshold = Math.random() * total;

    total = 0;
    for (let i = 0; i < data.length - 1; ++i) {
        // Add the weight to our running total.
        total += data[i][1];

        // If this value falls within the threshold, we're done!
        if (total >= threshold) {
            return data[i][0] as CourseKey;
        }
    }
    return data[data.length - 1][0] as CourseKey;
}

function convertCoursePrefsToArray(preferences: CoursePreferences): number[] {
    return (Object.keys(courses) as CourseKey[]).map(course=>Object.keys(preferences).includes(course) ? preferences[course]! : 2)
}

function chooseCourses(courseCount: number, preferences: CoursePreferences[], allowRepeats=true) {
    //TODO clean this up so it's easier to do stuff with it
    const prefs = preferences.map(p=>convertCoursePrefsToArray(p))
    const compositeCoursePreferences: CoursePreferences = {}
    for (let i = 0; i < Object.keys(courses).length; i++){
        const coursePrefs = prefs.map(pref=>pref[i])
        const courseKey = Object.keys(courses)[i] as CourseKey
        if (coursePrefs.includes(0) && preferences.length <= 2) {
            compositeCoursePreferences[courseKey] = 0
        } else {
            compositeCoursePreferences[courseKey] = coursePrefs.reduce((a, b)=>a + b, 0)
        }
    }
    console.log(compositeCoursePreferences)
    const selectedCourses:CourseKey[] = [];
    while (selectedCourses.length < courseCount) {
        const new_course = getRandomChoiceFromWeightedArray(compositeCoursePreferences)
        if (allowRepeats || !selectedCourses.includes(new_course)){
            selectedCourses.push(new_course)
        }
        compositeCoursePreferences[new_course]!*=(courseCount/32)
    }
    selectedCourses.reverse()
    console.log(selectedCourses)
    return selectedCourses;
}

function getRandomPrix(courseCount: number, preferences: CoursePreferences[]) {
    const courses = chooseCourses(courseCount, preferences)
    return getPrixCodes(courses).join('\r\n').toUpperCase()
}


// console.log(getRandomPrix(5, [everyoneCoursePreferences]))

export type {CourseKey, CoursePreferences}
export {courses, getRandomPrix};