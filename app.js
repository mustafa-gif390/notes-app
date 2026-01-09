import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'YOUR_SUPABASE_URL'      // Supabase URL copy karein
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY' // Supabase anon key copy karein
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('note-form')
const notesContainer = document.getElementById('notes-container')

// Fetch notes from Supabase
async function fetchNotes() {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) return console.log(error)

    notesContainer.innerHTML = ''
    data.forEach(note => {
        const div = document.createElement('div')
        div.className = 'note'
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote('${note.id}')">Delete</button>
        `
        notesContainer.appendChild(div)
    })
}

// Add note
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const content = document.getElementById('content').value

    await supabase.from('notes').insert([{ title, content }])
    form.reset()
    fetchNotes()
})

// Delete note
window.deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
}

// Initial fetch
fetchNotes()
