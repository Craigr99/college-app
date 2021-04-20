import axios from 'axios'

// Base URL for API
export default axios.create({
    baseURL: 'https://craig-college-api.herokuapp.com/api'
});