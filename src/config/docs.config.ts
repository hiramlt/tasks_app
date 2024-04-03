import type express from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi, { type JsonObject } from 'swagger-ui-express'
import path from 'path'
import { dirname } from '../utils/utils'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TasksApp',
      description: 'Tasks app API documentation',
      version: '1.0.0'
    }
  },
  apis: [path.join(dirname, '../..', 'docs', '**', '*.yaml')]
}

export const specs: JsonObject = swaggerJsDoc(options)

export const swaggerServe: express.RequestHandler[] = swaggerUi.serve

export const swaggerSetup: express.RequestHandler = swaggerUi.setup(specs)
