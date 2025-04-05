import {ref} from 'vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

export function useApi() {
	const data = ref(null)
	const error = ref(null)
	const loading = ref(false)
	const statusCode = ref(null)

	const fetchData = async (url, options = {}) => {
		loading.value = true
		error.value = null
		statusCode.value = null
		data.value = null

		try {
			const response = await axios({url, ...options})
			data.value = response.data
			statusCode.value = response.status
		} catch (err) {
			if (err.response) {
				error.value = err.response.data
				statusCode.value = err.response.status
			} else {
				error.value = err.message || 'Erro desconhecido'
			}
		} finally {
			loading.value = false
		}
	}

	return {
		data,
		error,
		loading,
		statusCode,
		fetchData,
	}
}
