import { IResolvers } from '@graphql-tools/utils';
import { merge } from 'lodash';

import User from './resolvers/user';
import Post from './resolvers/post';
import Profile from './resolvers/profile';
import MemberType from './resolvers/memberType';

const resolverMap: IResolvers = merge(User, Post, Profile, MemberType);

export default resolverMap;
