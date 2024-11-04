import { GraphQLNonNull } from 'graphql';

import { Context, idFieldType } from '../types/util.js';
import {
    ChangeProfileInput,
    CreateProfileInput,
    ProfileType,
} from '../types/profiles.js';
import { createProfileSchema } from '../../profiles/schemas.js';
import { Static } from '@sinclair/typebox';
import { UUIDType } from '../types/uuid.js';

export const ProfileMutations = {
    createProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: { dto: { type: CreateProfileInput } },
        resolve: async (
            _: unknown,
            { dto: data }: { dto: Static<(typeof createProfileSchema)['body']> },
            { db }: Context,
        ) => {
            return db.profile.create({ data });
        },
    },
    changeProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: { ...idFieldType, dto: { type: ChangeProfileInput } },
        resolve: async (
            _: unknown,
            {
                id,
                dto: data,
            }: { id: string; dto: Static<(typeof createProfileSchema)['body']> },
            { db }: Context,
        ) => {
            return db.profile.update({ where: { id }, data });
        },
    },
    deleteProfile: {
        type: UUIDType,
        args: { ...idFieldType },
        resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
            await db.profile.delete({ where: { id } });
            return id;
        },
    },
};