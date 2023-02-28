require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note')

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true
//   }
// ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  })
});

app.get('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id);

  // const note = notes.find(note => {
  //     console.log(note.id, typeof note.id, id, typeof id, note.id ===id);
  //     return note.id === id;
  // })
  // if (note) {
  //     response.json(note)
  // } else {
  //     response.status(404).end()
  // }

  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      // console.log(error)
      // response.status(400).send({error: 'malformatted id'})
      next(error)
    })

});

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // notes = notes.filter(note => note.id !== id);

  // response.status(204).end();
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
//   return maxId + 1;
// }

app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id!' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on Port ${PORT}`);
