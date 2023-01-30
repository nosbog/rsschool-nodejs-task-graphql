const resolver = {
  Query: {
    memberTypes: async (a: any, b: any, context: any, d: any) => {
      const memberTypes = await context.db.memberTypes.findMany();
      return memberTypes;
    },
  },
};

export default resolver;
