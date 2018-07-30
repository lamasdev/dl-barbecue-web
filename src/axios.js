import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://dlbarbecue.test'
});

export default instance;
