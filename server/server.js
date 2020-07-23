/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'

import axios from 'axios'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises

const port = process.env.PORT || 3000
const server = express()

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

const usersFile = `${__dirname}/users.json`

const writeUsersFile = async (text) =>
  writeFile(usersFile, JSON.stringify(text), { encoding: 'utf8' })

const deleteUsersFile = async () => unlink(usersFile)

const readUsersFile = async () => {
  const fd = await readFile(usersFile, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        const resData = axios('https://jsonplaceholder.typicode.com/users')
          .then(({ data }) => {
            writeUsersFile(data)
            return data
          })
          // eslint-disable-next-line no-console
          .catch((errAxios) => console.log(`Error in axios: ${errAxios}`))
        return resData
      }
      return err
    })
  return fd
}

server.use('/api/v1/*', (req, res, next) => {
  res.set('x-skillcrucial-user', '15ef5221-bff1-11e9-954d-2f6ce28e9166')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users', async (req, res) => {
  const usersData = await readUsersFile()
  // res.set('x-skillcrucial-user', '15ef5221-bff1-11e9-954d-2f6ce28e9166')
  // res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.json(usersData)
})

server.post('/api/v1/users', async (req, res) => {
  const usersData = await readUsersFile()
  const newUserId = usersData[usersData.length - 1].id + 1
  const dataToWrite = [...usersData, { id: newUserId, ...req.body }]
  writeUsersFile(dataToWrite)
  const responseBody = { status: 'success', id: newUserId }
  res.json(responseBody)
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const usersData = await readUsersFile()
  const newUserId = parseInt(req.params.userId, 10)
  // const dataToWrite = [...usersData, { id: newUserId, ...req.body }]
  const dataToWrite = usersData.map((it) => {
    if (it.id === newUserId) {
      // {id:1, name: "Leanne Graham", username: "Bret"} { name: "Elvis", surname: "Presley" }
      return { ...it, ...req.body }
    }
    return it
  })
  writeUsersFile(dataToWrite)
  const responseBody = { status: 'success', id: newUserId }
  res.json(responseBody)
})

server.delete('/api/v1/users', async (req, res) => {
  deleteUsersFile()
  const responseBody = { status: 'success' }
  res.json(responseBody)
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const usersData = await readUsersFile()
  const userIdToDelete = req.params.userId
  const dataToWrite = usersData.filter((it) => it.id !== parseInt(userIdToDelete, 10))
  writeUsersFile(dataToWrite)
  const responseBody = { status: 'success', id: userIdToDelete }
  res.json(responseBody)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.listen(port)

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
