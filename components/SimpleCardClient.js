import React, { useState, } from 'react';
import { Text, View,  TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import NewMeet from './NewMeet.js';
import ListScheduledClient from './ScheduledListClient';
import { colorBetta, colorKappa, colorZeta,  } from '../Colors';
import _ from 'lodash';
import { Icon } from 'react-native-eva-icons';

function SimpleCardClient(props) {
  const ICON = 20;
  const [show, setshow] = useState(false);
  const [newmeet, setnewmeet] = useState(false);
  const [listScheduled, setlistScheduled] = useState(false);

  function avatar(g) {
    if (g === 1) { return (<Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={require('../images/mas.png')} />); }
    else { if (g === 2) { return (<Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={require('../images/fem.png')} />); } }
  }

  function getDay(data, e) {
    let datas, created_days, created_day, day, created_hours, created_hour, hour
    datas = data.split(" ")
    created_days = datas[0]
    created_day = created_days.split("-")
    day = created_day[2] + "-" + created_day[1] + "-" + created_day[0]
    created_hours = datas[1]
    if (e === 0) { return day; }
    else {
      if (e === 1) { return created_hours; }
    }
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => props.goToScreen("ClientView", props.data)}
        onLongPress={() => setshow(!show)} style={styles.cardWrap}>
        <View style={styles.avatar}>
          <View style={{ overflow: "hidden", backgroundColor: "white", width: 65, height: 65, borderRadius: 40 }}>
            {avatar(props.data.gender)}
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.group}>
            <Text style={styles.label}>nombres:</Text>
            <Text style={styles.text}>{props.data.names}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label}>Apellidos:</Text>
            <Text style={styles.text}>{props.data.surnames}</Text>
          </View>
        </View>
        <View style={styles.dates}>
          <View style={styles.group}>
            <Text style={[styles.label, { textAlign: "right" }]}>usuario desde:</Text>
            <Text style={[styles.text, { textAlign: "right" }]}>{getDay(props.data.created_at, 0)}</Text>
          </View>
        </View>
        {show === false &&
          <View style={{ position: "absolute", zIndex: 999, bottom: 10, right: 10 }}>
            <Icon name='more-vertical-outline' width={20} height={20} fill={colorKappa} />
          </View>
        }
      </TouchableOpacity>
      {show === true &&
        <View style={styles.DownBar}>
          <TouchableOpacity onPress={() => props.goToScreen("ClientView", props.data)}
            style={styles.btn}>
            <Icon name='edit-outline' width={ICON} height={ICON} fill={colorBetta} />
            <Text style={styles.minText}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setnewmeet(!newmeet)} style={styles.btn}>
            <Icon name='calendar-outline' width={ICON} height={ICON} fill={colorBetta} />
            <Text style={styles.minText}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setlistScheduled(!listScheduled)} style={styles.btn}>
            <Icon name='list-outline' width={ICON} height={ICON} fill={colorBetta} />
            <Text style={styles.minText}>Ver Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setshow(!show)} style={styles.btn}>
            <Icon name='close-outline' width={ICON} height={ICON} fill={colorBetta} />
            <Text style={styles.minText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      }
      <Modal animationType="slide" transparent={true} visible={newmeet} >
        <View style={{ backgroundColor: colorKappa, width: "100%", height: "100%", position: "absolute", zIndex: 999, alignContent: "center", alignItems: "center", }}>
          <TouchableOpacity
            onPress={() => setnewmeet(!newmeet)}
            style={{
              position: "absolute", right: 10, top: 10
            }}>
            <Icon name="close-circle-outline" fill={colorZeta} width={40} height={40} />
          </TouchableOpacity>
          <NewMeet user={props.data} hidden={() => setnewmeet(!newmeet)} />
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={listScheduled} >
        <View style={{ backgroundColor: colorKappa, width: "100%", height: "100%", position: "absolute", zIndex: 999, alignContent: "center", alignItems: "center", }}>
          <TouchableOpacity
            onPress={() => setlistScheduled(!listScheduled)}
            style={{
              position: "absolute", right: 10, top: 10
            }}>
            <Icon name="close-circle-outline" fill={colorZeta} width={40} height={40} />
          </TouchableOpacity>
          <ListScheduledClient props={props} user={props.data} goToScreen={props.goToScreen} goToViewMeet={props.goToViewMeet} hidden={() => setlistScheduled(!listScheduled)} />
        </View>
      </Modal>
    </View>
  )
}

export default SimpleCardClient;
const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginBottom: 10,
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderTopColor: "white",
    borderRightColor: "rgba(0,0,0,0.05)",
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderLeftColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    alignContent: "center"
  },
  cardWrap: {
    width: "100%",
    flexDirection: "row",
    padding: 10
  },
  dates: {
    width: "35%",
  },
  avatar: {
    width: "20%",
    justifyContent: "center"
  },
  info: {
    width: "45%",
    flexDirection: "column",
  },
  group: {
    marginLeft: 10,
    flexDirection: "column"
  },
  label: {
    textTransform: "capitalize",
    fontSize: 14,
    color: colorKappa
  },
  text: {
    textTransform: "capitalize",
    fontSize: 14,
    color: colorKappa,
    fontWeight: "bold"
  },
  DownBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    backgroundColor: colorZeta
  },
  btn: {
    flexDirection: "row",
    paddingVertical: 4,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "22%",
    borderRadius: 20,
    borderColor: colorBetta,
    borderWidth: 1
  },
  minText: {
    textAlign: "center",
    marginLeft: 2,
    color: colorBetta,
    fontSize: 10,
    fontWeight: "bold"
  },
})