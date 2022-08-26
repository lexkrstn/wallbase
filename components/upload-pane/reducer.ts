import { Reducer } from 'react';
import Tag from '../../interfaces/tag';
import { ImageFileData } from '../../lib/helpers/image';

interface ThumbnailState extends ImageFileData {
  id: string;
  active: boolean;
  purity: number;
  board: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tags: Tag[],
  loading?: boolean;
  success?: boolean;
  error?: string;
}

function getCommonPurityOfActive(thumbnails: ThumbnailState[]): number {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return 0;
  const { purity } = active[0];
  return active.every(t => t.purity === purity) ? purity : 0;
}

function getCommonBoardOfActive(thumbnails: ThumbnailState[]): number {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return 0;
  const { board } = active[0];
  return active.every(t => t.board === board) ? board : 0;
}

function getCommonSourceUrlOfActive(thumbnails: ThumbnailState[]): string {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return '';
  const { sourceUrl } = active[0];
  return active.every(t => t.sourceUrl === sourceUrl) ? sourceUrl : '/* multiple */';
}

function areTagArraysEqual(a: Tag[], b: Tag[]): boolean {
  const idsA = a.map(tag => tag.id).sort();
  const idsB = b.map(tag => tag.id).sort();
  return JSON.stringify(idsA) === JSON.stringify(idsB);
}

function getCommonTagsOfActive(thumbnails: ThumbnailState[]): Tag[] {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return [];
  const { tags } = active[0];
  return active.every(t => areTagArraysEqual(t.tags, tags)) ? tags : [];
}

function getNextPurity(purity: number) {
  return (purity === 0 || purity === 4) ? 1 : purity << 1;
}

export const initialState = {
  images: [] as ThumbnailState[],
  board: 0,
  purity: 0,
  sourceUrl: '',
  tags: [] as Tag[],
  multiselect: true,
  idCounter: 1,
};

type State = typeof initialState;

type PayloadAction<A extends string, P extends {}> = { type: A } & P;

type NoPayloadAction<A extends string> = { type: A };

type Action = NoPayloadAction<'reset'>
  | PayloadAction<'set image loading', { file: File }>
  | PayloadAction<'fail image loading', { file: File, error: Error | string }>
  | PayloadAction<'succeed image loading', { file: File }>
  | PayloadAction<'toggle image active', { id: string }>
  | PayloadAction<'delete image', { id: string }>
  | PayloadAction<'add images', { images: ImageFileData[] }>
  | PayloadAction<'set purity', { purity: number }>
  | PayloadAction<'set board', { board: number }>
  | PayloadAction<'set source url', { sourceUrl: string }>
  | PayloadAction<'set tags', { tags: Tag[] }>
  | PayloadAction<'scroll image purity', { id: string }>
  | NoPayloadAction<'unselect images'>;

const reducer: Reducer<State, Action> = (state, action) => {
  let newImages: ThumbnailState[];
  switch (action.type) {
    case 'reset':
      state.images.forEach(image => image.dispose());
      return initialState;
    case 'set image loading':
      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: image.file === action.file ? true : image.loading,
        })),
      };
    case 'fail image loading':
      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: false,
          error: image.file === action.file
            ? (action.error as Error).message || action.error as string
            : image.error,
        })),
      };
    case 'succeed image loading':
      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: false,
          success: image.file === action.file ? true : image.success,
        })),
      };
    case 'toggle image active':
      newImages = state.images.map(image => ({
        ...image,
        active: state.multiselect
          ? (image.id === action.id ? !image.active : image.active)
          : (image.id === action.id ? !image.active : false),
      }));
      return {
        ...state,
        images: newImages,
        board: getCommonBoardOfActive(newImages),
        purity: getCommonPurityOfActive(newImages),
        sourceUrl: getCommonSourceUrlOfActive(newImages),
        tags: getCommonTagsOfActive(newImages),
      };
    case 'delete image':
      newImages = state.images.filter(image => {
        if (image.id !== action.id) return true;
        image.dispose(); // calls URL.revokeObjectURL()
        return false;
      });
      return {
        ...state,
        images: newImages,
        board: getCommonBoardOfActive(newImages),
        purity: getCommonPurityOfActive(newImages),
        sourceUrl: getCommonSourceUrlOfActive(newImages),
        tags: getCommonTagsOfActive(newImages),
      };
    case 'add images':
      return {
        ...state,
        images: [
          ...state.images,
          ...action.images.map((image, i): ThumbnailState => ({
            ...image,
            id: `${state.idCounter + i}`,
            active: false,
            board: 0,
            purity: 0,
            sourceUrl: '',
            authorName: '',
            authorUrl: '',
            tags: [],
          })),
        ],
        idCounter: state.idCounter + action.images.length,
      };
    case 'set purity':
      return {
        ...state,
        purity: action.purity,
        images: state.images.map(image => ({
          ...image,
          purity: image.active ? action.purity : image.purity,
        })),
      };
    case 'scroll image purity':
      newImages = state.images.map(image => ({
        ...image,
        purity: image.id === action.id ? getNextPurity(image.purity) : image.purity,
      }));
      return {
        ...state,
        purity: getCommonPurityOfActive(newImages),
        images: newImages,
      };
    case 'set board':
      return {
        ...state,
        board: action.board,
        images: state.images.map(image => ({
          ...image,
          board: image.active ? action.board : image.board,
        })),
      };
    case 'set source url':
      return {
        ...state,
        sourceUrl: action.sourceUrl,
        images: state.images.map(image => ({
          ...image,
          sourceUrl: image.active ? action.sourceUrl : image.sourceUrl,
        })),
      };
    case 'set tags':
      return {
        ...state,
        tags: action.tags,
        images: state.images.map(image => ({
          ...image,
          tags: image.active ? action.tags : image.tags,
        })),
      };
    case 'unselect images':
      return {
        ...state,
        images: state.images.map(image => ({
          ...image,
          active: false,
        })),
      };
    default:
      throw new Error('Unknown action');
  }
};

export default reducer;
