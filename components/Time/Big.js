import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { View, Text, StyleSheet } from 'react-native'
import { GetDiference, zfill } from './logic.js';
function TimeOut(props) {
  const time = new Date();
  const [status, setstatus] = useState(true);
  const [count, setcount] = useState(GetDiference(props.days, props.hours));
  time.setSeconds(time.getSeconds() + count);
  function SetStatus(e) {
    setstatus(e)
  }
  return (
    <MyTimer
      status={status}
      expiryTimestamp={time}
      title={props.title}
      status={status}
      SetStatus={SetStatus}
    />
  );
}
function MyTimer({ expiryTimestamp, title, status, SetStatus }) {
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp, onExpire: () => SetStatus(!status) });
  if (status === true) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.reloj}>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(days, 2)}</Text>
            <Text style={styles.name}>dias</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(hours, 2)}</Text>
            <Text style={styles.name}>horas</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(minutes, 2)}</Text>
            <Text style={styles.name}>minutos</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.number}>{zfill(seconds, 2)}</Text>
            <Text style={styles.name}>segundos</Text>
          </View>
        </View>
      </View>
    )
  }
  else {
    return (<Text style={[{textTransform: "uppercase"}, styles.number]}>tiempo agotado</Text>)
  }
}
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    flexDirection: "column",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#000",
    paddingHorizontal: 30
  },
  reloj: {
    flexDirection: "row",
    justifyContent: "center"
  },
  group: {
    borderRadius: 12,
    backgroundColor: "white",
    width: 65,
    height: 80,
    margin: 2,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.84,
    elevation: 5,
  },
  number: {
    fontWeight: "bold",
    color: "red",
    fontSize: 30,
    textAlign: "center"
  },
  name: {
    textTransform: "capitalize",
    textAlign: "center",
    color: "#777",
    fontSize: 12
  },
})


export default TimeOut;