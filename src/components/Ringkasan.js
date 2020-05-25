import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableNativeFeedback,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native"
import Resource from "../api/Resource"
import { empty, toCurrency } from "../functions/Functions"
import AntDesign from "react-native-vector-icons/AntDesign"
import Modal from "react-native-modal"
import {} from "react-native-paper"

const BASE = "https://covid19.mathdro.id/api"
const DEVICE_HEIGHT = Dimensions.get("window").height - StatusBar.currentHeight

export default class Berita extends Component {
  state = {
    country: "",
    countryList: [],
    countryModalVisible: false,
    cariNegara: "",
  }

  render() {
    const { country } = this.state
    return (
      <View style={s.Container}>
        <Resource url={empty(country) ? BASE : `${BASE}/countries/${country}`}>
          {({ loading, error, payload: data, refetch }) => {
            if (error) return <Text>{error.message}</Text>

            return (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    onRefresh={() => {
                      refetch()
                    }}
                    refreshing={loading}
                  />
                }
              >
                <View style={{ paddingHorizontal: 4, paddingVertical: 5 }}>
                  <Text style={{ ...s.judul, marginBottom: 12 }}>
                    Overview Statistik
                  </Text>

                  {/* Pilih Negara */}
                  <TouchableNativeFeedback onPress={this.openModal}>
                    <View style={{ ...s.picker, marginBottom: 12 }}>
                      <Text>{country || "Global"}</Text>
                      <AntDesign name="caretdown" color="#444" />
                    </View>
                  </TouchableNativeFeedback>

                  {/* Confirmed, Active */}
                  <View style={{ ...s.kotakWrapper }}>
                    <View style={{ ...s.kotakKiri, marginRight: 0 }}>
                      {loading ? (
                        <View
                          style={{
                            paddingVertical: 16,
                            backgroundColor: "#f7f7f7",
                          }}
                        >
                          <ActivityIndicator size={38} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: "#e53e3e",
                            backgroundColor: "#fff5f5",
                          }}
                        >
                          {toCurrency(data ? data.confirmed.value : 0)}
                        </Text>
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: "#e53e3e",
                          backgroundColor: "#fed7d7",
                        }}
                      >
                        Terkonfirmasi
                      </Text>
                    </View>
                  </View>

                  {/* Recovered, Death */}
                  <View style={{ ...s.kotakWrapper, marginTop: 12 }}>
                    <View style={{ ...s.kotakKiri }}>
                      {loading ? (
                        <View
                          style={{
                            paddingVertical: 16,
                            backgroundColor: "#f7f7f7",
                          }}
                        >
                          <ActivityIndicator size={38} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: "#38a169",
                            backgroundColor: "#f0fff4",
                          }}
                        >
                          {toCurrency(data ? data.recovered.value : 0)}
                        </Text>
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: "#38a169",
                          backgroundColor: "#c6f6d5",
                        }}
                      >
                        Sembuh
                      </Text>
                    </View>

                    <View style={{ ...s.kotakKanan }}>
                      {loading ? (
                        <View
                          style={{
                            paddingVertical: 16,
                            backgroundColor: "#f7f7f7",
                          }}
                        >
                          <ActivityIndicator size={38} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: "#718096",
                            backgroundColor: "#f5faff",
                          }}
                        >
                          {toCurrency(data ? data.deaths.value : 0)}
                        </Text>
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: "#718096",
                          backgroundColor: "#e2e8f0",
                        }}
                      >
                        Meninggal
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )
          }}
        </Resource>

        {/* Modal Country */}
        {this.renderModal()}
      </View>
    )
  }

  renderModal() {
    return (
      <Modal
        isVisible={this.state.countryModalVisible}
        onBackdropPress={this.closeModal}
        onBackButtonPress={this.closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: 5,
            marginVertical: 32,
          }}
        >
          <View style={{ borderBottomColor: "#e5e5e5", borderBottomWidth: 1 }}>
            <TextInput
              onChangeText={cariNegara => this.setState({ cariNegara })}
              style={{
                backgroundColor: "#f1f1f1",
                paddingHorizontal: 12,
                borderRadius: 5,
              }}
              placeholder="Cari Negara / Kode Iso"
            />
          </View>

          <Resource url={`${BASE}/countries`}>
            {({ loading, error, payload: dataNegara }) => {
              if (error) return <Text>{error.message}</Text>
              if (loading)
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size={50} />
                  </View>
                )

              let negaraSearch = dataNegara.countries.filter(neg => {
                // console.warn(neg)
                let regEx = new RegExp(`${this.state.cariNegara}`, "i")
                return (
                  neg.name.match(regEx) ||
                  (!empty(neg.iso2) && neg.iso2.match(regEx)) ||
                  (!empty(neg.iso3) && neg.iso3.match(regEx))
                )
              })
              return (
                <ScrollView>
                  {negaraSearch.map(neg => {
                    return (
                      <TouchableNativeFeedback
                        onPress={() => this.setNegara(neg)}
                      >
                        <View style={s.listNegara}>
                          <Text>
                            {neg.name} - {neg.iso2}
                          </Text>
                        </View>
                      </TouchableNativeFeedback>
                    )
                  })}
                </ScrollView>
              )
            }}
          </Resource>
        </View>
      </Modal>
    )
  }

  openModal = () => {
    this.setState({ countryModalVisible: true })
  }

  closeModal = () => {
    this.setState({ countryModalVisible: false })
  }

  setNegara = neg => {
    this.setState({
      country: neg.name,
      countryModalVisible: false,
      cariNegara: "",
    })
  }
}

const s = StyleSheet.create({
  Container: {
    paddingHorizontal: 8,
    paddingTop: 16,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  tAngkaBesar: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
    paddingVertical: 16,
  },
  tStatus: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
    paddingVertical: 8,
  },
  kotakWrapper: {
    flexDirection: "row",
    // borderRadius: 8,
  },
  kotakKiri: {
    flex: 1,
    marginRight: 6,
    elevation: 4,
    borderRadius: 0,
  },
  kotakKanan: {
    flex: 1,
    marginLeft: 6,
    elevation: 4,
    borderRadius: 0,
  },
  judul: {
    fontSize: 18,
    fontFamily: "sans-serif-light",
    fontWeight: "bold",
    color: "#444",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#eee",
  },
  listNegara: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
})
