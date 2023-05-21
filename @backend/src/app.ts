import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

import { mealsRoutes } from './routes/meals';

export const app = fastify()

app.register(cors, { 
  origin: "*",
  methods: ["*"],
  allowedHeaders: '*'
})

app.register(cookie)

app.register(mealsRoutes, {
  prefix: 'meals'
})

