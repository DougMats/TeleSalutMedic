import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { colorBetta, colorZeta, } from '../Colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function Row(props) {
  const [menu, setmenu] = useState(false);
  return (
    <View style={styles.item}>
      <View style={styles.itemInfo} onPress={() => setmenu(!menu)}>
        {props.i.state === 3 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"blue"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Realizada
            </Text>
          </>
        }
        {props.i.state === 4 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"red"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Cancelada
            </Text>
          </>
        }
        {props.i.photos === "si" && props.i.state === 0 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"orange"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Pendiente por historial clínico
            </Text>
          </>
        }
        {props.i.photos === "si" && props.i.state === 1 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"orange"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Pendiente por subir fotos
            </Text>
          </>
        }
        {props.i.photos === "si" && props.i.state === 2 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"green"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Por realizar
            </Text>
          </>
        }
        {props.i.photos === "no" && props.i.state === 0 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"orange"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Pendiente por historial clínico
            </Text>
          </>
        }

        {props.i.photos === "no" && props.i.state === 1 &&
          <>
            <Icon name='radio-button-on' height={25} width={25} fill={"green"} />
            <Text style={[styles.col, { width: "22%", fontWeight: "bold", }]}>
              Por realizar
            </Text>
          </>
        }
        <Text style={[styles.col, { width: "22%", }]}>{props.i.scheduled_day}</Text>
        <Text style={[styles.col, { width: "22%" }]}>{props.i.scheduled_time}</Text>
        <TouchableOpacity onPress={() => setmenu(!menu)} style={{ width: "12%", alignItems: "center", alignContent: "center" }}>
          <Icon name='more-vertical-outline' height={25} width={25} fill={"#000"} />
        </TouchableOpacity>
      </View>
      {menu &&
        <View style={styles.itemMenu}>
          {props.i.state < 3 &&
            <TouchableOpacity style={styles.btnMenu} onPress={() => props.goToViewMeet("Sala", props.i.code)}>
              <Icon name='video-outline' height={25} width={25} fill={colorBetta} />
            </TouchableOpacity>
          }
          {props.i.state === 3 &&
            <TouchableOpacity style={styles.btnMenu} onPress={() => props.goToScreen("Quotation", props.i.code)}>
              <Icon name='clipboard-outline' height={25} width={25} fill={colorBetta} />
            </TouchableOpacity>
          }
          <TouchableOpacity style={styles.btnMenu} onPress={() => props.goToScreen("AdminMeet", props.i.code)}>
            <Icon name='edit-outline' height={25} width={25} fill={colorBetta} />
          </TouchableOpacity >
          <TouchableOpacity onPress={() => setmenu(!menu)} style={styles.btnMenu}>
            <Icon name='close-outline' height={25} width={25} fill={colorBetta} />
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}
const styles = StyleSheet.create({
  contained: {
    backgroundColor: "white",
    marginTop: 60,
    width: windowWidth - 40,
    maxHeight: windowHeight - 80,
    borderRadius: 12
  },
  head: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    padding: 5,
    backgroundColor: colorBetta,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
  filter: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    padding: 5,
    backgroundColor: colorZeta,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
    marginTop: -15,
    position: "relative",
    zIndex: -5,
    paddingTop: 20,
    marginBottom: 10,
  },
  title: {
    color: colorZeta,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 35
  },
  headBtn: {
    position: "absolute",
    right: 10,
    top: 5,
    backgroundColor: colorBetta,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  wrap: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: "column"
  },
  wrapEmpty: {
    borderColor: 'silver',
    borderWidth: 1,
    padding: 20,
    margin: 20,
    borderRadius: 20,
    borderStyle: "dashed"
  },
  empty: {
    color: "silver",
    textAlign: "center",
    fontSize: 20
  },
  THead: {
    marginBottom: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    width: "100%",
  },
  col: {
    fontSize: 14,
    textAlign: "center",
    color: "#000"
  },
  bold: {
    fontWeight: "bold"
  },
  item: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 5,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "silver",
    borderBottomWidth: 1
  },
  itemInfo: {
    paddingVertical: 12,
    height: 45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemMenu: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    justifyContent: "space-around",
    right: 0,
    top: 0,
    height: 45,
  },
  btnMenu: {
    top: 2,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
})
export default Row;