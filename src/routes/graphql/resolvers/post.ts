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
    posts: async (root: unknown, args: unknown, context: Context) => {
      const posts = await context.db.posts.findMany();
      return posts;
    },
    async post(root: unknown, args: Args, context: Context) {
      if (uuidValidate(args.id)) {
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!post) {
          return new GraphQLError('post not found');
        }

        return post;
      }

      return new GraphQLError('invalid post id');
    },
  },
};

export default resolver;
