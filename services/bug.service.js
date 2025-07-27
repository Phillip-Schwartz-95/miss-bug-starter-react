const BASE_URL = 'http://127.0.0.1:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

function query(filterBy) {
    return fetch(BASE_URL, {
        method: 'GET',
        credentials: 'include', // for using cookies
    })
        .then(res => res.json())
        .then(bugs => {
            if (!filterBy) return bugs

            let filteredBugs = bugs

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
            }

            if (filterBy.minSeverity) {
                filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return filteredBugs
        })
}

function getById(bugId) {
    return fetch(`${BASE_URL}/${bugId}`, {
        method: 'GET',
        credentials: 'include', // cookies
    }).then(res => res.json())
}

function remove(bugId) {
    return fetch(`${BASE_URL}/${bugId}/remove`, {
        method: 'GET',
        credentials: 'include', // cookies
    }).then(res => res.json())
}

function save(bug) {
    const queryParams = new URLSearchParams()

    if (bug._id) queryParams.append('_id', bug._id)
    queryParams.append('title', bug.title)
    queryParams.append('severity', bug.severity)
    queryParams.append('description', bug.description || '')

    return fetch(`${BASE_URL}/save?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include', // cookies
    }).then(res => res.json())
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}
