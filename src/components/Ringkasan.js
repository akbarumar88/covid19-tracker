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
  ToastAndroid,
  Modal as RNModal,
} from "react-native"
import Resource from "../api/Resource"
import { empty, toCurrency } from "../functions/Functions"
import AntDesign from "react-native-vector-icons/AntDesign"
import Modal from "react-native-modal"
import {} from "react-native-paper"
import Axios from "axios"
import Flag from "react-native-flags"
import moment from "moment"
import Svg, { Circle } from "react-native-svg"
import AnimateNumber from "react-native-animate-number"

const BASE_MATHDRO = "https://covid19.mathdro.id/api"
const BASE_19 = "https://api.covid19api.com"
const DEVICE_HEIGHT = Dimensions.get("window").height - StatusBar.currentHeight
const { width: DEVICE_WIDTH } = Dimensions.get("window")
const color = {
  light: {
    confirm: "#f5faff",
    recovered: "#f0fff4",
    death: "#fff5f5",
  },
  med: {
    confirm: "#d7ebfe",
    recovered: "#c6f6d5",
    death: "#fed7d7",
  },
  text: {
    confirm: "#3e8ce5",
    recovered: "#38a169",
    death: "#e53e3e",
  },
}

export default class Berita extends Component {
  constructor(props) {
    super(props)

    let country = props.route.params?.country ?? ""
    let countryIso2 = props.route.params?.countryIso2 ?? "WorldWide"
    this.state = {
      country,
      countryIso2,
      countryList: [],
      countryModalVisible: false,
      cariNegara: "",
      loadingCountry: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let oldParam = JSON.stringify(prevProps.route.params),
      newParam = JSON.stringify(this.props.route.params)
    let isSame = oldParam == newParam
    // Jika params berubah
    if (!isSame) {
      this.setState({
        country: this.props.route.params.country,
        countryIso2: this.props.route.params.countryIso2,
      })
    }
  }

  render() {
    const { country, countryIso2 } = this.state
    return (
      <View style={s.Container}>
        {/* Loading Progress */}
        <Modal
          animationInTiming={1}
          animationOutTiming={1}
          isVisible={this.state.loadingCountry}
        >
          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
              paddingHorizontal: 24,
              paddingVertical: 16,
            }}
          >
            <ActivityIndicator size={40} color="#9C27B0" />
            <Text style={{ fontSize: 18, marginLeft: 16, color: "#444" }}>
              Loading...
            </Text>
          </View>
        </Modal>

        <Resource
          url={
            empty(country)
              ? BASE_MATHDRO
              : `${BASE_MATHDRO}/countries/${country}`
          }
        >
          {({ loading, error, payload: data, refetch }) => {
            if (error)
              return (
                <>
                  <View style={{ alignItems: "center" }}>
                    <Text>{error.message}</Text>
                    <TouchableNativeFeedback
                      onPress={() => {
                        this.setState({
                          country: "",
                          countryIso2: "WorldWide",
                        })
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          backgroundColor: "#ddd",
                        }}
                      >
                        <Text>Reload</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </>
              )

            return (
              <ScrollView
                style={{
                  paddingHorizontal: 8,
                }}
                refreshControl={
                  <RefreshControl
                    onRefresh={() => {
                      refetch()
                    }}
                    refreshing={loading}
                  />
                }
              >
                <View
                  style={{
                    paddingHorizontal: 4,
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{ ...s.judul, marginBottom: 12 }}>
                    Overview Statistik
                  </Text>

                  {/* Pilih Negara */}
                  <TouchableNativeFeedback onPress={this.openModal}>
                    <View style={{ ...s.picker, marginBottom: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Flag code={countryIso2} size={24} />
                        <Text style={{ marginLeft: 8 }}>
                          {country || "Global"}
                        </Text>
                      </View>

                      <AntDesign name="caretdown" color="#444" />
                    </View>
                  </TouchableNativeFeedback>

                  {/* hashTag */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ ...s.hashTag, color: "#333" }}>
                        #SiagaCOVID19
                      </Text>
                      <Text
                        style={{ ...s.hashTag, color: "#777", marginLeft: 12 }}
                      >
                        #DiRumahAja
                      </Text>
                    </View>
                  </ScrollView>

                  {/* Last Update */}
                  <View style={{ marginVertical: 8 }}>
                    <Text style={{ ...s.darktext, fontStyle: "italic" }}>
                      Update Terkini:{" "}
                      {moment(data.lastUpdate).format("DD MMM YYYY HH:mm")}
                    </Text>
                  </View>

                  {/* Confirmed, Active */}
                  <View style={{ ...s.kotakWrapper }}>
                    <View style={{ ...s.kotakKiri, marginRight: 0 }}>
                      {loading ? (
                        <View
                          style={{
                            paddingVertical: 16,
                            backgroundColor: color.light.confirm,
                          }}
                        >
                          <ActivityIndicator
                            color={color.text.confirm}
                            size={48}
                          />
                        </View>
                      ) : (
                        <AnimateNumber
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.confirm,
                            backgroundColor: color.light.confirm,
                            fontSize: 36,
                          }}
                          value={data ? data.confirmed.value : 0}
                          formatter={val => toCurrency(val)}
                        />
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: color.text.confirm,
                          backgroundColor: color.med.confirm,
                          fontSize: 18,
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
                          <ActivityIndicator
                            color={color.text.recovered}
                            size={38}
                          />
                        </View>
                      ) : (
                        <AnimateNumber
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.recovered,
                            backgroundColor: color.light.recovered,
                          }}
                          value={data ? data.recovered.value : 0}
                          formatter={val => toCurrency(val)}
                        />
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: color.text.recovered,
                          backgroundColor: color.med.recovered,
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
                          <ActivityIndicator
                            color={color.text.death}
                            size={38}
                          />
                        </View>
                      ) : (
                        <AnimateNumber
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.death,
                            backgroundColor: color.light.death,
                          }}
                          value={data ? data.deaths.value : 0}
                          formatter={val => toCurrency(val)}
                        />
                      )}
                      <Text
                        style={{
                          ...s.tStatus,
                          color: color.text.death,
                          backgroundColor: color.med.death,
                        }}
                      >
                        Meninggal
                      </Text>
                    </View>
                  </View>

                  {/* Chart */}
                  {this.renderChart(data)}
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
    const { countryList } = this.state
    let negaraSearch = countryList.filter(neg => {
      // console.warn(neg)
      let regEx = new RegExp(`${this.state.cariNegara}`, "i")
      return (
        neg.name.match(regEx) ||
        (!empty(neg.iso2) && neg.iso2.match(regEx)) ||
        (!empty(neg.iso3) && neg.iso3.match(regEx))
      )
    })
    return (
      <Modal
        hideModalContentWhileAnimating={true}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
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

          <ScrollView>
            {[{ name: "Global", iso2: "WorldWide" }, ...negaraSearch].map(
              neg => {
                return (
                  <TouchableNativeFeedback
                    onPress={() => this.setNegara(neg)}
                    key={neg.iso2}
                  >
                    <View style={s.listNegara}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Flag code={neg.iso2} size={24} />
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#444",
                            marginLeft: 8,
                          }}
                        >
                          {neg.name} - {neg.iso2}
                        </Text>
                      </View>

                      {/* Kalo Selected */}
                      {neg.iso2 == this.state.countryIso2 &&
                      !empty(neg.iso2) ? (
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#999",
                          }}
                        >
                          (Current)
                        </Text>
                      ) : null}
                    </View>
                  </TouchableNativeFeedback>
                )
              }
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  renderChart = data => {
    // Data
    let total = data ? data.confirmed.value : 0
    let recovered = data ? data.recovered.value : 0
    let death = data ? data.deaths.value : 0
    let treated = data
      ? data.confirmed.value - (data.recovered.value + data.deaths.value)
      : 0
    let deathPercentage = (death / total) * 100
    let recoveredPercentage = (recovered / total) * 100
    let treatedPercentage = (treated / total) * 100
    // console.warn({ deathPercentage, recoveredPercentage })

    let deathMinusMargin = this.getMinusMargin(deathPercentage)
    let recoveredMinusMargin = this.getMinusMargin(recoveredPercentage)
    let treatedMinusMargin = this.getMinusMargin(treatedPercentage)

    let size = DEVICE_WIDTH / 3
    let strokeWidth = 10
    let radius = (size - strokeWidth * 2) / 2
    let keliling = Math.PI * radius * 2
    return (
      <>
        <View
          style={{
            borderRadius: 5,
            borderColor: "#ddd",
            borderWidth: 1,
            paddingVertical: 16,
            marginTop: 12,
          }}
        >
          {/* Wrapper Sembuh & Kematian */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {/* SVG Sembuh */}
            <View style={{ alignItems: "center" }}>
              <Svg width={size} height={size}>
                <Circle
                  stroke={color.text.recovered}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${keliling} ${keliling}`}
                  strokeDashoffset={0}
                />
                <Circle
                  stroke={color.med.recovered}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={[keliling, keliling]}
                  strokeDashoffset={(recoveredPercentage / 100) * keliling}
                />

                <AnimateNumber
                  value={recoveredPercentage || 0}
                  formatter={val => `${toCurrency(val)} %`}
                  style={{
                    marginLeft: radius - recoveredMinusMargin,
                    marginTop: radius - 5,
                    fontSize: 22,
                    fontWeight: "bold",
                    fontFamily: "sans-serif-light",
                  }}
                />
              </Svg>
              <Text style={{ ...s.medium, marginTop: 4, color: "#444" }}>
                Persentase Sembuh
              </Text>
              <Text style={{ color: "#999", fontSize: 13 }}>
                Dari Total Kasus
              </Text>
            </View>

            {/* SVG Meninggal */}
            <View style={{ alignItems: "center" }}>
              <Svg width={size} height={size}>
                <Circle
                  stroke={color.text.death}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${keliling} ${keliling}`}
                  strokeDashoffset={0}
                />
                <Circle
                  stroke={color.med.death}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={[keliling, keliling]}
                  strokeDashoffset={(deathPercentage / 100) * keliling}
                />

                <AnimateNumber
                  value={deathPercentage || 0}
                  formatter={val => `${toCurrency(val)} %`}
                  style={{
                    marginLeft: radius - deathMinusMargin,
                    marginTop: radius - 5,
                    fontSize: 22,
                    fontWeight: "bold",
                    fontFamily: "sans-serif-light",
                  }}
                />
              </Svg>
              <Text style={{ ...s.medium, marginTop: 4, color: "#444" }}>
                Persentase Kematian
              </Text>
              <Text style={{ color: "#999", fontSize: 13 }}>
                Dari Total Kasus
              </Text>
            </View>
          </View>

          {/* Wrapper Dirawat */}
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {/* SVG Dirawat */}
            <View style={{ alignItems: "center" }}>
              <Svg width={size} height={size}>
                <Circle
                  stroke={color.text.confirm}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${keliling} ${keliling}`}
                  strokeDashoffset={0}
                />
                <Circle
                  stroke={color.med.confirm}
                  cx={radius + 10}
                  cy={radius + 10}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={[keliling, keliling]}
                  strokeDashoffset={(treatedPercentage / 100) * keliling}
                />

                <AnimateNumber
                  value={treatedPercentage || 0}
                  formatter={val => `${toCurrency(val)} %`}
                  style={{
                    marginLeft: radius - treatedMinusMargin,
                    marginTop: radius - 5,
                    fontSize: 22,
                    fontWeight: "bold",
                    fontFamily: "sans-serif-light",
                  }}
                />
              </Svg>
              <Text style={{ ...s.medium, marginTop: 4, color: "#444" }}>
                Persentase Dirawat
              </Text>
              <Text style={{ color: "#999", fontSize: 13 }}>
                Dari Total Kasus
              </Text>
            </View>
          </View>
        </View>
      </>
    )
  }

  getMinusMargin = (val = 0) => {
    let str = Math.floor(val).toString()
    switch (str.length) {
      case 1:
        return 5

      case 2:
        return 13

      case 3:
        return 21

      default:
        return 13
        break
    }
  }

  openModal = async () => {
    if (!this.state.countryList.length) {
      // console.warn('masuk ')
      await this.loadCountry()
    }
    this.setState({ countryModalVisible: true })
  }

  closeModal = () => {
    this.setState({ countryModalVisible: false })
  }

  loadCountry = async () => {
    this.setState({ loadingCountry: true })
    try {
      let { data } = await Axios.get(`${BASE_MATHDRO}/countries`)

      this.setState({ countryList: data.countries, loadingCountry: false })
    } catch (error) {
      this.setState({ loadingCountry: false })
      ToastAndroid.show(error.message, 1000)
    }
  }

  setNegara = neg => {
    this.setState({
      country: neg.name == "Global" ? "" : neg.name,
      countryIso2: neg.iso2,
      countryModalVisible: false,
      cariNegara: "",
    })
  }
}

const s = StyleSheet.create({
  Container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  tAngkaBesar: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    // fontFamily: "sans-serif-light",
    paddingVertical: 16,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tStatus: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
    paddingVertical: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  kotakWrapper: {
    flexDirection: "row",
    // borderRadius: 8,
  },
  kotakKiri: {
    flex: 1,
    marginRight: 6,
    elevation: 2,
    borderRadius: 5,
  },
  kotakKanan: {
    flex: 1,
    marginLeft: 6,
    elevation: 2,
    borderRadius: 5,
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
    backgroundColor: "#e9e9e9",
    borderRadius: 5,
  },
  listNegara: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  darktext: {
    color: "#444",
  },
  chart: {
    height: 300,
  },
  medium: {
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
  },
  hashTag: {
    fontWeight: "bold",
    // fontFamily: "sans-serif-light",
    fontSize: 32,
  },
})
