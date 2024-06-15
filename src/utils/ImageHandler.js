import axios from 'axios'
import { useConfigStore } from '@/stores/config'

export async function uploadImageToImgur(formData) {
  try {
    const configStore = useConfigStore()
    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        Authorization: `Client-ID ${configStore.getImgurClientId}`
      }
    })
    return response.data.data.link
  } catch (error) {
    throw error
  }
}
