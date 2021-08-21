import React, { useState, useEffect } from 'react';
import { Platform, Dimensions, View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-eva-icons';
import BTN from './BTN.js';
import {colorAA, colorAlfa,  colorDelta, colorEta, } from '../Colors';
import Toast from 'react-native-simple-toast';
import { serverCrm, base_url } from '../Env'
import axios from 'axios'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function NewMeet(props) {
  const [Load, setLoad] = useState(false);
  const [user, setuser] = useState(props.user);
  const [format, setformat] = useState(false);
  const [successful, setsuccessful] = useState(false);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [title, settitle] = useState({ title: "" });
  const [type, settype] = useState([]);
  const [showListType, setshowListType] = useState(false);
  const [ListType, setListType] = useState([
    { "value": "Bodily", "name": "Corporal" },
    { "value": "Facial", "name": "Facial" },
    { "value": "Mammary", "name": "Mamario" },
    { "value": "Minor procedures", "name": "Procedimientos Menores" },
    //{ "value": "VAGINAL AESTHETICS", "name": "Estética Vaginal" },
    { "value": "Pielis", "name": "Pielis" }
  ]);
  const [RequirePhotos, setRequirePhotos] = useState(false);
  const [date, setDate] = useState(new Date());
  const [day, setday] = useState(null);
  const [hour, sethour] = useState(null);
  const [getday, setgetday] = useState(false);
  const [gethour, setgethour] = useState(false);

  useEffect(() => {
    refresh()
  }, [user]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setgetday(true)
  };

  const showTimepicker = () => {
    showMode('time');
    setgethour(true)
  };

  useEffect(() => {
    if (date !== 0) {
      var hoy = date
      let year = hoy.getFullYear()
      let month = hoy.getMonth() + 1;
      let day = hoy.getDate();
      let hour = hoy.getHours()
      let minute = (hoy.getMinutes())
      let second = hoy.getSeconds()
      var fecha = zfill(day, 2) + '-' + zfill(month, 2) + '-' + year;
      var hora = zfill(hour, 2) + ':' + zfill(minute, 2) + ':' + "00";
      setday(fecha);
      sethour(hora);
    }
  }, [date]);

  function zfill(number, width) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = "0";
    if (width <= length) {
      if (number < 0) {
        return ("-" + numberOutput.toString());
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
      } else {
        return ((zero.repeat(width - length)) + numberOutput.toString());
      }
    }
  }


  useEffect(() => {
    if (successful === true) {
      setTimeout(() => {
        console.log("bye bye")
        props.hidden()
        refresh()
      }, 3000);
    }
  }, [successful]);

  function refresh() {
    Toast.show('Refreshing.');
    setday(null);
    sethour(null);
    setformat(false);
    setgethour(false);
    setgetday(false);
    setsuccessful(false);
    onChangeText("", 't');
    settype([]);
    setshowListType(false);
    setRequirePhotos(false);
    setLoad(false);
  }

  function selectType(e) {
    setshowListType(false);
    settype(e)
  }

  function onChangeText(text, key) {
    settitle({
      ...title,
      [key]: text
    })
  }

  async function savemeet() {
    if (title.title === "" || type.length === 0 || hour === null || day === null) {
      console.log("Debe completar el cormulario.");
      Toast.show("Debe completar el cormulario.");
    }
    else {
      setLoad(true);
      Toast.show("Guardando...");
      let keyRandom = "", array, photos;
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        keyRandom += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      if (RequirePhotos === true) { photos = 'si' }
      else { photos = 'no' }
      array = {
        "title": title.title,
        "type_name": type.name,
        "type_value": type.value,
        "RequirePhotos": photos,
        "code": keyRandom,
        "id_medic": 1,
        "id_client": user.id,
        "scheduled_day": day,
        "scheduled_time": hour,
        'state': 0
      }
      await axios.post(base_url(serverCrm, `new/valoration/scheduled`), array).then(function (response) {
        if (response.data === true) {
          console.log(response.data)
          Toast.show('Video Valoración agendada.');
          setsuccessful(true)
        }
        else {
          console.log(response.data)
          Toast.show('error.');
        }
      })
        .catch(function (error) { console.log("?", error) })
      setLoad(false);
    }
  }

  useEffect(() => {
    if (format === true) {
      setTimeout(() => {
        setformat(false)
      }, 5000);
    }
  }, [format]);

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        {successful === true &&
          <View style={[styles.wrap, { paddingVertical: 20 }]}>
            <Icon name='checkmark-circle-outline' height={60} width={60} fill={colorDelta} />
            <Text style={[styles.text, { marginTop: 10 }]}>Programación exitosa</Text>
          </View>
        }
        {successful === false &&
          <View style={styles.wrap}>
            <Text style={styles.text}>Estas programando una video valoración para:</Text>
            <Text style={[styles.text, { marginBottom: 20, fontWeight: "bold", textTransform: "capitalize" }]}>{props.user.names} {props.user.surnames}.</Text>
            <View style={styles.row}>
              <Text style={styles.textFormLabel}>Dale un Título:</Text>
              <TextInput style={[styles.textFormText, { marginVertical: -15,bottom:5, borderBottomColor:"silver", borderBottomWidth:1 }]}
                value={title.title}
                onChangeText={text => onChangeText(text, 'title')}
              />
            </View>
            <TouchableOpacity style={styles.row} onPress={() => setshowListType(!showListType)}>
              <Icon name={showListType === true ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} height={20} width={20} fill={colorEta} />
              <Text style={styles.textFormLabel}>Seleccion un tipo:</Text>
              <Text style={styles.textFormText}>{type.name}</Text>
            </TouchableOpacity>

            {showListType === true && ListType.map((i, key) => {
              return (
                <TouchableOpacity onPress={() => selectType(i)} style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0.05)", width: "100%", padding: 10, marginBottom: 2 }}>
                  <Icon name={i.name === type.name ? 'checkmark' : 'arrow-right'} height={20} width={20} fill={colorEta} />
                  <Text style={{ marginLeft: 10 }}>{i.name}</Text>
                </TouchableOpacity>
              )
            })}
            <TouchableOpacity onPress={() => setRequirePhotos(!RequirePhotos)} style={styles.row}>
              <Text style={[styles.text, { fontWeight: "bold", marginLeft: 25, textAlign: "left" }]}>Requiere Fotos?</Text>
              <Icon name={RequirePhotos ? 'checkmark-square-2-outline' : 'square-outline'} fill={RequirePhotos ? 'green' : 'silver'} width={30} height={30} style={{ right: 20 }} />
            </TouchableOpacity>
            {!Load &&
              <View style={{ marginTop: 20, flexDirection: "row", }}>
                <BTN icon="calendar-outline" text="Seleccionar día" function={showDatepicker} screen="Login" data={"douglas"} w={"60%"} />
                {day !== null && getday === true &&
                  <Text style={{ marginLeft: -10, textAlign: "center", marginTop: -1, borderBottomWidth: 1, borderBottomColor: colorAA, lineHeight: 40, width: 120 }}>{day}</Text>
                }
              </View>
            }
            {!Load &&
              <View style={{ marginTop: 10, flexDirection: "row", marginBottom: 10 }}>
                <BTN icon="clock-outline" text="Selecionar hora" function={showTimepicker} screen="Login" data={"douglas"} w={"60%"} />
                {hour !== null && gethour === true && <Text style={{ marginLeft: -10, textAlign: "center", marginTop: -1, borderBottomWidth: 1, borderBottomColor: colorAA, lineHeight: 40, width: 120 }}>{hour}</Text>
                }
              </View>
            }
            <BTN icon="save-outline" text="Guardar" function={savemeet} screen="Login" data={"douglas"} w={"60%"} />
            {Load &&
              <ActivityIndicator size="large" color={colorAlfa} style={{ marginVertical: 20 }} />
            }
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <View style={{ width: "100%", marginTop: 5, flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={() => refresh()} style={{ marginHorizontal: 5, width: 40, height: 40, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Icon name='refresh-outline' height={30} width={30} fill={'silver'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setformat(!format)} style={{ marginHorizontal: 5, width: 40, height: 40, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Icon name={format ? 'close-circle-outline' : 'alert-circle-outline'} height={30} width={30} fill={'silver'} />
              </TouchableOpacity>
            </View>
            {format === true &&
              <Text style={{ textAlign: "center", fontSize: 14, color: "#777" }}>
                El formato de hora que se usa es el de 24 horas.
              </Text>
            }
          </View>
        }
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    marginTop: 50,
    width: windowWidth - 40,
    maxHeight: windowHeight - 80,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: "column"
  },
  wrap: {
    width: "100%",
    alignContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    width: "90%",
    fontSize: 14,
  },
  textFormLabel: {
    width: "40%",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold"
  },
  textFormText: {
    width: "60%",
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomColor: "silver",
    borderBottomWidth: 0.5
  }
});
export default NewMeet;