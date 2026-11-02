export type SchemaModuleId = 'auth' | 'catalog' | 'order' | 'ai' | 'support';

export interface SchemaField {
  name: string;
  type: string;
  typeBadgeColor?: string;
  note: string;
  isPk?: boolean;
  isIndex?: boolean;
}

export interface CollectionSchema {
  id: string;
  module: SchemaModuleId;
  prefix: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  fields: SchemaField[];
}
