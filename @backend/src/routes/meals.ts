import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { z } from 'zod'
import { randomUUID } from "node:crypto"
import { knex } from "../database"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
import { format } from 'date-fns';


export async function mealsRoutes(app: FastifyInstance) {

  interface MealRecord {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    isDiet: 'yes' | 'no';
    session_id: string;
  }



    //Cria uma refeição

  app.post('/', async (request, reply) => {
    
        const createMealBodySchema = z.object({
          name: z.string(),
          description: z.string(),
          isDiet: z.enum(['yes', 'no']),
        })
    
        const { name, description, isDiet } = createMealBodySchema.parse(request.body)
    
        let { sessionId } = request.cookies    //Procura dentro dos cookies da requisição se ja existe sessionId
    
        if (!sessionId) {
          sessionId = randomUUID()
    
          reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days - clean code
          })
        }
    
        await knex<MealRecord>('meals').insert({
          id: randomUUID(),
          created_at: format(new Date(), "yyyy/MM/dd HH:mm:ss"),
          updated_at: format(new Date(), "yyyy/MM/dd HH:mm:ss"),
          name,
          description,
          isDiet,
          session_id: sessionId,
        })
    
        return reply.status(201).send({ message:  'Meal created successfully' })
  })


  
    //Lista todas as refeições

  app.get('/', {
    preHandler: [checkSessionIdExists],
  },
  async (request) => {
    let { sessionId } = request.cookies

    const meals = await knex('meals')
    .where('session_id', sessionId)
    .select()

    return { meals }
  })



    //Lista uma refeição por id

  app.get('/:id', {
    preHandler: [checkSessionIdExists],
  },
  async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params) 

    let { sessionId } = request.cookies

    const meal = await knex('meals')
    .where({
      session_id: sessionId,
      id,
    })
    .first()

    return { meal }
  })


  
    //Lista todas as refeições dentro da dieta

  app.get('/diet', {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
    let { sessionId } = request.cookies
    const dieta = await knex('meals')
    .where("isDiet", "yes")
    .andWhere({
      session_id: sessionId
    })
    .select('*')

    return { dieta }
  })



    //Lista todas as refeições fora da dieta

  app.get('/nodiet', {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
    let { sessionId } = request.cookies
    const nodieta = await knex('meals')
    .where("isDiet", "no")
    .andWhere({
      session_id: sessionId
    })
    .select('*')

    return { nodieta }
  })



    //Deleta uma refeição por id

  app.delete('/:id', {
    preHandler: [checkSessionIdExists],
  },
  async (request, reply: FastifyReply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params) 

    let { sessionId } = request.cookies

    await knex('meals')
    .where({
      session_id: sessionId,
      id,
    })
    .delete()

    return reply.send({ message:  'Meal deleted successfully' });
  })
  

  
    // Altera por inteiro uma refeição por ID

  app.put('/:id', {
    preHandler: [checkSessionIdExists],
  },
  async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    });
  
    const updateMealBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      isDiet: z.enum(['yes', 'no']).optional(),
    });
  
    try {
      const { id } = updateMealParamsSchema.parse(request.params);
      const { name, description, isDiet } = updateMealBodySchema.parse(request.body);
  
      let { sessionId } = request.cookies;
  
      const existingMeal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first();
  
      if (!existingMeal) {
        return reply.status(404).send({ error: 'Meal not found' });
      }

      if (name === undefined || description === undefined || isDiet === undefined) {
        return reply.status(400).send({ error: 'Faltam informações necessárias para a atualização' });
      }
  
      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .update({
          name,
          description,
          isDiet,
        });
  
      return reply.status(200).send({ message: 'Refeição atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });


    //Altera parcialmente uma refeição por id

  app.patch('/:id', {
    preHandler: [checkSessionIdExists],
  },
  async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    });
  
    const updateMealBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      isDiet: z.enum(['yes', 'no']).optional(),
    });
  
    try {
      const { id } = updateMealParamsSchema.parse(request.params);
      const { name, description, isDiet } = updateMealBodySchema.parse(request.body);
  
      let { sessionId } = request.cookies;
  
      const existingMeal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first();
  
      if (!existingMeal) {
        return reply.status(404).send({ error: 'Meal not found' });
      }
  
      const updatedMeal = {
        ...existingMeal,
        name: name || existingMeal.name,
        description: description || existingMeal.description,
        isDiet: isDiet || existingMeal.isDiet,
        updated_at: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
      };
  
      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .update(updatedMeal);
  
      return reply.status(200).send({ message: 'Refeição atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });



    //Altera parcialmente uma refeição por id

  app.get('/most-diet-day', async (request, reply) => {
      try {
        const mostDietDay = await knex('meals')
          .select('created_at')
          .count('* as totalMeals')
          .where('isDiet', 'yes')
          .groupBy('created_at')
          .orderByRaw('COUNT(*) DESC')
          .first();
    
        return reply.status(200).send({ mostDietDay });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'Erro interno do servidor' });
      }
  });
}