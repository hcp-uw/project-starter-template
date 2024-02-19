import axios from 'axios'
const baseUrl = 'http://localhost:3001/image'

const upload = async (image) => {
    const response = await axios.post(`${baseUrl}/upload`, { image: image })
    return response.data
}

const getFeatured = async () => {
    const response = await axios.get(`${baseUrl}/featured`)
    console.log(response.data)
    return response.data
}

export { upload, getFeatured }