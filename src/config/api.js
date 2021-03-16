import axios from 'axios'

export default axios.create({
    baseURL: 'https://craig-college-api.herokuapp.com/api'
});