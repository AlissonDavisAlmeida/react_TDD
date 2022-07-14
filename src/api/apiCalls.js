import axios from 'axios';
import i18n from '../locale/i18n';

export const signup = (requestObjs)=>{
    return   axios.post("/api/1.0/users", requestObjs,{
        headers:{
            "Accept-language": i18n.language
        }
    })
}