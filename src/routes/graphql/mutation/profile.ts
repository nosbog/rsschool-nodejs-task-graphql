import {GraphQLString, GraphQLNonNull} from "graphql/index.js";
import {UUIDType} from "../types/uuid.js";
import { Profile} from "@prisma/client";
import {Context} from "../types/context.js";
import {ProfileType} from "../query/types/profile.js";
import {
    ChangeProfileInputType,
    ChangeProfileType,
    CreateProfileInputType,
    CreateProfileType,
    DeleteProfileType
} from "./types/profile.js";

export const profileMutationType = {
    createProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
            dto: { type: new GraphQLNonNull(CreateProfileInputType) }
        },
        resolve: async (_parent: unknown, args: CreateProfileType, context: Context )=> {
            const { isMale, yearOfBirth, memberTypeId, userId } = args.dto

            if (!isMale || !yearOfBirth || !memberTypeId || !userId) {
                return 'There are 4 required fields: isMale, yearOfBirth, memberTypeId, userId'
            }

            const yearRegex = /^\d{4}$/

            if (!yearRegex.test(yearOfBirth.toString())) {
                return 'Year is wrong'
            }

            try {
                const profile: Omit<Profile, 'id'> = {
                    isMale,
                    yearOfBirth,
                    userId,
                    memberTypeId,
                } ;
                return await context.prisma.profile.create({ data: {...profile}})
            } catch (error) {
                console.error('Profile was not created')
            }

        }
    },
    changeProfile: {
        type:  new GraphQLNonNull(ProfileType),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: new GraphQLNonNull(ChangeProfileInputType)}
        },
        resolve: async (_parent: unknown, args: ChangeProfileType, context: Context,)=> {
            const { isMale, yearOfBirth, memberTypeId } = args.dto

            if (!isMale || !yearOfBirth || !memberTypeId || !args.id) {
                return 'There are 4 required fields: isMale, yearOfBirth, memberTypeId, id'
            }

            const yearRegex = /^\d{4}$/

            if (!yearRegex.test(yearOfBirth.toString())) {
                return 'Year is wrong'
            }

            const profile: Omit<Profile, 'userId' | 'id'> = {
                isMale,
                yearOfBirth,
                memberTypeId,
            };

            try {
             await context.prisma.profile.update({
                    where: { id: args.id },
                    data: {...profile}
                })

                return {...profile, id: args.id}
            } catch (error) {
                console.error('Profile was not updated')
            }
        }
    },
    deleteProfile: {
        type:  new GraphQLNonNull(GraphQLString),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent: unknown, args: DeleteProfileType, context: Context) => {
            if (!args.id) {
                return 'There is 1 required field - id.'
            }

            try {
                await context.prisma.profile.delete({ where: { id: args.id } })
                return "Profile successfully deleted"
            }catch (error) {
                console.error('Profile was not deleted')
            }
        }
    },
}
