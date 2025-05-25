export type ProfileModel = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export type ProfileDto = Omit<ProfileModel, 'id'>;
