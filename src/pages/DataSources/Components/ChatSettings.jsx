import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box } from '@mui/material';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';

const ChatSettings = ({
  onChangeChatModel,
  selectedChatModel,
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
}) => {
  const { modelOptions, embeddingModelOptions } = useModelOptions();

  return (
    <Box sx={{ marginTop: '24px', gap: '16px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Box sx={{ width: 'calc(50% - 12px)', height: '56px'  }}>
        <SingleGroupSelect
          label={'Embedding model'}
          value={selectedEmbeddingModel}
          onValueChange={onChangeEmbeddingModel}
          options={embeddingModelOptions}
          extraSelectedContent={isSelectedEmbeddingModelCompatible ? <ModelCompatibleIcon /> : null}
          sx={{
            height: '56px',
            boxSizing: 'border-box',
            paddingTop: '8px',
            '& .MuiInputLabel-shrink': {
              top: '12px !important',
            },
            '& .MuiInputLabel-root': {
              top: '6px',
            },
          }}
        />
      </Box>
      <Box sx={{ width: 'calc(50% - 12px)', height: '56px' }}>
        <SingleGroupSelect
          label={'Chat model'}
          value={selectedChatModel}
          onValueChange={onChangeChatModel}
          options={modelOptions}
          sx={{
            height: '56px',
            boxSizing: 'border-box',
            paddingTop: '8px',
            '& .MuiInputLabel-shrink': {
              top: '12px !important',
            },
            '& .MuiInputLabel-root': {
              top: '6px',
            },
          }}
        />
      </Box>
    </Box>
  );
}
export default ChatSettings;