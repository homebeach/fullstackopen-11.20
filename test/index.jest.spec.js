import request from 'supertest'
import { server } from '../index.js'
import Person from '../models/person.js'

jest.mock('../models/person', () => {
  const actualModule = jest.requireActual('../models/person')
  return {
    __esModule: true,
    default: {
      ...actualModule,
      find: jest.fn(),
      findById: jest.fn(),
      countDocuments: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndRemove: jest.fn(),
      create: jest.fn(),
    }
  }
})

jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose')
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue(),
    connection: {
      close: jest.fn().mockResolvedValue(),
    },
  }
})


beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

afterAll(async () => {
  server.close()
})

describe('API tests for /api/persons', () => {
  it('GET /api/persons - should return all persons', async () => {
    Person.find.mockResolvedValue([{ content: 'Alice', number: '123-456' }, { content: 'Bob', number: '234-567' }])

    const response = await request(server).get('/api/persons')
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('GET /api/persons/:id - should return a single person', async () => {
    const singlePerson = { content: 'Alice', number: '123-456' }
    Person.findById.mockResolvedValue(singlePerson)

    const response = await request(server).get('/api/persons/1')
    expect(response.status).toBe(200)
    expect(response.body.content).toBe('Alice')
  })

  it('PUT /api/persons/:id - should update an existing person', async () => {
    const updatedPerson = { content: 'Alice Updated', number: '123-456' }
    Person.findByIdAndUpdate.mockResolvedValue(updatedPerson)

    const response = await request(server).put('/api/persons/1').send(updatedPerson)
    expect(response.status).toBe(200)
    expect(response.body.content).toBe('Alice Updated')
  })

  it('DELETE /api/persons/:id - should delete a person', async () => {
    Person.findByIdAndRemove.mockResolvedValue({})

    const response = await request(server).delete('/api/persons/1')
    expect(response.status).toBe(204)
  })

  it('GET /api/info - should return count of persons and current date', async () => {
    const countMock = 2
    Person.countDocuments.mockResolvedValue(countMock)

    const response = await request(server).get('/api/info')
    expect(response.status).toBe(200)
    expect(response.text).toContain('Phonebook has info for')
    expect(response.text).toContain('people')
  })

  it('GET /unknown - should return 404 for unknown endpoint', async () => {
    const response = await request(server).get('/unknown')
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('unknown endpoint')
  })
})
