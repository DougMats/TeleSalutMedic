import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import {  colorAlfa, colorBetta, colorZeta,} from '../Colors';
import { serverCrm, base_url} from '../Env'
import axios from 'axios'
import Small from './Time/Small.js';
import Row from './ScheduledListClientRow.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function ListScheduledClient(props) {
  const { navigation } = props.props;
  const [Load, setLoad] = useState(true);
  const [user, setuser] = useState(props.user);
  const [listScheduled, setlistScheduled] = useState(null);

  useEffect(() => {
    Get()
  }, [user]);

  async function Get() {
    console.log("_______________")
    console.log(base_url(serverCrm, `get/scheduled/valoration/client/${user.id}`))
    await axios.get(base_url(serverCrm, `get/scheduled/valoration/client/${user.id}`)).then(function (response) {
      setlistScheduled(response.data)
    })
      .catch(function (error) { console.log("?", error) })
      .then(function () { });
    setLoad(false)
  }
  function goToScreen(screen, data) {
    navigation.navigate(screen, { randomCode: Math.random(), data })
  }
  return (
    <View style={styles.contained}>
      <View style={styles.head}>
        <Text style={styles.title}>Lista de Video Valoraciones</Text>
      </View>
      <View style={styles.wrap}>
        <ScrollView>
          {Load &&
            <ActivityIndicator size="large" color={colorAlfa} style={{ marginVertical: 20 }} />
          }
          {!Load && listScheduled.length === 0 &&
            <View style={styles.wrapEmpty}>
              <Text style={styles.empty}>No existen registros.</Text>
            </View>
          }
          {!Load && listScheduled.length > 0 &&
            <View style={styles.THead}>
              <Text style={[styles.col, styles.bold, { width: "22%" }]}>Estado</Text>
              <Text style={[styles.col, styles.bold, { width: "22%" }]}>Fecha</Text>
              <Text style={[styles.col, styles.bold, { width: "22%" }]}>Hora</Text>
              <View style={{ width: "12%", alignItems: "center", alignContent: "center" }}><Icon name='layers-outline' height={25} width={25} fill={"#000"} /></View>
            </View>
          }
          {!Load && listScheduled.length > 0 &&
            listScheduled.map((i, key) => {
              return (
                <Row key={key} i={i} goToScreen={goToScreen} goToViewMeet={props.goToViewMeet} />
              )
            })
          }
        </ScrollView>
      </View>
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
export default ListScheduledClient;

function Item(props) {
  const [menu, setmenu] = useState(false);
  const [EditM, setEditM] = useState(false);
  const [State, setState] = useState("");
  if (props.i.state === 3) { setState("realizada") }
  if (props.i.state === 4) { setState("cancelada") }
  if (props.i.photos === "si" && props.i.state === 0) { setState("pendiente por historial clínico"); }
  if (props.i.photos === "si" && props.i.state === 1) { setState("pendiente por subir fotos"); }
  if (props.i.photos === "si" && props.i.state === 2) { setState("por realizar"); }
  if (props.i.photos === "no" && props.i.state === 0) { setState("pendiente por historial clínico"); }
  if (props.i.photos === "no" && props.i.state === 1) { setState("por realizar"); }

  return (
    <View style={styles.item}>
      <View style={styles.itemInfo} onPress={() => setmenu(!menu)}>
        <Text style={[styles.col, { width: "22%", }]}>{State}</Text>
        <Text style={[styles.col, { width: "22%", }]}>{props.i.scheduled_day}</Text>
        <Text style={[styles.col, { width: "22%" }]}>{props.i.scheduled_time}</Text>
        <Small days={props.i.scheduled_day} hours={props.i.scheduled_time} size={12} color={"#f00"} w={"40%"} />
        <TouchableOpacity onPress={() => setmenu(!menu)} style={{ width: "12%", alignItems: "center", alignContent: "center" }}>
          <Icon name='more-vertical-outline' height={25} width={25} fill={"#000"} />
        </TouchableOpacity>
      </View>
      {menu &&
        <View style={styles.itemMenu}>
          <TouchableOpacity style={styles.btnMenu}>
            <Icon name='video-outline' height={25} width={25} fill={colorBetta} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMenu} onPress={() => props.goToViewMeet("AdminMeet", props.i.code)}>
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