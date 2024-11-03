import { MemberResolver } from "./member.js";
import { PostResolver } from "./post.js";
import { UserResolver } from "./user.js";

export const rootValue = {
  ...UserResolver,
  ...PostResolver,
  ...MemberResolver,
};
