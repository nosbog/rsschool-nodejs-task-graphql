export const getMemberType = async (prisma, where) => {
  const memberType = await prisma.memberType.findUnique({
    where,
  });

  if (!memberType) {
    return null;
  }

  return memberType;
};
