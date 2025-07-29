const axios = window.axios

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            // Client-side filtering
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    const url = BASE_URL + bugId + '/remove'
    return axios.get(url)
}

function save(bug) {
    let queryParams = `?title=${encodeURIComponent(bug.title)}&description=${encodeURIComponent(bug.description)}&severity=${bug.severity}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(BASE_URL + 'save/' + queryParams)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}
