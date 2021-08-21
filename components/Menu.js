import React, { useState, useContext } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { a, b, c, d, colorAA, colorAlfa, colorBettaLight, colorBetta, colorZeta } from '../Colors';
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient';
import UserContext from '../contexts/UserContext'
export default function Menu(props) {

  const { navigation } = props.props
  const { userDetails, setUserDetails } = useContext(UserContext)
  function goToScreen(screen) {
    let code = 0;
    let key_conference = 0;
    navigation.navigate(screen, { randomCode: Math.random(), code, key_conference })
  }

  const logOut = async () => {
    console.log("bye")
    try {
      await AsyncStorage.removeItem('@Passport');
      setUserDetails({})
      goToScreen("Login")
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.wrap}>
      <TouchableOpacity style={styles.btn} onPress={() => goToScreen("Profile")}>
        {props.option === 1 ?
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='person' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
          :
          <Icon name='person' height={25} width={25} fill={props.option === 1 ? colorZeta : colorBetta} />
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => goToScreen("Dashboard")}>
        {props.option === 2 ?
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='list' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
          :
          <Icon name='list' height={25} width={25} fill={props.option === 2 ? colorZeta : colorBetta} />
        }
      </TouchableOpacity>
      {props.option === 2.2 &&
        <TouchableOpacity style={styles.btn} onPress={() => goToScreen("Dashboard")}>
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='arrow-back-outline' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
        </TouchableOpacity>
      }
      <TouchableOpacity style={styles.btn} onPress={() => goToScreen("Sala")}>
        {props.option === 3 ?
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='video-outline' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
          :
          <Icon name='video-outline' height={25} width={25} fill={props.option === 3 ? colorZeta : colorBetta} />
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => goToScreen("Quotation")}>
        {props.option === 4 ?
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='clipboard-outline' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
          :
          <Icon name='clipboard-outline' height={25} width={25} fill={props.option === 4 ? colorZeta : colorBetta} />
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => logOut()}>
        {props.option === 5 ?
          <LinearGradient colors={[colorBettaLight, colorBetta]} style={styles.btn}>
            <Icon name='power' height={25} width={25} fill={colorZeta} />
          </LinearGradient>
          :
          <Icon name='power' height={25} width={25} fill={props.option === 5 ? colorZeta : colorBetta} />
        }
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: colorZeta,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 2,
  }
})