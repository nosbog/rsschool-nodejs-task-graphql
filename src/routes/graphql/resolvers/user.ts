import { validate as uuidValidate } from 'uuid';
import { GraphQLError } from 'graphql';

import DB from '../../../utils/DB/DB';

interface Context {
  db: DB;
}

interface Args {
  id: string;
}

const resolver = {
  Query: {
    async users(root: unknown, args: unknown, context: Context) {
      const users = await context.db.users.findMany();
      return users;
    },
    async user(root: unknown, args: Args, context: Context) {
      if (uuidValidate(args.id)) {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!user) {
          return new GraphQLError('user not found');
        }

        return user;
      }

      return new GraphQLError('invalid user id');
    },
  },
};

export default resolver;
