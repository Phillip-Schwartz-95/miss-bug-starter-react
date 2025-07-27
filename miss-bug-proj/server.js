import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

// CORS middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials', 'true') // Required for cookies
    next()
})

let gBugs = [
    {
        _id: "1NF1N1T3",
        title: "Infinite Loop Detected",
        description: "The system has encountered an infinite loop in the code execution.",
        severity: 4,
    },
    {
        _id: "K3YB0RD",
        title: 'Keyboard Not Found',
        description: 'The keyboard is not responding, please check the connection.',
        severity: 3,
        createdAt: Date.now(),
    },
    {
        _id: "C0FF33",
        title: "404 Coffee Not Found",
        description: 'The coffee machine is out of order, please try again later.',
        severity: 2,
        createdAt: Date.now(),
    },
    {
        _id: "G0053",
        title: "Unexpected Response",
        description: 'The server returned an unexpected response, please check the API.',
        severity: 1,
        createdAt: Date.now(),
    }

]

// Test route
app.get('/', (req, res) => res.send('Hello there'))

// LIST
app.get('/api/bug', (req, res) => {
    res.json(gBugs)
})

// READ with cookie usage limit (Promise style)
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId

    Promise.resolve()
        .then(() => {
            // Parse visited bugs from cookie
            let visitedBugIds = []
            if (req.cookies.visitedBugs) {
                try {
                    visitedBugIds = JSON.parse(req.cookies.visitedBugs)
                } catch (err) {
                    console.log('Failed to parse visitedBugs cookie:', err)
                }
            }

            if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)

            // Log visited bugs
            console.log('User visited bugs:', visitedBugIds)

            // If user viewed more than 3 bugs
            if (visitedBugIds.length > 3) {
                return Promise.reject({ status: 401, message: 'Wait for a bit' })
            }

            // 7 seconds expiry
            res.cookie('visitedBugs', JSON.stringify(visitedBugIds), { maxAge: 7000, httpOnly: false })

            return visitedBugIds
        })
        .then(() => {
            // Find the bug
            const bug = gBugs.find(bug => bug._id === bugId)
            if (!bug) throw { status: 404, message: 'Bug not found' }
            res.json(bug)
        })
        .catch(err => {
            res.status(err.status || 500).send(err.message || 'Server error')
        })
})

// SAVE (add or update)
app.get('/api/bug/save', (req, res) => {
    const { _id, title, description, severity } = req.query

    if (_id) {
        // Update existing bug
        const bugIdx = gBugs.findIndex((bug) => bug._id === _id)
        if (bugIdx === -1) return res.status(404).send('Bug not found')
        gBugs[bugIdx] = { ...gBugs[bugIdx], title, description, severity: +severity }
        return res.json(gBugs[bugIdx])
    } else {
        // Add new bug
        const newBug = {
            _id: _makeId(),
            title,
            description,
            severity: +severity,
            createdAt: Date.now(),
        }
        gBugs.push(newBug)
        res.json(newBug)
    }
})

// DELETE
app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugIdx = gBugs.findIndex((bug) => bug._id === req.params.bugId)
    if (bugIdx === -1) return res.status(404).send('Bug not found')
    const removedBug = gBugs.splice(bugIdx, 1)[0]
    res.json(removedBug)
})

// ID generator
function _makeId(length = 5) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

app.listen(3030, () => console.log('Server ready at port 3030'))
