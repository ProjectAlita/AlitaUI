
import { filterProps } from "@/common/utils";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Box } from '@mui/material';

const calculateInitialTextShadow = (stringLength, width, color) => {
  return Array(stringLength).fill(null).map((u, i) => {
    return `calc( ${!i ? i : -i}*${width}) 0 ${color}`
  }).join(',');
}

const calculateTextShadow = (stringLength, charIndex, width, offset, color) => {
  return Array(stringLength).fill(null).map((u, i) => {
    return `calc( ${!i ? i : -i}*${width}) ${charIndex === i ? offset : '0'} ${color}`
  }).join(',');
}

const keyframesTextShadowAnimation = ({ color, message, width, offset='-10px' }) => {
  const framesCount = message.length + 1;
  const percentageOfAFrame =  Number(Number(1 / framesCount * 100).toFixed(2))
  const framePercentages = Array(message.length).fill(null).map((u, i) => {
    return percentageOfAFrame * ( i + 1) + '%'
  })
  const frames = framePercentages.reduce((accumulator, frame, index) => {
    return {
      ...accumulator,
      [frame]: {
        textShadow: calculateTextShadow(message.length, index, width, offset, color)
      }
    };
  }, {})
  return keyframes(frames)
};

const Loader = styled(
  Box,
  filterProps("message", 'duration')
)(({ message, theme, width, duration = '2s' }) => ({
  letterSpacing: width,
  width: width,
  overflow: "hidden",
  whiteSpace: "nowrap",
  color: "#0000",
  textShadow: calculateInitialTextShadow(message.length, width, theme.palette.primary.main),
  animation: `${keyframesTextShadowAnimation({
    message,
    color: theme.palette.primary.main,
    width,
    offset: '-10px',
  })} ${duration} infinite linear`,
  "&::before": {
    content: `"${message}"`,
  },
}));

export default function AnimatedProgress({ message = "Loading...", width="300px", duration='2.5s', sx }) {
  return <Loader sx={sx} message={message} width={width} duration={duration} />;
}