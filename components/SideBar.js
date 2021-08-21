import React, { useState, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Icon } from 'react-native-eva-icons';
export default function SideBar(props) {

  const [showSideBar, setshowSideBar] = useState(props.show);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let alignSelf
  if (props.align === "left") { alignSelf = "flex-end" }
  else {
    if (props.align === "right") { alignSelf = "flex-start" }
  }

  const fadeAnim = useRef(new Animated.Value(
    alignSelf === "flex-end" ? 0 : windowWidth
  )).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: alignSelf === "flex-end" ? 0:windowWidth,
      duration: 500,
      useNativeDriver: true
    }).start();
  };


  

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: alignSelf === "flex-end" ? windowWidth:0,
      duration: 250,
      useNativeDriver: true
    }).start();
  };




  if (props.show === true) {
    fadeOut();
  }
  else {
    fadeIn();
  }




  return (
    <Animated.View
      style={[styles.fadingContainer,
          {
            transform: [{ translateX: fadeAnim }],
            position: "absolute",
            zIndex: 9999999999,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }]}>
      {alignSelf === "flex-end" &&
        <TouchableOpacity onPress={() => props.display()} style={{ position: "absolute", top: 20, left: 20 }}>
          <Icon name='close-circle-outline' width={30} height={30} fill={"white"} />
        </TouchableOpacity>
      }
      {alignSelf === "flex-start" &&
        <TouchableOpacity onPress={() => props.display()} style={{ position: "absolute", top: 20, right: 20 }}>
          <Icon name='close-circle-outline' width={30} height={30} fill={"white"} />
        </TouchableOpacity>
      }
      <View style={{
        alignContent: "center",
        alignItems: "center",
        alignSelf: alignSelf,
        width: props.w,
        height: "100%",
      }}>
        {props.data}
      </View>
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  fadingContainer: {
    //padding: 20,
    backgroundColor: "powderblue"
  },
  fadingText: {
    fontSize: 28
  }
})