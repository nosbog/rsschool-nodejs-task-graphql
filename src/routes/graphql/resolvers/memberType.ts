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
    memberTypes: async (root: unknown, args: unknown, context: Context) => {
      const memberTypes = await context.db.memberTypes.findMany();
      return memberTypes;
    },
    async memberType(root: unknown, args: Args, context: Context) {
      const memberType = await context.db.memberTypes.findOne({
        key: 'id',
        equals: args.id,
      });

      if (!memberType) {
        return new GraphQLError('member type not found');
      }

      return memberType;
    },
  },
};

export default resolver;
