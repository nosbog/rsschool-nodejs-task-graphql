const resolver = {
  // Us
  Query: {
    users: async (a: any, b: any, context: any, d: any) => {
      const users = await context.db.users.findMany();
      return users;
    },
  },
};

export default resolver;
