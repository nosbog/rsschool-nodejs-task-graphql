const schema = `
schema {
    query: RootQueryType
    mutation: Mutations
}

input ChangePostInput {
    title: String
    content: String
}

input ChangeProfileInput {
    isMale: Boolean
    yearOfBirth: Int
    memberTypeId: MemberTypeId
}

input ChangeUserInput {
    name: String
    balance: Float
}

input CreatePostInput {
    title: String!
    content: String!
    authorId: UUID!
}

input CreateProfileInput {
    isMale: Boolean!
    yearOfBirth: Int!
    userId: UUID!
    memberTypeId: MemberTypeId!
}

input CreateUserInput {
    name: String!
    balance: Float!
}

type MemberType {
    id: MemberTypeId!
    discount: Float!
    postsLimitPerMonth: Int!
}

enum MemberTypeId {
    BASIC
    BUSINESS
}

type Post {
    id: UUID!
    title: String!
    content: String!
}

type Profile {
    id: UUID!
    isMale: Boolean!
    yearOfBirth: Int!
    memberType: MemberType!
}

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

scalar UUID
`;

export default schema;
