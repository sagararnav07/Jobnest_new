import api from './axios'

const quizService = {
    // Start a new quiz
    startQuiz: async () => {
        const response = await api.post('/quiz/createQuiz')
        return response.data
    },

    // Get quiz questions
    getQuiz: async () => {
        const response = await api.get('/quiz/getQuestions')
        return response.data
    },

    // Submit quiz answers
    submitQuiz: async (data) => {
        const response = await api.put('/quiz/endQuiz', data)
        return response.data
    },

    // Get quiz result
    getQuizResult: async () => {
        const response = await api.get('/quiz/result')
        return response.data
    }
}

export default quizService
