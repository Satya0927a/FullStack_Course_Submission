import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = ()=>{
    const request = axios.get(baseUrl);
    return request.then(Response => Response.data)
}

const addData = (newobj)=>{
    const request = axios.post(baseUrl,newobj)
    return request.then(Response => Response.data)
}

const deleteData = (id)=>{
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(Response => Response.data)
}

const updateData = (id,newobj)=>{
    const request = axios.put(`${baseUrl}/${id}`, newobj)
    return request.then(Response => Response.data)
}
export default {
    getAll,
    addData,
    deleteData,
    updateData
}