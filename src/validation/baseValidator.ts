import { validate as isValidUuid } from 'uuid';
import { FastifyInstance } from 'fastify';
import type { UserEntity } from '../utils/DB/entities/DBUsers';

export class Validator {
  public static existenceValidation = (
    entity: any,
    fastifyInstance: FastifyInstance,
    isBadRequest: boolean = false,
  ): void => {
    if (!entity) {
      throw isBadRequest ? fastifyInstance.httpErrors.badRequest('Bad request.') : fastifyInstance.httpErrors.notFound('Not found.');
    }
  };

  public static uuidValidation = (uuid: string, fastifyInstance: FastifyInstance): void => {
    if (!isValidUuid(uuid)) {
      throw fastifyInstance.httpErrors.badRequest('Invalid uuid.');
    }
  };

  public static sameUserIdsValidation = (
    id1: UserEntity,
    id2: UserEntity,
    fastifyInstance: FastifyInstance,
  ) => {
    if (id1 === id2) {
      throw fastifyInstance.httpErrors.badRequest('Aboba.');
    }
  };

  public static userAlreadySubscribedValidation = (
    user1: UserEntity,
    user2: UserEntity,
    fastifyInstance: FastifyInstance,
  ) => {
    if (user2.subscribedToUserIds.includes(user1.id)) {
      throw fastifyInstance.httpErrors.badRequest('Aboba.');
    }
  };

  public static userHasNoSubscribeToUserValidation = (
    user1: UserEntity,
    user2: UserEntity,
    fastifyInstance: FastifyInstance,
  ) => {
    if (!user2.subscribedToUserIds.includes(user1.id)) {
      throw fastifyInstance.httpErrors.badRequest('Aboba.');
    }
  };
}
