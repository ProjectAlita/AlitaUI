import { useLikePromptMutation, useUnlikePromptMutation } from '@/api/prompts';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { ViewMode, ContentType, PromptsTabs } from '@/common/constants';
import { actions as promptsActions } from '@/slices/prompts';
import { alitaApi } from '@/api/alitaApi';
import { useParams } from 'react-router-dom';
import { useLikeCollectionMutation, useUnlikeCollectionMutation } from '@/api/collections';

export const isPromptCard = (type) =>
  type === ContentType.MyLibraryAll ||
  type === ContentType.MyLibraryPrompts ||
  type === ContentType.PromptsTop ||
  type === ContentType.PromptsLatest ||
  type === ContentType.PromptsMyLiked ||
  type === ContentType.CollectionPrompts ||
  type === ContentType.MyLibraryCollectionPrompts ||
  type === ContentType.ModerationSpacePrompt ||
  type === ContentType.UserPublicPrompts ||
  type === ContentType.UserPublicCollectionPrompts;

export const isCollectionPromptCard = (type) =>
  type === ContentType.CollectionPrompts ||
  type === ContentType.MyLibraryCollectionPrompts ||
  type === ContentType.UserPublicCollectionPrompts;

export const isCollectionCard = (type) =>
  type === ContentType.MyLibraryCollections ||
  type === ContentType.CollectionsTop ||
  type === ContentType.CollectionsLatest ||
  type === ContentType.CollectionsMyLiked ||
  type === ContentType.UserPublicCollections;

export default function useLikePromptCard(id, is_liked, type, viewMode) {
  const dispatch = useDispatch();
  const { collectionId, tab } = useParams();

  const [likePrompt, {
    isSuccess: isLikePromptSuccess,
    isLoading: isLoadingLikePrompt,
    isError: isLikePromptError,
  }] = useLikePromptMutation();
  const [unlikePrompt, {
    isSuccess: isUnlikePromptSuccess,
    isLoading: isLoadingUnlikePrompt,
    isError: isUnlikePromptError,
  }] = useUnlikePromptMutation();
  const isLoading = useMemo(() => {
    return isLoadingLikePrompt || isLoadingUnlikePrompt
  }, [isLoadingLikePrompt, isLoadingUnlikePrompt]);

  const handleLikePromptClick = useCallback(() => {
    if (viewMode !== ViewMode.Public || isLoading) {
      return;
    }
    if (is_liked) {
      if (isPromptCard(type)) {
        unlikePrompt(id);
      }
    } else {
      if (isPromptCard(type)) {
        likePrompt(id);
      }
    }
  }, [viewMode, isLoading, is_liked, type, unlikePrompt, id, likePrompt]);

  useEffect(() => {
    if (isLikePromptSuccess) {
      if (isCollectionPromptCard(type)) {
        dispatch(alitaApi.util.updateQueryData('getPublicCollection', {
          collectionId,
        }, (collectionDetail) => {
          collectionDetail.prompts.rows = collectionDetail.prompts.rows.map((prompt) => {
            if (prompt.id === id) {
              prompt.is_liked = true;
              prompt.likes = prompt.likes || 0;
              prompt.likes += 1;
            }
            return prompt;
          });
        }));
      } else {
        dispatch(promptsActions.setIsLikedToThisPrompt({
          promptId: id,
          is_liked: true,
          adjustLikes: true,
        }));
      }
    }
  }, [collectionId, dispatch, id, isLikePromptSuccess, type]);

  useEffect(() => {
    if (isUnlikePromptSuccess) {
      if (isCollectionPromptCard(type)) {
        dispatch(alitaApi.util.updateQueryData('getPublicCollection', {
          collectionId,
        }, (collectionDetail) => {
          collectionDetail.prompts.rows = collectionDetail.prompts.rows.map((prompt) => {
            if (prompt.id === id) {
              prompt.is_liked = false;
              prompt.likes = prompt.likes || 1;
              prompt.likes -= 1;
            }
            return prompt;
          });
        }));
      } else {
        dispatch(promptsActions.setIsLikedToThisPrompt({
          promptId: id,
          is_liked: false,
          adjustLikes: true,
          shouldRemoveIt: tab === PromptsTabs[1],
        }))
      }
    }
  }, [collectionId, dispatch, id, isUnlikePromptSuccess, tab, type]);

  useEffect(() => {
    if (isLikePromptError) {
      if (isCollectionPromptCard(type)) {
        dispatch(alitaApi.util.updateQueryData('getPublicCollection', {
          collectionId,
        }, (collectionDetail) => {
          collectionDetail.prompts.rows = collectionDetail.prompts.rows.map((prompt) => {
            if (prompt.id === id) {
              prompt.is_liked = true;
              if (prompt.likes === null || prompt.likes === undefined) {
                prompt.likes = 1;
              }
            }
            return prompt;
          });
        }));
      } else {
        dispatch(promptsActions.setIsLikedToThisPrompt({
          promptId: id,
          is_liked: true,
        }))
      }
    }
  }, [collectionId, dispatch, id, isLikePromptError, type]);

  useEffect(() => {
    if (isUnlikePromptError) {
      if (isCollectionPromptCard(type)) {
        dispatch(alitaApi.util.updateQueryData('getPublicCollection', {
          collectionId,
        }, (collectionDetail) => {
          collectionDetail.prompts.rows = collectionDetail.prompts.rows.map((prompt) => {
            if (prompt.id === id) {
              prompt.is_liked = false;
              if (prompt.likes === null || prompt.likes === undefined) {
                prompt.likes = 0;
              }
            }
            return prompt;
          });
        }));
      } else {
        dispatch(promptsActions.setIsLikedToThisPrompt({
          promptId: id,
          is_liked: false,
        }));
      }
    }
  }, [collectionId, dispatch, id, isUnlikePromptError, type]);

  return {
    handleLikePromptClick,
    isLoading,
  }
}

export function useLikeCollectionCard(id, is_liked, viewMode) {
  const dispatch = useDispatch();
  const { tab } = useParams();
  const queryParams = useSelector(state => state.collections.queryParams);
  const [likeCollection, {
    isSuccess: isLikeCollectionSuccess,
    isLoading: isLoadingLikeCollection,
  }] = useLikeCollectionMutation();
  const [unlikeCollection, {
    isSuccess: isUnlikeCollectionSuccess,
    isLoading: isLoadingUnlikeCollection,
  }] = useUnlikeCollectionMutation();
  const isLoading = useMemo(() => {
    return isLoadingLikeCollection || isLoadingUnlikeCollection
  }, [isLoadingLikeCollection, isLoadingUnlikeCollection]);

  const handleLikeCollectionClick = useCallback(() => {
    if (viewMode !== ViewMode.Public || isLoading) {
      return;
    }
    if (is_liked) {
      unlikeCollection(id);
    } else {
      likeCollection(id);
    }
  }, [viewMode, isLoading, is_liked, likeCollection, id, unlikeCollection]);

  useEffect(() => {
    if (isLikeCollectionSuccess) {
      dispatch(alitaApi.util.updateQueryData('collectionList', queryParams, (collectionList) => {
        collectionList.rows = collectionList.rows.map((collection) => {
          if (collection.id === id) {
            collection.is_liked = true;
            if (collection.likes) {
              collection.likes += 1;
            } else {
              collection.likes = 1;
            }
          }
          return collection;
        });
      }));
    }
  }, [dispatch, id, isLikeCollectionSuccess, queryParams]);

  useEffect(() => {
    if (isUnlikeCollectionSuccess) {
      dispatch(alitaApi.util.updateQueryData('collectionList', queryParams, (collectionList) => {
        if (tab === 'my-liked') {
          collectionList.rows = collectionList.rows.filter((collection) => collection.id !== id);
        } else {
          collectionList.rows = collectionList.rows.map((collection) => {
            if (collection.id === id) {
              collection.is_liked = false;
              if (collection.likes) {
                collection.likes -= 1;
              } else {
                collection.likes = 0;
              }
            }
            return collection;
          });
        }
      }));
    }
  }, [dispatch, id, isUnlikeCollectionSuccess, queryParams, tab]);

  return {
    handleLikeCollectionClick,
    isLoading,
  }
}