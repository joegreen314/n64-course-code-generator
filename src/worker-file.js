import {getStatistics} from './codes'

onmessage = (e)=>{
    postMessage(getStatistics(e.data))
}