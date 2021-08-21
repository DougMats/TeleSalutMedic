import React, { useState, useRef, useEffect } from "react";
import { AppRegistry, TouchableOpacity, Animated, Text, Image, View, StyleSheet, Dimensions, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { Icon } from 'react-native-eva-icons';
import { BG1, BG2, colorAA, colorAlfa, colorZeta } from '../Colors';
import RNFetchBlob from "rn-fetch-blob";
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import Toast from 'react-native-simple-toast';
import { serverCrmTestDrawer, base_url, file_server1 } from '../Env'
var RNFS = require('react-native-fs')
import socketIOClient from 'socket.io-client/dist/socket.io.js';
const screen = Dimensions.get("window");

const SideBar = (props) => {
  const [Show, setShow] = useState(false);
  const [paciente, setpaciente] = useState(props.data.paciente);
  const [listphotos, setlistphotos] = useState(props.data.images);
  const [HistoriaClinica, setHistoriaClinica] = useState(props.data.historiaClinica);
  const [ViewHCData, setViewHCData] = useState(false);
  const [ViewHCHC, setViewHCHC] = useState(true);
  const [photoSelected, setphotoSelected] = useState(null);
  const [viewListImg, setviewListImg] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [menu, setmenu] = useState('img');
  const [socket, setsocket] = useState(false)

  React.useEffect(() => {
    console.log(['. . . . . . . . . .  SOCKET SERVER CONNECTING . . . . . . . . . . . . . . ']);
    setsocket(socketIOClient("http://31.220.60.218:3000"))
  }, [])

  React.useEffect(() => {
    if (socket) {
      console.log(['. . . . . . . . . .  POSTS SERVER PROVISIONING . . . . . . . . . . . . . . '])
      socket.on('askForUserId', () => {
        console.log(['. . . . . . . . . .  POSTS SERVER CONNECTED123 . . . . . . . . . . . . . . '])
        socket.emit('userIdReceived', "doctor");  //id del doctor
      })
      socket.on('disconnect', () => {
        console.log(['. . . . . . . . . . . . . . . . . . . POSTS SERVER DISCONNECTED  . . . . . . . . . . . . . . . . . . .'])
      })
    }
  }, [socket])

  const fadeIn = () => {
    console.log("in")
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start();
    setShow(true);
  };

  const fadeOut = () => {
    console.log("out")
    Animated.timing(fadeAnim, {
      toValue: screen.width,
      duration: 100,
      useNativeDriver: true
    }).start();
    setShow(false);
  };

  useEffect(() => {
    setviewListImg(false)
  }, [photoSelected]);


  useEffect(() => {
    if (listphotos.length > 0) {
      Download()
    }
  }, [listphotos]);

  function Download() {
    console.log("descargado imagenes quien sabe donde?")
    let RN_large = {}
    listphotos.map((item, key) => {
      console.log('Creando instancia', key)
      RN_large[key] = RNFetchBlob
    })

    listphotos.map((item, key) => {
      console.log('Ejecutando instancia', key)
      console.log("->", base_url(file_server1, `img/TeleSalud/valorations/${item.image}`))
      RN_large[key].config({
        path: `/storage/emulated/0/DCIM/Camera/${props.data.id}/${key}_name.png`,
        fileCache: true
      })
        .fetch("GET", base_url(file_server1, `img/TeleSalud/valorations/${item.image}`), {})
        .progress((received, total) => { })
        .then(res => {
          console.log('download complete')
        });
    })
  }

  return (
    <SafeAreaView style={[styles.container, { width: screen.width, height: Show === false ? 45 : screen.height + 30 }]}>
      <View style={{ position: "absolute", top: 0, backgroundColor: "rgba(0,0,0,1)", height: 45, width: "100%" }}></View>
      {Show === false &&
        <TouchableOpacity onPress={fadeIn}
          style={[{ position: "absolute", right: 10, top: 5, zIndex: 999 },//styles.btnDrawer
          ]}>
          <Icon name="more-vertical-outline" width={30} height={30} fill="#fff" />
        </TouchableOpacity>
      }
      {Show === true &&
        <TouchableOpacity onPress={fadeOut}
          style={[{ position: "absolute", left: 10, top: 5, zIndex: 999 }, //styles.btnDrawer
          ]}>
          <Icon name="arrow-ios-back-outline" width={30} height={30} fill="#fff" />
        </TouchableOpacity>
      }
      <Animated.View style={[styles.sidebar, { height: Show === true ? "102%" : "0%", transform: [{ translateX: fadeAnim }] }]}>
        {props.data.photos === 'si' && Show && menu === 'img' &&
          <View style={{ position: "absolute", zIndex: 999, top: 15, left: 0, flexDirection: "row", width: "40%", padding: 5, paddingTop: 0, justifyContent: "flex-start", paddingRight: 50, height: 50 }} >
            <TouchableOpacity style={[styles.btnDrawer, { position: "absolute", left: 80, top: -15, zIndex: 999 }]} onPress={() => setviewListImg(!viewListImg)}>
              <Icon name={viewListImg ? "close-circle-outline" : "image-outline"} width={30} height={30} fill="#fff" /></TouchableOpacity>
          </View>
        }
        {Show && menu === 'img' &&
          <View style={{ position: "absolute", zIndex: 999999, top: 40, right: 0, flexDirection: "row", width: "100%", justifyContent: "space-around", }}>
            <View style={{ flexDirection: "column", width: "100%", height: "100%" }}>
              {viewListImg === true &&
                <View style={{ paddingHorizontal: 10, flexDirection: "row", width: "100%", justifyContent: "space-around", }} >
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {listphotos.map((i, key) => {
                      return (
                        <TouchableOpacity key={key} onPress={() => setphotoSelected(key)} style={{ overflow: "hidden", width: 80, height: 80, borderRadius: 12, marginHorizontal: 5, marginVertical: 10 }}>
                          <Image style={{ width: null, height: null, flex: 1, resizeMode: "cover" }} source={{ uri: `${file_server1}/img/TeleSalud/valorations/${i.image}` }} />
                        </TouchableOpacity>
                      )
                    })}
                  </ScrollView>
                </View>
              }
            </View>
          </View>
        }
        {Show && !viewListImg &&
          <View style={{ flexDirection: "row", width: "80%", position: "absolute", top: menu === 'img' ? 50 : 0, zIndex: 99999999, justifyContent: "space-around" }}>
            <TouchableOpacity onPress={() => setmenu('img')} style={{ backgroundColor: colorAlfa, justifyContent: "center", height: 40, paddingTop: 5, flexDirection: "row", width: "45%", marginHorizontal: 2, borderRadius: 5 }}>
              <Text style={{ textAlign: "center", lineHeight: 25, fontSize: 14, color: colorZeta, textTransform: "capitalize", marginRight: 10, fontWeight: "bold" }}>Imagenes</Text>
              <Icon name={menu === 'img' ? 'checkmark-square-2-outline' : 'square-outline'} width={25} height={25} fill={colorZeta} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setmenu('hc')} style={{ backgroundColor: colorAlfa, justifyContent: "center", height: 40, paddingTop: 5, flexDirection: "row", width: "45%", marginHorizontal: 2, borderRadius: 5 }}>
              <Text style={{ textAlign: "center", lineHeight: 25, fontSize: 14, color: colorZeta, textTransform: "capitalize", marginRight: 10, fontWeight: "bold" }}>História Clínica</Text>
              <Icon name={menu === 'hc' ? 'checkmark-square-2-outline' : 'square-outline'} width={25} height={25} fill={colorZeta} />
            </TouchableOpacity>
          </View>
        }
        {
          Show && photoSelected !== null && menu === 'img' &&
          <TouchableOpacity onPress={() => setphotoSelected(null)} style={{ backgroundColor: "white", borderRadius: 4, zIndex: 999999, position: "absolute", right: 10, bottom: 50 }}>
            <Icon name="trash-2-outline" width={30} height={30} fill="#000" />
          </TouchableOpacity>
        }
        {
          Show && photoSelected === null && menu === 'img' &&
          <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.5)", padding: 20, borderRadius: 20 }}>
            <Icon name="image-outline" width={200} height={200} fill="#333" />
            <Text style={{ width: "100%", color: "#333", textAlign: "center", fontSize: 20 }}>No has seleccionado una imagen</Text>
          </View>
        }
        {
          Show && photoSelected !== null && menu === 'img' &&
          <Drawer
            _key={photoSelected}
            data={props.data}
            socket={socket}
          />
        }

        {Show && menu === 'hc' &&
          <View style={styles.HCwrap}>
            <Text style={styles.HCtitle}>história Cínica 🙄</Text>
            <View style={styles.HCwrapper}>
              <ScrollView scrollEventThrottle={16}>
                <TouchableOpacity onPress={() => setViewHCData(!ViewHCData)} style={{ borderBottomWidth: 0.8, borderBottomColor: colorAA, backgroundColor: colorAlfa, justifyContent: "center", flexDirection: "row", padding: 10 }}>
                  <Text style={{ width: "100%", textAlign: "center", color: colorZeta, fontWeight: "bold", fontSize: 16, }}>Datos personales</Text>
                  <Icon name={ViewHCData ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} width={25} height={25} fill={colorZeta} style={{ position: "absolute", right: 20 }} />
                </TouchableOpacity>
                {ViewHCData &&

                  <>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>nombres:</Text>
                      <Text style={styles.rowDown}>{paciente.names}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>apellidos:</Text>
                      <Text style={styles.rowDown}>{paciente.surnames}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>edad:</Text>
                      <Text style={styles.rowDown}>{paciente.age}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>identification:</Text>
                      <Text style={styles.rowDown}>{paciente.identification}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>email:</Text>
                      <Text style={styles.rowDown}>{paciente.email}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>Teléfono:</Text>
                      <Text style={styles.rowDown}>{paciente.phone}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>estrato social:</Text>
                      <Text style={styles.rowDown}>{paciente.socialStratum}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>genero:</Text>
                      <Text style={styles.rowDown}>{paciente.gender === 1 ? "Masculino" : "Femenino"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>occupación:</Text>
                      <Text style={styles.rowDown}>{paciente.occupation}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>Fecha de nacimiento:</Text>
                      <Text style={styles.rowDown}>{paciente.dateBirthDay}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>usuario desde:</Text>
                      <Text style={styles.rowDown}>{paciente.created_at}</Text>
                    </View>
                  </>
                }
                <TouchableOpacity onPress={() => setViewHCHC(!ViewHCHC)} style={{ backgroundColor: colorAlfa, justifyContent: "center", flexDirection: "row", padding: 10 }}>
                  <Text style={{ width: "100%", textAlign: "center", color: colorZeta, fontWeight: "bold", fontSize: 16, }}>Datos Clínicos</Text>
                  <Icon name={ViewHCHC ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} width={25} height={25} fill={colorZeta} style={{ position: "absolute", right: 20 }} />
                </TouchableOpacity>
                {ViewHCHC &&
                  <>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>Peso:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.peso} Kg.</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>Altura:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.altura} cm.</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>alcohol:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.alcohol}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>fuma:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.fuma}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      <Text style={styles.rowUp}>hijos:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.hijos}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      {HistoriaClinica.alergias === "si" &&
                        <TouchableOpacity style={{ left: 10, height: 45, width: "100%", position: "absolute", zIndex: 9, justifyContent: "center", alignContent: "flex-end", alignItems: "flex-end" }}>
                          <Icon name='arrow-ios-upward-outline' width={25} height={25} fill={"#777"} />
                        </TouchableOpacity>
                      }
                      <Text style={styles.rowUp}>alergias:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.alergias}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      {HistoriaClinica.medicamentos === "si" &&
                        <TouchableOpacity style={{ left: 10, height: 45, width: "100%", position: "absolute", zIndex: 9, justifyContent: "center", alignContent: "flex-end", alignItems: "flex-end" }}>
                          <Icon name='arrow-ios-upward-outline' width={25} height={25} fill={"#777"} />
                        </TouchableOpacity>
                      }
                      <Text style={styles.rowUp}>medicamentos:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.medicamentos}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      {HistoriaClinica.operaciones === "si" &&
                        <TouchableOpacity style={{ left: 10, height: 45, width: "100%", position: "absolute", zIndex: 9, justifyContent: "center", alignContent: "flex-end", alignItems: "flex-end" }}>
                          <Icon name='arrow-ios-upward-outline' width={25} height={25} fill={"#777"} />
                        </TouchableOpacity>
                      }
                      <Text style={styles.rowUp}>operaciones:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.operaciones}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "100%", height: 45, paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: colorAlfa }}>
                      {HistoriaClinica.enfermedades === "si" &&
                        <TouchableOpacity style={{ left: 10, height: 45, width: "100%", position: "absolute", zIndex: 9, justifyContent: "center", alignContent: "flex-end", alignItems: "flex-end" }}>
                          <Icon name='arrow-ios-upward-outline' width={25} height={25} fill={"#777"} />
                        </TouchableOpacity>
                      }
                      <Text style={styles.rowUp}>enfermedades:</Text>
                      <Text style={styles.rowDown}>{HistoriaClinica.enfermedades}</Text>
                    </View>
                  </>
                }
              </ScrollView>
            </View>
          </View>
        }
      </Animated.View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    zIndex: 9999,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center"
  },
  sidebar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9,
    backgroundColor: "rgba(0,0,0,0.8)"
  },
  btnDrawer: {
    marginTop: 5,
    marginHorizontal: 5,
    marginVertical: 8,
    height: 35, width: 60,
    backgroundColor: colorAlfa, justifyContent: 'center', alignItems: 'center', borderRadius: 5,
  },
  btnDrawer2: {
    marginTop: 5,
    marginHorizontal: 2.5, marginVertical: 8, width: 35, height: 35, borderRadius: 15,
  },
  HCwrap: {
    width: "100%",
    height: "90%",
    position: "absolute",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  HCtitle: {
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 24,
    color: colorZeta,
    textTransform: "capitalize"
  },
  HCwrapper: {
    backgroundColor: colorZeta,
    width: "90%",
    maxHeight: "90%",
    flexDirection: "column",
    borderRadius: 12,
    overflow: "hidden"
  },
  HCrow: {
    marginTop: 5,
    height: 30,
    borderBottomColor: colorAlfa,
    borderBottomWidth: 1,
    flexDirection: "row",
    width: "100%"
  },
  HCrowL: {
    fontSize: 14,
    color: "#000",
    lineHeight: 30,
    textAlign: "right",
    paddingRight: 10,
    width: "40%"
  },
  HCrowR: {
    lineHeight: 30,
    fontSize: 14,
    fontWeight: "bold",
    width: "60%",
    paddingLeft: 10
  },
  rowUp: {
    width: "40%",
    textTransform: "capitalize"
  },
  rowDown: {
    fontSize: 14,
    fontWeight: "bold",
    width: "60%",
    textTransform: "capitalize"
  },
});

function Drawer(props) {
  const [load, setload] = useState(false);
  return (
    <View style={{ marginTop: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 99, justifyContent: "space-around" }}>
        <RNSketchCanvas
          localSourceImage={{ filename: `/storage/emulated/0/DCIM/Camera/${props.data.id}/${props._key}_name.png`, directory: null, mode: 'AspectFit' }}
          containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
          canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
          defaultStrokeIndex={0}
          defaultStrokeWidth={5}
          undoComponent={<View style={styles.btnDrawer}><Icon name="rewind-left-outline" width={30} height={30} fill="#fff" /></View>}
          clearComponent={<View style={styles.btnDrawer}><Icon name="trash-2-outline" width={30} height={30} fill="#fff" /></View>}
          saveComponent={<View style={styles.btnDrawer}>{load === true ? <ActivityIndicator size={25} color={"#fff"} /> : <Icon name="upload-outline" width={30} height={30} fill="#fff" />} </View>}
          strokeComponent={color => (<View style={[{ backgroundColor: color }, styles.btnDrawer2]} />)}
          strokeSelectedComponent={(color, index, changed) => { return (<View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />) }}
          strokeWidthComponent={(w) => {
            console.log("strokeWidthComponent: ", w)
            return (
              <View style={{
                marginHorizontal: 2.5, marginVertical: 8, width: 35, height: 35, borderRadius: 18,
                justifyContent: 'center', alignItems: 'center', backgroundColor: colorAlfa, marginTop: 5,
              }}>
                <Text style={{ color: "white", position: "absolute", top: 6, fontSize: 16, zIndex: 9, fontWeight: "bold" }}>{w}</Text>
              </View>
            )
          }}
          savePreference={() => {
            console.log("savePreference")
            return {
              folder: `TelesaludApp/${props.item_code}/upload/`,
              filename: 'large',
              transparent: false,
              includeImage: true,
              cropToImageSize: false,
              imageType: 'png'
            }
          }}

          onSketchSaved={async (success, path) => {
            setload(true);
            const base64data = await RNFS.readFile(path, 'base64').then()
            console.log("nueva ruta send")
            console.log(base_url(serverCrmTestDrawer, `api/save/img`))
            fetch(base_url(serverCrmTestDrawer, `api/save/img`), {
              method: 'post',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                code: props.data.id,
                image: base64data
              })
            }).then(res => res.json())
              .then((res) => {
                console.log('Envio satisfactorio')
                Toast.show('Envio satisfactorio')
                props.socket.emit('syncScreen', {
                  "client_id": props.data.id_client,
                  "valoration_id": props.data.id
                })
              }).catch((error) => {
                console.log('www Error al enviar la foto', error)
                Toast.show('www Error al enviar la foto')
              });
            setTimeout(() => {
              setload(false);
            }, 2000);
          }}
        />
      </View>
    </View>
  );
}
AppRegistry.registerComponent('Example', () => Example);
export default SideBar;