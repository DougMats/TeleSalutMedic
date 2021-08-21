import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, ScrollView, Modal, StyleSheet, SafeAreaView, TouchableOpacity, View, Text, TextInput } from 'react-native';
import Head from '../components/Head';
import Menu from '../components/Menu';
import { Icon } from 'react-native-eva-icons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import UserContext from '../contexts/UserContext'
import { serverCrm, base_url } from '../Env'
import axios from 'axios'
import { GB1, BG2, colorAlfa, colorBettaLight, colorIota, colorBetta, colorZeta } from '../Colors';
import BTN from '../components/BTN.js';
import _ from 'lodash';
import QuotationCard from './QuotationCard.js';

function Quotation(props) {
  console.log("_________Quotation Screen________")
  const { navigation } = props;
  const [Load, setLoad] = useState(true);
  const [id_cita, setid_cita] = useState("A3NQ");
  const [Quotation, setQuotation] = useState(null);
  const [SumaTotal, setSumaTotal] = useState(0);
  const [Patient, setPatient] = useState(undefined);
  const [Valoration, setValoration] = useState(undefined);
  const [ListPatient, setListPatient] = useState([]);
  const { userDetails, setUserDetails } = useContext(UserContext)
  const [Form, setForm] = useState({ name: "plan nutricional", description: "lo que la nutri quiera escribir aqui", price: "450000", qty: 1 });
  const [add, setadd] = useState(false);
  const [QuotationList, setQuotationList] = useState([]);
  const [display, setdisplay] = useState(false);
  const [listTitle, setlistTitle] = useState("");
  const [getV, setgetV] = useState(false);
  const [getP, setgetP] = useState(false);
  const [ListValoration, setListValoration] = useState([]);
  const [ListValorationByClient, setListValorationByClient] = useState([]);
  const [ListValorationByClientCount, setListValorationByClientCount] = useState(0);
  const [Successfully, setSuccessfully] = useState(false);
  let randomCode
  if (props.route.params) {
    randomCode = props.route.params.randomCode
  } else {
    randomCode = 1
  }

  useEffect(() => {
    console.log("getting ", props.route.params.code)
    setid_cita(props.route.params.code);
  }, [randomCode]);

  useEffect(() => {
    if (id_cita !== 0) {
      Get(id_cita)
    }
    else {
      GetClients(userDetails.id, "_");
    }
  }, [id_cita]);

  async function Get(id) {
    console.log(base_url(serverCrm, `get/scheduled/valoration/${id}`))
    await axios.get(base_url(serverCrm, `get/scheduled/valoration/${id}`)).then(function (response) {
      if (response.data.length === 0) {
        console.log("vacio")
      }
      else {
        setPatient(response.data.names)
        setValoration(response.data.name)
        GetList(response.data.id_client)
        GetQuotation(response.data.id_cita)
      }
    })
      .catch(function (error) { console.log("?", error) })
  }

  async function GetClients(id, lk) {
    let list
    await axios.get(base_url(serverCrm, `get/myClients/${id}/${lk}`)).then(function (response) {
      list = response.data
    })
      .catch(function (error) { console.log("?", error) })
    setListPatient(list)
  }

  async function GetList(id) {
    await axios.get(base_url(serverCrm, `get/list/valorations/client/${id}`)).then(function (response) {
      setListValoration(response.data)
    })
      .catch(function (error) { console.log("?", error) })
  }

  useEffect(() => {
    let response = _.filter(ListValoration, ['state', 3]);
    setListValorationByClient(response)
    setListValorationByClientCount(response.length)
  }, [ListValoration]);

  async function SelectPatient() {
    setdisplay(true);
    setlistTitle("Seleccione el paciente");
    setgetP(true);
    setgetV(false);
  }

  function getPatient(e) {
    setPatient(e.names)
    GetList(e.id)
    setdisplay(false)
    setgetV(false);
    setgetP(false);
  }

  function SelectValoration() {
    setdisplay(true);
    setlistTitle("Seleccione la valoracion");
    setgetV(true);
    setgetP(false);
  }

  function getValoration(e) {
    setdisplay(false)
    setgetV(false);
    setgetP(false);
    setid_cita(e.id)
    setValoration(e.name)
    GetQuotation(e.id)
  }


  async function GetQuotation(id) {
    console.log("-+-+-+-+-++-+--++-+--++-GetQuotation")
    console.log(base_url(serverCrm, ` get/quotation/valoration/${id}`))
    await axios.get(base_url(serverCrm, `get/quotation/valoration/${id}`)).then(function (response) {
      setSumaTotal(response.data.price);
      if (response.data.list === undefined) {
        setQuotationList([])
      }
      else {
        setQuotationList(response.data.list);
      }
      setLoad(false);
    })
      .catch(function (error) { console.log("?", error) })
  }

  useEffect(() => {
    updatePrices()
  }, [QuotationList]);

  function onChangeText(text, key) {
    setForm({
      ...Form,
      [key]: text
    })
  }

  function setQTY(v) {
    let actual = Form.qty;
    let nuevo = actual + v;
    onChangeText(nuevo, 'qty')
  }

  function addItem() {
    let data = Form
    if (data.name === "" || data.description === "", data.price === "") {
      Toast.show('Debe completar el formulario.');
    }
    else {
      console.log("here")
      let idCount = QuotationList.length
      let newID = idCount + 1;
      data.id = newID
      setQuotationList([...QuotationList, data])
      setForm({ name: "", description: "", price: "", qty: 1 });
      setadd(false);
    }
  }

  function delItem(e) {
    let update = []
    for (var i in QuotationList) {
      if (QuotationList[i].id !== e) {
        update = [...update, QuotationList[i]]
      }
    }
    setQuotationList(update)
  }

  function updateItem(data) {
    let update = []
    for (var i in QuotationList) {
      if (QuotationList[i].id !== data.id) {
        update = [...update, QuotationList[i]]
      }
    }
    update = [...update, data]
    setQuotationList(update)
  }

  function updatePrices() {
    let sumatotal = 0
    for (let i in QuotationList) {
      let total = QuotationList[i].price * QuotationList[i].qty;
      sumatotal = sumatotal + total
    }
    setSumaTotal(sumatotal)
  }

  async function saveList() {
    let data = {
      "id_cita": id_cita,
      "price": SumaTotal,
      "list": QuotationList
    }
    await axios.post(base_url(serverCrm, `save/quotation/valoration`), data).then(function (response) {
      if (response.data[0] === true && response.data[1] === true) {
        Toast.show('Datos guardados con éxito');
        setSuccessfully(true)
      }
    })
      .catch(function (error) { console.log("?", error) })
  }

  useEffect(() => {
    if (Successfully === true) {
      setTimeout(() => {
        setSuccessfully(false);
      }, 5000);
    }
  }, [Successfully]);

  function print(DATA) {
    try {
      return DATA.map((i, key) => {
        return (
          <QuotationCard key={key} data={i} delItem={delItem} updateItem={updateItem} />
        )
      })
    }
    catch (e) {
      console.log("error: ", e)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={[GB1, BG2]} style={styles.imageBackground}>
        <Head props={props} return="Sala" />
        <ScrollView>
          <View style={{ paddingBottom: 60, marginTop: 60, width: "100%", alignItems: "center", alignContent: "center" }}>
            <View style={{
              shadowColor: colorIota,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 8.84,
              elevation: 5,
              backgroundColor: "white", width: "90%", borderRadius: 20, marginBottom: 20, alignItems: "center", alignContent: "center", padding: 10
            }}>
              <TouchableOpacity
                onPress={() => SelectPatient()}
                style={{ width: "90%", paddingVertical: 10, borderColor: colorAlfa, flexDirection: "row", marginBottom: 20, borderBottomWidth: 1, }}>
                <Text style={{ width: "30%", textAlign: "center", fontSize: 14, color: colorAlfa, fontWeight: "bold" }}>Paciente:</Text>
                {Patient !== undefined &&
                  <Text style={{ width: "70%", textAlign: "center", fontSize: 14, color: "#000", fontWeight: "bold" }}>{Patient}</Text>
                }

                {Patient === undefined &&
                  <Text style={{ width: "70%", textAlign: "center", fontSize: 14, color: "#000", fontWeight: "bold" }}>Seleccione el Paciente</Text>
                }
              </TouchableOpacity>

              {Patient !== undefined &&
                <TouchableOpacity onPress={() => SelectValoration()} style={{ width: "90%", paddingVertical: 10, borderColor: colorAlfa, flexDirection: "row", marginBottom: 20, borderBottomWidth: 1, }}>
                  <Text style={{ width: "30%", textAlign: "center", fontSize: 14, color: colorAlfa, fontWeight: "bold" }}>Valoración:</Text>
                  {Valoration !== undefined && <Text style={{ width: "70%", textAlign: "center", fontSize: 14, color: "#000", fontWeight: "bold" }}>{Valoration}</Text>}

                  {
                    Valoration === undefined &&
                    <Text style={{ width: "70%", textAlign: "center", fontSize: 14, color: "#000", fontWeight: "bold" }}>Seleccione una Valoración</Text>
                  }
                </TouchableOpacity>
              }
            </View>

            {!Load &&
              print(QuotationList)
            }

            {add === true &&
              <View style={{ backgroundColor: "white", width: "90%", borderRadius: 20, marginBottom: 20, alignItems: "center", alignContent: "center", padding: 10 }}>
                <TextInput value={Form.name} onChangeText={text => onChangeText(text, 'name')} style={{ marginBottom: 10, backgroundColor: "#eee", width: "100%", borderRadius: 12, height: 40 }} placeholder="Nombre" />
                <TextInput
                  value={Form.description}
                  onChangeText={text => onChangeText(text, 'description')}
                  multiline={true}
                  numberOfLines={4}
                  style={{ marginBottom: 10, backgroundColor: "#eee", width: "100%", borderRadius: 12, minHeight: 80 }} placeholder="Descripción" />
                <TextInput value={Form.price}
                  onChangeText={text => onChangeText(text, 'price')} style={{ marginBottom: 10, backgroundColor: "#eee", width: "100%", borderRadius: 12, height: 40 }} placeholder="Precio" />
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <TouchableOpacity onPress={() => setQTY(-1)} style={{ marginTop: 5 }}>
                    <Icon name='minus-circle-outline' height={30} width={30} fill={colorBetta} />
                  </TouchableOpacity>
                  <Text style={{ marginBottom: 10, marginHorizontal: 10, backgroundColor: "#eee", width: "30%", textAlign: "center", lineHeight: 35, borderRadius: 12, height: 40 }}>
                    {Form.qty}
                  </Text>
                  <TouchableOpacity onPress={() => setQTY(+1)} style={{ marginTop: 5 }}>
                    <Icon name='plus-circle-outline' height={30} width={30} fill={colorBetta} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                  <BTN icon="close-circle-outline" text="Cerrar" function={setadd} w={"40%"} data={false} />
                  <BTN icon="save-outline" text="Guardar" function={addItem} w={"40%"} data={'adcd'} />
                </View>
              </View>
            }
            {SumaTotal !== 0 &&
              <TouchableOpacity onPress={() => saveList()}
                style={{
                  flexDirection: "row", overflow: "hidden", marginBottom: 20, backgroundColor: colorZeta, width: "90%", borderRadius: 20,
                  shadowColor: colorIota,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 8.84,
                  elevation: 5,
                }}>
                <View style={{ width: "70%", flexDirection: "column", paddingVertical: 10, paddingHorizontal: 30 }}>
                  <Text style={{ fontSize: 14, color: "red", fontWeight: "bold" }}>Total</Text>
                  <Text style={{ fontSize: 20, color: "red", fontWeight: "bold" }}>{SumaTotal} </Text>
                </View>
                <LinearGradient colors={[colorBettaLight, colorBettaLight, colorBetta]} style={{ backgroundColor: colorBetta, width: "30%", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  <Icon name='save-outline' height={40} width={40} fill={colorZeta} />
                </LinearGradient >
              </TouchableOpacity>
            }
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => setadd(true)} style={{
          shadowColor: colorIota,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8.84,
          elevation: 5,
          backgroundColor: "white", width: 60, height: 60, justifyContent: "center", alignContent: "center", alignItems: "center", borderRadius: 30, position: "absolute", bottom: 90, right: 20
        }}>
          <Icon name='plus-circle-outline' height={40} width={40} fill={colorBetta} />
        </TouchableOpacity>
        <Menu props={props} option={4} />
      </LinearGradient>
      <Modal animationType="slide" transparent={true} visible={display}>
        <View style={styles.modalBack}>
          <TouchableOpacity onPress={() => setdisplay(!display)} style={{ position: "absolute", top: 20, right: 20 }} >
            <Icon name="close-circle-outline" fill={colorZeta} width={30} height={30} />
          </TouchableOpacity>
          <View style={styles.modalWrap}>
            <Text style={[styles.modalText, { color: colorAlfa, fontSize: 20 }]}>{listTitle}</Text>
            <ScrollView>
              {Load === false && getP === true &&
                ListPatient.map((i, key) => {
                  return (
                    <TouchableOpacity key={key}
                      onPress={() => getPatient(i)}
                      style={{ padding: 15, borderBottomColor: "silver", borderBottomWidth: 1 }}>
                      <Text style={{ color: "#000", textAlign: "center", width: "100%", fontSize: 14, fontWeight: "bold" }}>{i.names}</Text>
                    </TouchableOpacity>
                  )
                })
              }
              {getV === true && ListValorationByClientCount === 0 &&
                <Text style={{ color: "#000", marginVertical: 20, textAlign: "center" }}>{Patient.names} no tiene valoraciones realizadas.</Text>
              }
              {getV === true && ListValorationByClientCount > 0 &&
                ListValorationByClient.map((i, key) => {
                  return (
                    <TouchableOpacity key={key}
                      onPress={() => getValoration(i)}
                      style={{ padding: 15, borderBottomColor: "silver", borderBottomWidth: 1 }}>
                      <Text style={{ color: "#000", textAlign: "center", width: "100%", fontSize: 14, fontWeight: "bold" }}>
                        {i.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={Successfully}>
        <View style={styles.modalBack}>
          <View style={styles.modalWrap}>
            <View style={styles.modalJustify}>
              <Icon name="checkmark-circle-outline" fill={colorBetta} width={60} height={60} style={{ marginBottom: 10 }} />
              <Text style={[styles.modalText, { color: "#000", fontSize: 14 }]}>Cotización guardada con éxito</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
  modalBack: {
    position: "absolute",
    zIndex: 999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    width: "100%",
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  modalWrap: {
    backgroundColor: colorZeta,
    padding: 15,
    borderRadius: 12,
    width: "90%",
    overflow: "hidden",
    maxHeight: "90%"
  },
  modalJustify: {
    marginVertical: 20,
    width: "100%",
    alignContent: "center",
    alignItems: "center"
  },
  modalText: {
    textAlign: "center",
    width: "100%",
    color: colorAlfa,
    fontSize: 20,
    fontWeight: "bold"
  }

})
export default Quotation;