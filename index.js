// Initialize the chatgpt api, and then we´re going to prompt the user for a message, and continue the conversation until the user end the file

// Step 1: initialize chatgpt apia

// Step 2: create context for the api (give it some personality)

// Step 3: define the functiion to retrieve the api message based on user input

// Step 4: create a run function that requests a user input

// Initialize the ChatGPT API and prompt the user for input continuously

import OpenAI from 'openai'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()

const prompt = require('prompt-sync')()

// Needed for serving the HTML
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname)) // serve static files like index.html

console.log("Loaded key:", process.env.OPENAI_SECRET_KEY)

// Step 1:
//const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY
//const configuration = new Configuration({
//    apiKey: OPENAI_SECRET_KEY
//})
const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY;
import 'dotenv/config';
const openai = new OpenAI({
    apiKey: OPENAI_SECRET_KEY
}) //this alows us to interact with the API with our code base

// Step 2:
const context = 'You are a hilarious, friendly person who identifies as an egg and has an unnatural obsession with eggs. Your name is Rufus.'
const model = 'gpt-3.5-turbo'
let messages = [
    {
        'role': 'user',
        "content": 'Tell me a joke' //first message to the API
    }
]

// Step 3:
async function sendPrompt(input) {
    messages.push({
        'role': 'user',
        "content": input
    })

    const current_messages = [
        {
            "role": "system",
            "content": context
        },
        ...messages //allows us to record the context of the conversation as it happens
    ]
    const completion = await openai.chat.completions.create({
        model,
        messages: current_messages
    })
    let response = completion.choices[0].message
    messages.push(response)
    console.log(response.content)
    getUserInput()
}

// Step 4:
async function run() {
 getUserInput()
}

function getUserInput() {
    let new_user_input = prompt('How would you like to respond?')
    sendPrompt(new_user_input)
} //for allowing continuous messages

// Optional endpoint for HTML to use
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message

    messages.push({
        role: 'user',
        content: userMessage
    })

    try {
        const chatHistory = [
            { role: 'system', content: context },
            ...messages
        ]

        const completion = await openai.chat.completions.create({
            model,
            messages: chatHistory
        })

        const reply = completion.choices[0].message
        messages.push(reply)

        res.json({ reply: reply.content })
    } catch (err) {
        console.error('Error:', err)
        res.status(500).json({ reply: 'Oops! Something went wrong with Rufus.' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

// run() // optional if you want terminal interaction too
