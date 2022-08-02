import axios from 'axios';
import i18n from '../locale/i18n';

export const signup = (requestObjs)=>{
    return   axios.post("/api/1.0/users", requestObjs,{
        headers:{
            "Accept-language": i18n.language
        }
    })
}

export const activate = (token)=>{
    return axios.post("/api/1.0/activate/"+token,{
        headers:{
            "Accept-language": i18n.language
        }
    })
}

export const loadUsers = (page, size)=>{
    return axios.get("/api/1.0/users?page="+page+"&size="+size,{
        headers:{
            "Accept-language": i18n.language
        }
    })
}