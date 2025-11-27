const { config } = require('dotenv')
const dbModel = require('./../utlities/connection')
const { categoryDb } = require('./../utlities/dbsetup')
//get questions from DB 
const getQuestions = async (questionsIds = []) => {
    try {
        const questionCollection = await dbModel.getQuestionCollection()
        let questionData = null
        if (questionsIds.length === 0)
            questionData = await questionCollection.find({})
        else questionData = await questionCollection.find({ id: { $in: questionsIds } })
        if (!questionData || questionData.length === 0) {
            let error = new Error('Unable to fetch questions')
            error.status = 500
            throw error
        }
        else return questionData
    }
    catch (error) {
        throw error
    }
}

//Starts quiz for a jobseeker
const startQuiz = async (userId) => {
    try {
        const quizCollection = await dbModel.getQuizCollection()
        const existingQuiz = await quizCollection.findOne({ userId: userId })
        const isQuizStarted = await (existingQuiz) ? true : false
        if (isQuizStarted) {
            let error = new Error('Quiz already started')
            error.status = 400
            throw error
        }
        const createdQuiz = await quizCollection.create({ userId: userId });
        if (!createdQuiz) {
            let error = new Error('Unable to start quiz')
            error.status = 500
            throw error
        }
        else return { "message": "Quiz started successfully", questions: await getQuestions() }
    }
    catch (error) {
        throw error
    }
}

//Ends Quiz
const endQuiz = async (userId, responses) => {
    try {
        const quizCollection = await dbModel.getQuizCollection()
        // Convert questionId strings to mongoose ObjectId in all responses
        const transformedResponses = responses.map(resp => ({
            questionId: resp.questionId,
            score: resp.score,
            category: resp.category
        }))
        const questionIds = []
        transformedResponses.forEach((response) => {
            questionIds.push(response.questionId)
        })
        //get questions of all Ids
        let questions = []
        await getQuestions(questionIds)
            .then((data) => {
                questions = data.sort((a, b) => {
                    const aValue = parseInt(a.id.substring(1, a.length))
                    const bValue = parseInt(b.id.substring(1, b.length))
                    return aValue - bValue
                })
            })
        const sortedResponsesById = transformedResponses.sort((a, b) => {
            const aValue = parseInt(a.questionId.substring(1, a.length))
            const bValue = parseInt(b.questionId.substring(1, b.length))
            return aValue - bValue
        })
        const categoryMap = {
            "Openness": 0,
            "Conscientiousness": 1,
            "Extraversion": 2,
            "Agreeableness": 3,
            "Neuroticism": 4
        }
        let categoryObject = {
            categoryName: "",
            tags: [],
            score: 0,
            total: 0,
        }
        let categories = []
        for (let i = 0; i < 5; i++) categories.push({ ...categoryObject })
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].isReversed)
                sortedResponsesById[i].score = 6 - sortedResponsesById[i].score
            const categoryName = sortedResponsesById[i].category
            const categoryIndex = categoryMap[categoryName]
            categories[categoryIndex].score += sortedResponsesById[i].score
            categories[categoryIndex].total += 5
            if (!categories[categoryIndex].tags || categories[categoryIndex].tags.length === 0) {
                categories[categoryIndex].categoryName = categoryName
                categories[categoryIndex].tags = categoryDb[categoryName]
            }
        }
        const updatedQuiz = await quizCollection.updateOne(
            { userId: userId },
            { $set: { responses: responses, submittedAt: new Date() } }
        );
        if (updatedQuiz.modifiedCount === 0) {
            let error = new Error('Unable to update quiz object')
            error.status = 500
            throw error
        }
        //converts score to percent
        categories.map((category) => {
            category.score = (category.score / category.total) * 100
            return category
        })
        //sorts in descending order by score
        categories.sort((a, b) => b.score - a.score)
        //returns top three
        let topThreeCategories = [categories[0], categories[1], categories[2]]
        //get overalltags
        let overAllTags = []
        topThreeCategories.forEach((category) => {
            overAllTags.push(...category.tags)
        })
        categories = topThreeCategories.map((category) => {

            return { categoryName: category.categoryName, score: category.score, tags: category.tags }
        })
        //insert result object
        const resultCollection = await dbModel.getResultCollection()
        const insertedResult = await resultCollection.create({
            userId,
            generatedAt: new Date(),
            overAllTags,
            categories: categories
        })
        if (!insertedResult) {
            let error = new Error('Unable to insert result object')
            error.status = 500
            throw error
        }
        // update test to true in jobseeker collection
        const jobSeekerCollection = await dbModel.getJobSeekerCollection()
        const updatedJobSeeker = await jobSeekerCollection.updateOne({ _id: userId }, { $set: { test: true } })
        if (updatedJobSeeker.modifiedCount === 0) {
            let error = new Error('Unable to update jobseeker object')
            error.status = 500
            throw error
        }
        // get the matched employeers based on tags
        const employeerCollection = await dbModel.getEmployeerCollection()
        const potentialEmployeers = await employeerCollection.find({ tags: { $in: overAllTags } }, { _id: 0, name: 1 })
        
        // It's okay to have no matches - return empty array
        const potentialEmployeersName = potentialEmployeers.map((employeer) => employeer.name)
        return { potentialEmployeers: potentialEmployeersName, categories }
    }
    catch (error) {
        throw error
    }
}


module.exports = { getQuestions, startQuiz, endQuiz }