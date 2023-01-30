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
    profiles: async (root: unknown, args: unknown, context: Context) => {
      const profiles = await context.db.profiles.findMany();
      return profiles;
    },
    async profile(root: unknown, args: Args, context: Context) {
      if (uuidValidate(args.id)) {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!profile) {
          return new GraphQLError('profile not found');
        }

        return profile;
      }

      return new GraphQLError('invalid profile id');
    },
  },
};

export default resolver;
