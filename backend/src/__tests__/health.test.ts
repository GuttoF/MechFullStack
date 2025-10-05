import request from 'supertest'
import express from 'express'

const app = express()
app.get('/', (_req, res) => res.send('API Working'))

describe('health', () => {
  it('GET / should respond', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toContain('API Working')
  })
})
