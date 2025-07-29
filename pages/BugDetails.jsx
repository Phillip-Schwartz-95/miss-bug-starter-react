const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId) // calls /api/bug/:bugId
            setBug(bug)
        } catch (err) {
            showErrorMsg('Cannot load bug')
        }
    }

    if (!bug) return <p className="loading">Loading....</p>

    return (
        <div className="bug-details main-content">
            <h2>Bug Details</h2>
            <div>
                <h3>{bug.title}</h3>
                <p className="severity">Severity: <span>{bug.severity}</span></p>
                <p><strong>Description:</strong> {bug.description || 'No description provided'}</p>
            </div>
            <Link to="/bug">
                <button>Back to List</button>
            </Link>
        </div>
    )
}
