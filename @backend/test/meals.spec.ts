import { test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Meals routes', () => {

  beforeAll(async () => {
    await app.ready()
   })
   
   afterAll(async () => {
     await app.close()
    })

    beforeEach(() => {
      execSync('npm run knex migrate:rollback --all')
      execSync('npm run knex migrate:latest')
    })

    //First test--------------------------------------------------------
   
   test('Should be able to create a new Meal', async () => {
     await request(app.server).post('/meals').send({
       name: 'New Name',
       description: 'New description',
       isDiet: "no"
     })
     .expect(201)
   })

    //Secound test--------------------------------------------------------

   test('Should be able to list all Meals', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New Name',
      description: 'New description',
      isDiet: "no"
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    // O teste abaixo verifica se o body enviado pelo teste é o que realmente recebeu

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New Name',
        description: 'New description',
        isDiet: "no"
      })
    ])
  })

    //Third test--------------------------------------------------------

  test('Should be able to get a specific Meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New Name',
      description: 'New description',
      isDiet: "no"
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealsResponse = await request(app.server)
    .get(`/meals/${mealId}`)
    .set('Cookie', cookies)
    .expect(200)

    // O teste abaixo verifica se o body enviado pelo teste é o que realmente recebeu

    expect(getMealsResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'New Name',
        description: 'New description',
        isDiet: "no"
      })
    )
  })
})

