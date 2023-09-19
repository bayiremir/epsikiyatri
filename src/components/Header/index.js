import { View, Text, Dimensions } from "react-native";
import React from "react";
import { colors } from "../../utils/colors";

const Header = ({ children }) => {
  return (
    <View
      style={{
        position: "relative",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          height: "30%",
          width: "100%",
          backgroundColor: colors.darkPurple,
          borderBottomLeftRadius: Dimensions.get("screen").height / 4,
          transform: [{ scaleX: 1.2 }],
          borderBottomRightRadius: Dimensions.get("screen").height / 4,
        }}
      />
      {children}
    </View>
  );
};

export default Header;
