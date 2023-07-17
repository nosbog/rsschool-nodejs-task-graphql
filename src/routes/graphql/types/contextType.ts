import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';
import { MemberType, Post, Profile, User } from './entityTypes.js';

export interface ContextType {
  fastify: FastifyInstance;
  dataLoader: {
    getUserPostsLoader: DataLoader<string, Post[], string>;
    getUserProfilesLoader: DataLoader<string, Profile, string>;
    getProfileMemberType: DataLoader<string, MemberType, string>;
    getUserSubscribedTo: DataLoader<string, User[], string>;
    getUserSubscribedToUser: DataLoader<string, User[], string>;
  };
}
