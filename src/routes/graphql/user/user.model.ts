import { PostModel } from '../post/post.model.js';
import { ProfileModel } from '../profile/profile.model.js';

type SubscriptionModel = {
  subscriberId: string;
  authorId: string;
};

export type UserModel = {
  id: string;
  name: string;
  balance: number;
  profile?: ProfileModel;
  posts?: PostModel[];
  userSubscribedTo?: SubscriptionModel[];
  subscribedToUser?: SubscriptionModel[];
};
