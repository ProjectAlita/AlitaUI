import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentIcon from "./Icons/CommentIcon";
import StarIcon from "./Icons/StarIcon";
import TrophyIcon from "./Icons/TrophyIcon";

const MOCK_CATEGORIES = [
  "Category A",
  "Collection B",
  "Some else C",
  "Some else D",
];
const MOCK_ISTOP = true;
const MOCK_FAVORITE_COUNT = 20;
const MOCK_COMMENT_COUNT = 10;
const MOCK_AVATARS = [
  "https://i.pravatar.cc/300?a=1",
  "https://i.pravatar.cc/300?a=2",
  "https://i.pravatar.cc/300?a=3",
  "https://i.pravatar.cc/300?a=4",
  "https://i.pravatar.cc/300?a=5",
];

const DOUBLE_LINE_HIGHT = 48;

const StyledCard = styled(Card)(() => ({
  width: "315.33px",
  height: "192px",
  margin: "10px 22px",
  background: "#181F2A",
}));

const StyledCarContent = styled(CardContent)(() => ({
  padding: "0",
  display: "flex",
  flexDirection: "column"
}));

const StyledCardTopSection = styled('div')(() => ({
  height: "96px",
  padding: "0.5rem 1rem 0rem 1rem",
  marginBottom: "8px",
}));

const StyledCardTitle = styled(Typography)(() => ({
  color: "#FFFFFF",
  fontFamily: "Montserrat",
  fontSize: "0.875rem",
  lineHeight: "1.5rem",
  fontWeight: "600",
  maxHeight: "48px",
  marginBottom: "0",
  wordWrap: "break-word",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: "2",
}));

const StyledCardDescription = styled(Typography)(() => ({
  color: "#A9B7C1",
  fontFamily: "Montserrat",
  fontSize: "0.75rem",
  lineHeight: "16px",
  fontWeight: "400",
  maxHeight: "60px",
  marginBottom: "0",
  wordWrap: "break-word",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
}));

const StyledCardMidSection = styled('div')(() => ({
  display: "flex",
  height: "28px",
  marginBottom: "8px",
  padding: "0 10px",
}));

const StyledCardBottomSection = styled('div')(() => ({
  marginBottom: "-1.5rem",
  borderTop: "1px solid #26323D",
  height: "52px",
  padding: "0 10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const MidSelectionItem = ({ text, isCount = false }) => {
  const itemStyle = {
    fontFamily: "Montserrat",
    fontSize: "0.75rem",
    lineHeight: "1rem",
    fontWeight: "400",
    color: "#A9B7C1",
    width: "67px",
    height: "28px",
    marginRight: "13px",
  };
  return (
    <div>
      <span style={itemStyle}>
        {text} {isCount ? "" : "|"}
      </span>
    </div>
  );
};

const MidSelectionItemLabel = ({ isTop }) => {
  return (
    <div style={{ marginLeft: "auto", display: isTop ? "block" : "none" }}>
      <TrophyIcon />
    </div>
  );
};

const AuthorContainer = ({ avatars = [] }) => {
  const avatarsContainerStyle = {
    fontFamily: "Montserrat",
    width: "180px",
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    lineHeight: "16px",
  };
  const avatarStyle = {
    padding: "0",
    width: "20px",
    height: "20px",
  };
  const textStyle = {
    marginLeft: "5px",
    wordWrap: "break-word",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "1",
  };
  const countStyle = {
    width: "28px",
    height: "28px",
    lineHeight: "28px",
    margin: "0 auto",
  };
  return (
    <div style={avatarsContainerStyle}>
      {avatars.map((src, index) => {
        if (index > 2) return;
        return (
          <Avatar
            key={src}
            style={{ ...avatarStyle, transform: `translateX(-${index * 3}px)` }}
            src={src}
          />
        );
      })}
      <div style={textStyle}>George Developer</div>
      <div style={countStyle}>+2</div>
    </div>
  );
};

const InfoContainer = () => {
  const containerStyle = {
    fontFamily: "Montserrat",
    display: "flex",
    width: "99px",
    height: "28px",
  };
  const itemPairStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "52px",
    padding: "6px 8px 6px 8px",
  };
  const iconSize = {
    width: "16px",
    height: "16px",
  };
  const fontStyle = {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: "400",
  };
  return (
    <div style={containerStyle}>
      <div style={itemPairStyle}>
        <StarIcon style={iconSize} />
        <div style={fontStyle}>{MOCK_FAVORITE_COUNT}</div>
      </div>
      <div style={itemPairStyle}>
        <CommentIcon style={iconSize} />
        <div style={fontStyle}>{MOCK_COMMENT_COUNT}</div>
      </div>
    </div>
  );
};

export default function PromptCard({ data = {} }) {
  const { id, name = "", description = "" } = data;
  const initialCardDescriptionHeight = 2;
  const [lineClamp, setLineCalmp] = useState(initialCardDescriptionHeight);
  const cardTitleRef = useRef(null);
  const isTitleSingleRow = () => {
    return cardTitleRef.current.offsetHeight < DOUBLE_LINE_HIGHT;
  };
  useEffect(() => {
    const cardDescriptionHeight = isTitleSingleRow() ? 3 : 2;
    setLineCalmp(cardDescriptionHeight);
  }, []);

  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    navigate(`/prompt/${id}`);
  }, [navigate, id]);

  return (
    <div style={{ width: "100%" }} onClick={doNavigate}>
      <StyledCard sx={{ minWidth: 275, display: "inline" }}>
        <StyledCarContent>
          <StyledCardTopSection>
            <StyledCardTitle
              ref={cardTitleRef}
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {name}
            </StyledCardTitle>
            <StyledCardDescription
              sx={{ mb: 1.5 }}
              color="text.secondary"
              style={{ WebkitLineClamp: lineClamp, marginTop: "0.25rem" }}
            >
              {description}
            </StyledCardDescription>
          </StyledCardTopSection>
          <StyledCardMidSection color="text.secondary">
            {MOCK_CATEGORIES.map((c, index) => {
              if (index > 1) return;
              return <MidSelectionItem key={c} text={c} />;
            })}
            <MidSelectionItem text={"+2"} isCount={true} />
            <MidSelectionItemLabel isTop={MOCK_ISTOP} />
          </StyledCardMidSection>
          <StyledCardBottomSection color="text.secondary">
            <AuthorContainer avatars={MOCK_AVATARS} />
            <InfoContainer />
          </StyledCardBottomSection>
        </StyledCarContent>
      </StyledCard>
    </div>
  );
}
