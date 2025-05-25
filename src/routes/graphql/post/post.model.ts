export type PostModel = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type PostDto = Omit<PostModel, 'id'>;
