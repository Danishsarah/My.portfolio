import React, { useEffect, useState } from "react";
import CustomCursor from "custom-cursor-react";
import "custom-cursor-react/dist/index.css";
import { useTheme } from "next-themes";

const Cursor = () => {
  const theme = useTheme();
  const [mount, setMount] = useState();

  const getCusomColor = () => {
    if (theme.theme === "dark") {
      return "#fff";
    } else if (theme.theme === "light") {
      return "#000";
    }
  };

  useEffect(() => {
    setMount(true);
  }, []);
  return (
    <>
      {mount && (
        <CustomCursor
          targets={[".link"]}
          customClass="custom-cursor"
          dimensions={40}
          fill={getCusomColor()}
          smoothness={{
            movement: 0.05,
            scale: 0.05,
            opacity: 0.1,
          }}
          targetOpacity={0.7}
          targetScale={1.8}
        />
      )}
    </>
  );
};

export default Cursor;
