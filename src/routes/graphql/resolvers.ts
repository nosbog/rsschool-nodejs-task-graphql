// import { Grap} from 'graphql'
import {
  // GraphQLObjectType,
  // GraphQLSchema,
  // GraphQLList,
  // GraphQLString,
  GraphQLID, GraphQLInt, GraphQLList, GraphQLString,
} from 'graphql/type';
import { UserType, ProfileType, PostType, MemberType, UserByIdWithSubscribesAndPosts, PostInputType } from './graphql.types';
// import { GraphQLObjectType } from 'graphql';
import { UsersWithInfoType } from './graphql.types';
import { UsersWithSubscribesTo } from './graphql.types';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { UsersWithSubsAndSubscribesType } from './graphql.types';
import { ProfileInputType } from './graphql.types';
import DB from './../../utils/DB/DB';

export const getByOneResolvers = {
  user: {
    type: UserType,
    description: "Get one user",
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const user = await ctx.db.users.findOne({ key: "id", equals: args.id })
      return user
    }
  },
  profile: {
    type: ProfileType,
    description: "Get one profile",
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const profile = await ctx.db.profiles.findOne({ key: "id", equals: args.id })
      return profile
    }
  },
  post: {
    type: PostType,
    description: "Get one post",
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const post = await ctx.db.posts.findOne({ key: "id", equals: args.id })
      return post
    }
  },
  member: {
    type: MemberType,
    description: "Get one member type",
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const memberType = await ctx.db.memberTypes.findOne({ key: "id", equals: args.id })
      return memberType
    }
  },
}
export const getUsersWithTheirInfo = {
  usersWithInfo: {
    type: UsersWithInfoType,
    description: "Get users and all their posts,profiles and memberTypes",
    resolve: async (_: any, args: any, ctx: any) => {
      const users = ctx.db.users.findMany()
      const posts = ctx.db.posts.findMany()
      const profiles = ctx.db.profiles.findMany()
      const memberTypes = ctx.db.memberTypes.findMany()
      const usersWithInfo = {
        users,
        posts,
        profiles,
        memberTypes
      }
      return usersWithInfo
    }
  }
}
export const getUserByIdWithInfo = {
  getUserByIdWithInfo: {
    type: UsersWithInfoType,
    description: "Get users and all their posts,profiles and memberTypes",
    resolve: async (_: any, args: any, ctx: any) => {
      const users = ctx.db.users.findMany()
      const posts = ctx.db.posts.findMany()
      const profiles = ctx.db.profiles.findMany()
      const memberTypes = ctx.db.memberTypes.findMany()
      const usersWithInfo = {
        users,
        posts,
        profiles,
        memberTypes
      }
      return usersWithInfo
    }
  }
}

export const getUsersProfileWithSubscribes = {
  getUsersProfileWithSubscribes: {
    type: new GraphQLList(UsersWithSubscribesTo),
    description: "Get users profile with their subscribes to other users",
    resolve: async (_: any, args: any, ctx: any) => {
      const users: UserEntity[] = ctx.db.users.findMany()
      const profiles: ProfileEntity[] = ctx.db.profiles.findMany()
      const usersWithInfo: Array<{ userSubscribedTo: string[], profile: ProfileEntity }> = users.map(user => ({ userSubscribedTo: user.subscribedToUserIds, profile: profiles.filter(profile => profile.userId === user.id)[0] }))
      return usersWithInfo
    }
  }
}
export const getUserByIdWithSubscribesAndPosts = {
  getUsersProfileWithSubscribes: {
    type: UserByIdWithSubscribesAndPosts,
    description: "Get user by id with its subscribes and posts",
    args: {
      id: { type: GraphQLID }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const user: UserEntity = ctx.db.users.findOne({ key: "id", equals: args.id })
      const userSubs: UserEntity[] = ctx.db.users.findMany()
      const userPosts: PostEntity[] = ctx.db.posts.findMany()
      const filteredUserPosts = userPosts.filter(post => post.userId === user.id)
      const subscribedToUser: string[] = []
      userSubs.forEach(sub => {
        if (sub.subscribedToUserIds.includes(user.id)) {
          subscribedToUser.push(sub.id)
        }
      })
      const usersWithInfo: { subscribedToUser: string[], posts: PostEntity[] } = { subscribedToUser, posts: filteredUserPosts }
      return usersWithInfo
    }
  }
}

export const getUsersWithSubsAndSubscribes = {
  getUsersWithSubsAndSubscribes: {
    type: UsersWithSubsAndSubscribesType,
    description: "Get users by with its subscribes and subscriptions",
    resolve: async (_: any, args: any, ctx: any) => {
      const users: UserEntity[] = ctx.db.users.findMany()
      const filteredUsers = users.map(user => ({ userSubscribedTo: user.subscribedToUserIds, subscribedToUser: users.filter(subs => subs.subscribedToUserIds.includes(user.id)) }))
      return filteredUsers
    }
  }
}


export const createRequests = {
  createUser: {
    type: UserType,
    description: "Create a new user",
    args: {
      email: { type: GraphQLString },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, ctx: any) => {
      const createdUser = await ctx.db.users.create({ email: args.email, lastName: args.lastName, firstName: args.firstName })
      return createdUser
    }
  },
  createPost: {
    type: PostType,
    description: "Create a new post",
    args: {
      postInput: { type: PostInputType }
    },
    resolve: async (_: any, args: any, ctx: any) => await ctx.db.posts.create(args.postInput)
  },
  createProfile: {
    type: ProfileType,
    description: "Create a new profile",
    args: {
      profileInput: { type: ProfileInputType }
    },
    resolve: async (_: any, args: any, ctx: any) => await ctx.db.profiles.create(args.profileInput)
  }
}

export const updateRequests = {
  updateUser: {
    type: UserType,
    description: "Update fields in user",
    args: {
      id: { type: GraphQLID },
      email: { type: GraphQLString },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, ctx: { db: DB }) => {
      const newUserInfo = args
      delete newUserInfo.id
      const updatedUser = await ctx.db.users.change(args.id, args)
      return updatedUser
    }
  },
  updatePost: {
    type: PostType,
    description: "Update fields in post",
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      userId: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, ctx: { db: DB }) => {
      const newPostInfo = args
      delete newPostInfo.id
      const updatedPost = await ctx.db.posts.change(args.id, args)
      return updatedPost
    }
  },
  updateProfile: {
    type: ProfileType,
    description: "Update fields in profile",
    args: {
      id: { type: GraphQLID },
      avatar: { type: GraphQLString },
      sex: { type: GraphQLString },
      birthday: { type: GraphQLInt },
      country: { type: GraphQLString },
      street: { type: GraphQLString },
      city: { type: GraphQLString },
      userId: { type: GraphQLString },
      memberTypeId: {
        type: GraphQLString,
      },
    },
    resolve: async (_: any, args: any, ctx: { db: DB }) => {
      const newProfileInfo = args
      delete newProfileInfo.id
      const updatedProfile = await ctx.db.profiles.change(args.id, args)
      return updatedProfile
    }
  },
  updateMemberType: {
    type: MemberType,
    description: "Update fields in Member",
    args: {
      id: { type: GraphQLID },
      discount: { type: GraphQLInt },
      monthPostsLimit: { type: GraphQLInt },
    },
    resolve: async (_: any, args: any, ctx: { db: DB }) => {
      const newMemberTypeInfo = args
      delete newMemberTypeInfo.id
      const updatedMemberType = await ctx.db.memberTypes.change(args.id, args)
      return updatedMemberType
    }
  },
}