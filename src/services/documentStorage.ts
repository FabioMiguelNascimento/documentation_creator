import { Block } from "@/types/documentation";

const STORAGE_KEY = 'doc-builder-blocks';

export const documentStorage = {
  saveBlocks: (blocks: Block[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
      return true;
    } catch (error) {
      console.error('Error saving blocks:', error);
      return false;
    }
  },

  getBlocks: (): Block[] => {
    try {
      const blocks = localStorage.getItem(STORAGE_KEY);
      return blocks ? JSON.parse(blocks) : [];
    } catch (error) {
      console.error('Error getting blocks:', error);
      return [];
    }
  }
};
