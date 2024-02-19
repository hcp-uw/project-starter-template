import axios from 'axios'


const baseURL = 'http://localhost:3001/message'

const getMessage = async () => {
    try {
        const response = await axios.get(`${baseURL}/hello`)
        return response.data
    } catch (error) {
        console.error(error)
        return 'Error: unable to retrieve message'
    }
}

export { getMessage }