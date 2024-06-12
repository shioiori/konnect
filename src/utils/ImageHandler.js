import axios from 'axios'

export async function uploadImageToImgur(formData) {
  try {
    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`
      }
    })
    return response.data.data.link
  } catch (error) {
    throw error
  }
}
