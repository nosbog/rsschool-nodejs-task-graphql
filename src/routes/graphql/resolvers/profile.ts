const resolver = {
  Query: {
    profiles: async (a: any, b: any, context: any, d: any) => {
      const profiles = await context.db.profiles.findMany();
      return profiles;
    },
  },
};

export default resolver;
