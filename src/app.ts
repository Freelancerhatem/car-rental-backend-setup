import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import routes from './app/router/Routes';
const app: Application = express()

app.use(express.json())
app.use(cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
routes.forEach(route => app.use(route.path, route.router))



export default app