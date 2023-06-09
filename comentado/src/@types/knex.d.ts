import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string,
      name: string,
      description: string,
      created_at: string,
      isDiet: string,
      session_id?: string
    }
  }
}