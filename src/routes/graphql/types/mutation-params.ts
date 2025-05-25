export type CreateUserParams = {
  name: string;
  balance: number;
}

export type ChangeUserParams = Partial<CreateUserParams> & {
  id:string;
}

export type UserSubscribedParams = {
  userId: string;
  authorId: string;
}

export type CreatePostParams = {
  title: string;
  content: string;
  authorId: string;
}

export type ChangePostParams = Partial<Omit<CreatePostParams, 'authorId'>>;


export type CreateProfileParams = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
};

export type ChangeProfileParams = Partial<Omit<CreateProfileParams, 'userId'>>;