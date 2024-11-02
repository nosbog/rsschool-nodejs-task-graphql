import {UserType} from "../query/types/user.js";
import {GraphQLString, GraphQLNonNull} from "graphql/index.js";
import {UUIDType} from "../types/uuid.js";
import {User} from "@prisma/client";
import {Context} from "../types/context.js";
import {ChangeUserInputType, ChangeUserType, CreateUserInputType, CreateUserType, DeleteUserType} from "./types/user.js";

export const userMutationType = {
    createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
            dto: { type: new GraphQLNonNull(CreateUserInputType) }
        },
        resolve: async (_parent: unknown, args: CreateUserType, context: Context)=> {
            const { name, balance } = args.dto

            if (!name || !balance) {
                throw new Error("There are 2 required fields: { name, balance }.")
            }

            try {
                const user: Pick<User, 'name' | 'balance'> = {
                    name,
                    balance,
                };
                await context.prisma.user.create({ data: user})
                return user
            } catch (e) {
                throw new Error("User was nor created")
            }
        }
    },
    changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: new GraphQLNonNull(ChangeUserInputType)}
        },
        resolve: async (_parent: unknown, args: ChangeUserType, context: Context)=> {
            const { name, balance } = args.dto

            if (!name || !balance || !args.id)  {
                throw new Error("There are 3 required fields: { name, balance }, id")
            }

            try {
                const user: Pick<User, 'name' | 'balance'> = {
                    name,
                    balance,
                };

               return await context.prisma.user.update({
                    where: { id: args.id },
                    data: user
                })
            } catch (e) {
                throw new Error( "User was not updated")
            }
        }
    },
    deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent: unknown,  args: DeleteUserType, context: Context) => {
            if (!args.id) {
                throw new Error( 'There is 1 required field - id.')
            }

            try {
                await context.prisma.user.delete({ where: { id: args.id } })
                return "User successfully deleted"
            } catch (e) {
                throw new Error("User was not deleted")
            }

        }
    },
}
