
export type UserModel = {
    id: string;
    name: string;
    balance: number;
    profile?: ProfileModel;
    posts?: PostModel[];
  };
  
  export type ProfileModel = {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
    memberType?: MemberTypeModel;
  };
  
  export type PostModel = {
    id: string;
    title: string;
    content: string;
    authorId: string;
  };
  
  export type MemberTypeModel = {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
  };

  export type PostDto = {
    title: string;
    content: string;
    authorId: string;
  };
  
  export type UserDto = {
    name: string;
    balance: number;
  };
  
  export type ProfileDto = {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: 'basic' | 'business';
    userId: string;
  };
  