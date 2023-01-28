
// const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
//   fastify
// ): Promise<void> => {
//   fastify.get('/', async function (request, reply): Promise<PostEntity[]> {});
//
//   fastify.get(
//     '/:id',
//     {
//       schema: {
//         params: idParamSchema,
//       },
//     },
//     async function (request, reply): Promise<PostEntity> {}
//   );
//
//   fastify.post(
//     '/',
//     {
//       schema: {
//         body: createPostBodySchema,
//       },
//     },
//     async function (request, reply): Promise<PostEntity> {}
//   );
//
//   fastify.delete(
//     '/:id',
//     {
//       schema: {
//         params: idParamSchema,
//       },
//     },
//     async function (request, reply): Promise<PostEntity> {}
//   );
//
//   fastify.patch(
//     '/:id',
//     {
//       schema: {
//         body: changePostBodySchema,
//         params: idParamSchema,
//       },
//     },
//     async function (request, reply): Promise<PostEntity> {}
//   );
// };
//
// export default plugin;
