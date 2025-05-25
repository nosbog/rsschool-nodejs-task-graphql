import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { UserModel } from '../user/user.model.js';
import { MemberTypeModel } from '../member-type/member-type.model.js';
import { ProfileModel } from '../profile/profile.model.js';
import { PostModel } from '../post/post.model.js';

export type RequestContext = {
  prismaClient: PrismaClient;
  dataLoaders: {
    user: DataLoader<string, UserModel | undefined, string>;
    memberType: DataLoader<string, MemberTypeModel | undefined, string>;
    profile: DataLoader<string, ProfileModel | undefined, string>;
    profileByUser: DataLoader<string, ProfileModel | undefined, string>;
    post: DataLoader<string, PostModel | undefined, string>;
    postsByUser: DataLoader<string, PostModel[] | undefined, string>;
  };
};
