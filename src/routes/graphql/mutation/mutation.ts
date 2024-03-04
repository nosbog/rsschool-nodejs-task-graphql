import { GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { postFields } from './fields/postFields.js';
import { profileFields } from './fields/profileFields.js';
import { userFields } from './fields/userFields.js';
import { subscribeFields } from './fields/subscribeFields.js';

export const MutationType = new GraphQLObjectType<string, { prisma: PrismaClient }>({
  name: '',
  fields: () => ({
    ...postFields,
    ...profileFields,
    ...userFields,
    ...subscribeFields,
  }),
});