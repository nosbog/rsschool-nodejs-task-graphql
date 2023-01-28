import { validate as isValidUuid } from 'uuid';
import { FastifyInstance } from 'fastify';

export class BaseValidator {
  public static existenceValidation = (entity: any, fastifyInstance: FastifyInstance): void => {
    if (!entity) {
      throw fastifyInstance.httpErrors.notFound('Not found.');
    }
  };

  public static uuidValidation = (uuid: string, fastifyInstance: FastifyInstance): void => {
    if (!isValidUuid(uuid)) {
      throw fastifyInstance.httpErrors.badRequest('Invalid uuid.');
    }
  };
}
