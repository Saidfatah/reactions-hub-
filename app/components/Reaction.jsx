import { useMemo } from "react";

const icons = {
  CLAP: "👏",
  HEART: "❤️",
  SHOCK: "😱",
  EYE: "👁",
};

export default function Reaction({
  timeStamp,
  duration,
  emoji,
}) {
  const getPosition = () => {
    const percent = timeStamp <= duration ? timeStamp / duration : 1;
    console.log(timeStamp, duration )
    return `calc(${percent * 100}% - 10px)`;
  };

  const left = useMemo(getPosition, [timeStamp, duration]);
  const icon = icons[emoji]
  return (
    <i
      style={{
        left,
        cursor: "pointer",
        display: "block",
        height: "10px",
        width: "10px",
        position: "absolute",
        top: "5px",
      }}
    >
      {icon}
    </i>
  );
}