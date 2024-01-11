import { useLikePromptMutation, useUnlikePromptMutation } from '@/api/prompts';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { ViewMode } from '@/common/constants';
import { actions as promptsActions } from '@/slices/prompts';
import { useParams } from 'react-router-dom';


export default function useLikePrompt(id, is_liked, viewMode) {
  const dispatch = useDispatch();
  const { collectionId } = useParams();

  const [likePrompt, {
    isSuccess: isLikePromptSuccess,
    isLoading: isLoadingLikePrompt,
  }] = useLikePromptMutation();
  const [unlikePrompt, {
    isSuccess: isUnlikePromptSuccess,
    isLoading: isLoadingUnlikePrompt,
  }] = useUnlikePromptMutation();
  const isLoading = useMemo(() => {
    return isLoadingLikePrompt || isLoadingUnlikePrompt
  }, [isLoadingLikePrompt, isLoadingUnlikePrompt]);

  const handleLikeClick = useCallback(() => {
    if (viewMode !== ViewMode.Public || isLoading) {
      return;
    }
    if (is_liked) {
      unlikePrompt(id);
    } else {
      likePrompt(id);
    }
  }, [viewMode, isLoading, is_liked, unlikePrompt, id, likePrompt]);

  useEffect(() => {
    if (isLikePromptSuccess) {
      dispatch(promptsActions.setIsLikedToThisPrompt({
        promptId: id,
        is_liked: true,
        adjustLikes: true,
      }));
    }
  }, [collectionId, dispatch, id, isLikePromptSuccess]);

  useEffect(() => {
    if (isUnlikePromptSuccess) {
      dispatch(promptsActions.setIsLikedToThisPrompt({
        promptId: id,
        is_liked: false,
        adjustLikes: true,
      }))
    }
  }, [collectionId, dispatch, id, isUnlikePromptSuccess]);

  return {
    handleLikeClick,
    isLoading,
  }
}