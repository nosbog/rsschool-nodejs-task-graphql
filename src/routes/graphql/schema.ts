import { buildSchema } from 'graphql';
export const schema = buildSchema(`
  scalar UUID

  enum MemberTypeId {
    BASIC
    BUSINESS
  }

  input CreateUserInput { name: String!, balance: Float! }
  input CreateProfileInput { isMale: Boolean!, yearOfBirth: Int!, userId: UUID!, memberTypeId: MemberTypeId! }
  input CreatePostInput { title: String!, content: String!, authorId: UUID! }
  input ChangeUserInput { name: String, balance: Float }
  input ChangeProfileInput { isMale: Boolean, yearOfBirth: Int, memberTypeId: MemberTypeId }
  input ChangePostInput { title: String, content: String }

  type MemberType { id: MemberTypeId!, discount: Float!, postsLimitPerMonth: Int! }
  type Post { id: UUID!, title: String!, content: String! }
  type Profile { id: UUID!, isMale: Boolean!, yearOfBirth: Int!, memberType: MemberType! }
  type User {
    id: UUID!
    name: String!
    balance: Float!
    profile: Profile
    posts: [Post!]!
    userSubscribedTo: [User!]!
    subscribedToUser: [User!]!
  }

  type RootQueryType {
    memberTypes: [MemberType!]!
    memberType(id: MemberTypeId!): MemberType
    users: [User!]!
    user(id: UUID!): User
    posts: [Post!]!
    post(id: UUID!): Post
    profiles: [Profile!]!
    profile(id: UUID!): Profile
  }

  type Mutations {
    createUser(dto: CreateUserInput!): User!
    createProfile(dto: CreateProfileInput!): Profile!
    createPost(dto: CreatePostInput!): Post!
    changePost(id: UUID!, dto: ChangePostInput!): Post!
    changeProfile(id: UUID!, dto: ChangeProfileInput!): Profile!
    changeUser(id: UUID!, dto: ChangeUserInput!): User!
    deleteUser(id: UUID!): String!
    deletePost(id: UUID!): String!
    deleteProfile(id: UUID!): String!
    subscribeTo(userId: UUID!, authorId: UUID!): String!
    unsubscribeFrom(userId: UUID!, authorId: UUID!): String!
  }

  schema {
    query: RootQueryType
    mutation: Mutations
  }
`);
