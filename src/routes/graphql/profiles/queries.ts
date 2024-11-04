import { GraphQLList, GraphQLNonNull } from 'graphql';

import { Context, idFieldType } from '../types/util.js';
import { ProfileType } from '../types/profiles.js';

export const ProfileQueries = {
    profile: {
        type: ProfileType,
        args: {
            ...idFieldType,
        },
        resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
            return db.profile.findUnique({ where: { id } });
        },
    },
    profiles: {
        type: new GraphQLNonNull(new GraphQLList(ProfileType)),
        resolve: async (_: unknown, __: unknown, { db }: Context) => {
            return db.profile.findMany();
        },
    },
};