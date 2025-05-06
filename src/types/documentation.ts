export interface Documentation {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  type: 'text' | 'list' | 'code' | 'image';
  content: string;
  order: number;
  language?: string;
}
