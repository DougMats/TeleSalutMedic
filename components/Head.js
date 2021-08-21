import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, Touchable } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { colorAA, colorAlfa, colorBetta, colorZeta } from '../Colors';
export default function Head(props) {
  const [count, setcount] = useState(0);
  const { navigation } = props.props;
  function goToScreen(screen) {
    navigation.navigate(screen, { randomCode: Math.random() })
  }
  return (
    <SafeAreaView style={styles.wrap}>
      <View style={[styles.wrapper, { width: "10%" }]}>
        {props.from !== "" &&
          <TouchableOpacity style={{ backgroundColor: colorZeta, marginLeft: 20, with: 40, height: 40, borderRadius: 20, marginTop: 20 }} onPress={() => goToScreen(props.from)}>
            <Icon name='arrow-ios-back-outline' height={30} width={30} fill={colorBetta} />
          </TouchableOpacity>
        }
      </View>
      <View style={[styles.wrapper, { padding: 2, width: "80%" }]}>
        <View style={{ width: "100%", marginTop: 15, height: "65%", marginLeft: 20 }}>
          <Image style={styles.img} source={require("../images/logocolor.png")} />
        </View>
      </View>
      {/* <View style={[styles.wrapper, { width: "30%" }]}>
        {count > 0 &&
          <View style={{ position: "absolute", zIndex: 999, top: 0, right: 15, alignItems: "center", alignContent: "center", backgroundColor: "red", width: 25, height: 25, borderRadius: 15 }}>
            <Text style={{ color: colorZeta, lineHeight: 20 }}>{count}</Text>
          </View>
        }
        <View style={{ height: 70, width: 70, borderRadius: 35, overflow: "hidden" }}>
          <Image style={styles.img} source={{ uri: 'data:image/jpeg;base64,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' }} />
        </View>
      </View> */}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  wrap: {
    paddingTop: 25,
    paddingBottom: 15,
    position: "relative",
    zIndex: 99999999,
    backgroundColor: colorZeta,
    width: "100%",
    height: 125,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginBottom: -30,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
  wrapper: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: null,
    height: null,
    resizeMode: "cover",
    flex: 1
  }
})