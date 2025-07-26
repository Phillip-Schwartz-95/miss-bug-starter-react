import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

let gBugs = [
  {
    _id: 'b101',
    title: 'Cannot save',
    description: 'problem when clicking Save',
    severity: 3,
    createdAt: Date.now(),
  },
  {
    _id: 'b102',
    title: 'Broken login page',
    description: 'page crashes on submit',
    severity: 2,
    createdAt: Date.now(),
  },
]

// Test route
app.get('/', (req, res) => res.send('Hello there'))

// LIST
app.get('/api/bug', (req, res) => {
  res.json(gBugs)
})

// READ
app.get('/api/bug/:bugId', (req, res) => {
  const bug = gBugs.find((bug) => bug._id === req.params.bugId)
  if (!bug) return res.status(404).send('Bug not found')
  res.json(bug)
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
