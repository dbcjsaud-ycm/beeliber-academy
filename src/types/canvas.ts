// Pikaso Canvas 타입 정의

export type CanvasElementType = 'image' | 'text' | 'video' | 'sticky' | 'group';
export type ActivTool = 'select' | 'hand' | 'text' | 'sticky';

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  pageId: string;
  data: Record<string, unknown>; // src, text, color, etc.
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface Page {
  id: string;
  spaceId: string;
  name: string;
  order: number;
}

export interface Space {
  id: string;
  ownerId: string;
  title: string;
  isPublic: boolean;
  pages: Page[];
}
