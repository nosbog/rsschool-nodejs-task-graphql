    import { Type } from '@fastify/type-provider-typebox';
    import { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLScalarType } from 'graphql';
    import { UUIDType } from './types/uuid.js';
    import {MemberTypeId, MemberType} from './types/member-type.js';
    import { ChangeUserInput, CreateUserInput, User } from './types/user.js';
    import { ChangePostInput, CreatePostInput, Post } from './types/post.js';
    import { ChangeProfileInput, CreateProfileInput, Profile } from './types/profile.js';

    export const gqlResponseSchema = Type.Partial(
      Type.Object({
        data: Type.Any(),
        errors: Type.Any(),
      }),
    );  

    export const createGqlResponseSchema = {
      body: Type.Object(
        {
          query: Type.String(),
          variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
        },
        {
          additionalProperties: false,
        },
      ),
    };


    const RootQuery  = new GraphQLObjectType({
      name: 'RootQuery',
      fields: {

        memberTypes: {
          type: new GraphQLList(MemberType),
          async resolve (parent, {id}, context) {

            const  res = await context.prisma.memberType.findMany();

            return res;
          }
        },
        memberType: {
          type: MemberType,
          args: {
            id: {type: new GraphQLNonNull(MemberTypeId)}
          },

          async resolve (parent, { id }, context, ) {

            const res = await context.prisma.memberType.findUnique({
              where: {
                id: id,
              },
            });
            return res;
        
          }
        },

        posts: {
          type: new GraphQLList(Post),
          async resolve (parent, {id}, context) {
            const res = await context.prisma.post.findMany();

            return res;
          }

        },
        post: {
          type: Post,
          args: { 
            id: { type: new GraphQLNonNull(UUIDType) } 
          },
                
          resolve: async (parent, { id }, context) => {

            const res = await context.prisma.post.findFirst({
              where: {
                id: id,
              },
            });

            return res;

          },
        },

        users: {
          type: new GraphQLList(User),

          async resolve (parent, {id}, context, info) {
            
            const res = await context.prisma.user.findMany({
              include: {profile: true}
            });

            return res;
          }
        },
        user: {
          type: User,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (parent, { id }, context) => {

            const user =  await context.prisma.user.findFirst({
              where: {
                id: id,
              },
            });
            return user;
          },
        },
        
        profiles: {
          type: new GraphQLList(Profile),
          async resolve (parent, {id}, context) {
            const res = await context.prisma.profile.findMany();

            return res;
          }
        },
        profile: {
          type: Profile,
          args: { 
            id: { type: new GraphQLNonNull(UUIDType) } 
          },
          resolve: async (parent, { id }, context) => {

            const res = await context.prisma.profile.findUnique({
              where: {
                id: id,
              },
            });

            return res;
          },
        },

      }
    })

    const RootMutation = new GraphQLObjectType({
      name: 'RootMutation',
      fields: {
        createPost: {
          type: Post,
          args: {
            dto: { type: CreatePostInput }
          },
          async resolve (parent, { dto: data }, context) {

            const  res = await context.prisma.post.create({ data });

            return res;
          }

        },
        deletePost: {
          type: UUIDType,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) }
          },
          async resolve (parent, { id }, context) {
            try { 
              const  res = await context.prisma.post.delete({ where: { id }});

              return id;
            } catch {
              return null;
            }
          }
          
        },
        changePost: {
          type: Post,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: ChangePostInput }
          },
          async resolve (parent, { id, dto: data }, context) {
            try { 
              const  res = await context.prisma.post.update({ 
                where: { id },
                data
              });

              return res;
            } catch {
              return null;
            }
          }
                
        },

        createUser: {
          type: User,
          args: {
            dto: { type: CreateUserInput }
          },
          async resolve (parent, { dto: data }, context) {

            const  res = await context.prisma.user.create({ data });

            return res;
          }

        },
        deleteUser: {
          type: UUIDType,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) }
          },
          async resolve (parent, { id }, context) {
            try { 
              const  res = await context.prisma.user.delete({ where: { id }});

              return id;
            } catch {
              return null;
            }
          }
          
        },
        changeUser: {
          type: User,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: ChangeUserInput }
          },
          async resolve (parent, { id, dto: data }, context) {
            try { 
              const  res = await context.prisma.user.update({ 
                where: { id },
                data
              });

              return res;
            } catch {
              return null;
            }
          }
                
        },

        createProfile: {
          type: Profile,
          args: {
            dto: { type: CreateProfileInput }
          },
          async resolve (parent, { dto: data }, context) {

            const  res = await context.prisma.profile.create({ data });

            return res;
          }

        },
        deleteProfile: {
          type: UUIDType,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) }
          },
          async resolve (parent, { id }, context) {
            try { 
              const  res = await context.prisma.profile.delete({ where: { id }});

              return id;
            } catch {
              return null;
            }
          }
          
        },
        changeProfile: {
          type: Post,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: ChangeProfileInput }
          },
          async resolve (parent, { id, dto: data }, context) {
            try { 
              const  res = await context.prisma.profile.update({ 
                where: { id },
                data
              });

              return res;
            } catch {
              return null;
            }
          }
                
        },

        subscribeTo: {
          type: User,
          args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType) },
          },
          async resolve (parent, { userId: id, authorId }, context) {
            try { 

              const  res = await context.prisma.user.update({ 
                where: { id },
                data: { userSubscribedTo: { create: { authorId } } },
              });
              
              return res;
            } catch {
              return null;
            }
          }
          
        },

        unsubscribeFrom: {
          type: GraphQLString,
          args: {
            userId: { type: UUIDType },
            authorId: { type: UUIDType },
          },
          async resolve (parent, { userId: subscriberId, authorId }, context) {
            try { 
              const  res = await context.prisma.subscribersOnAuthors.delete({
                where: { subscriberId_authorId: { subscriberId, authorId } },
              });

              return authorId;
      
            } catch {
              return null;
            }
          }

        }

      },
    });

    export const gqlSchema = new GraphQLSchema({
      query: RootQuery,
      mutation: RootMutation 
    });
