import { useLikePromptMutation, useUnlikePromptMutation } from '@/api/prompts';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { ViewMode, ContentType } from '@/common/constants';
import { actions as promptsActions } from '@/slices/prompts';
import { alitaApi } from '@/api/alitaApi';
import { useParams } from 'react-router-dom';

export const isPromptCard = (type) =>
  type === ContentType.MyLibraryAll ||
  type === ContentType.MyLibraryPrompts ||
  type === ContentType.PromptsTop ||
  type === ContentType.PromptsLatest ||
  type === ContentType.PromptsMyLiked ||
  type === ContentType.MyLibraryCollectionPrompts ||
  type === ContentType.ModerationSpacePrompt ||
  type === ContentType.UserPublicPrompts ||
  type === ContentType.UserPublicCollectionPrompts;

export const isCollectionPromptCard = (type) =>
  type === ContentType.MyLibraryCollectionPrompts ||
  type === ContentType.UserPublicCollectionPrompts;

export const isCollectionCard = (type) =>
  type === ContentType.MyLibraryCollections ||
  type === ContentType.CollectionsTop ||
  type === ContentType.CollectionsLatest ||
  type === ContentType.CollectionsMyLiked ||
  type === ContentType.UserPublicCollections;

export default function useCardLike(id, is_liked, type, viewMode) {
  const dispatch = useDispatch();
  const { collectionId } = useParams();

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

  const handleLikeClick = useCallback(() => {
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
          collectionDetail.prompts = collectionDetail.prompts.map((prompt) => {
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
          collectionDetail.prompts = collectionDetail.prompts.map((prompt) => {
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
        }))
      }
    }
  }, [collectionId, dispatch, id, isUnlikePromptSuccess, type]);

  useEffect(() => {
    if (isLikePromptError) {
      if (isCollectionPromptCard(type)) {
        dispatch(alitaApi.util.updateQueryData('getPublicCollection', {
          collectionId,
        }, (collectionDetail) => {
          collectionDetail.prompts = collectionDetail.prompts.map((prompt) => {
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
          collectionDetail.prompts = collectionDetail.prompts.map((prompt) => {
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
    handleLikeClick,
    isLoading,
  }
}