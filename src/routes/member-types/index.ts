

// const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
//   fastify
// ): Promise<void> => {
//   fastify.get('/', async function (request, reply): Promise<
//     MemberTypeEntity[]
//   > {});
//
//   fastify.get(
//     '/:id',
//     {
//       schema: {
//         params: idParamSchema,
//       },
//     },
//     async function (request, reply): Promise<MemberTypeEntity> {}
//   );
//
//   fastify.patch(
//     '/:id',
//     {
//       schema: {
//         body: changeMemberTypeBodySchema,
//         params: idParamSchema,
//       },
//     },
//     async function (request, reply): Promise<MemberTypeEntity> {}
//   );
// };
//
// export default plugin;
