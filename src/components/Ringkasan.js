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
  Modal as RNModal
} from "react-native"
import Resource from "../api/Resource"
import { empty, toCurrency } from "../functions/Functions"
import AntDesign from "react-native-vector-icons/AntDesign"
import Modal from "react-native-modal"
import {} from "react-native-paper"
import Axios from "axios"
import Flag from "react-native-flags"
import moment from "moment"
import {LineChart, PieChart} from 'react-native-charts-wrapper'
import Svg, {Circle} from 'react-native-svg'

const BASE = "https://covid19.mathdro.id/api"
const DEVICE_HEIGHT = Dimensions.get("window").height - StatusBar.currentHeight
const {width: DEVICE_WIDTH} = Dimensions.get('window')
const color = {
  light: {
    confirm:'#f5faff',
    recovered: '#f0fff4',
    death:'#fff5f5'    
  },
  med: {
    confirm:'#d7ebfe',
    recovered: '#c6f6d5',
    death:'#fed7d7'    
  },
  text: {
    confirm:'#3e8ce5',
    recovered: '#38a169',
    death:'#e53e3e'      
  }
}

export default class Berita extends Component {
  state = {
    country: "",
    countryIso2: "WorldWide",
    countryList: [],
    countryModalVisible: false,
    cariNegara: "",
    loadingCountry: false,
  }

  render() {
    const { country, countryIso2 } = this.state
    return (
      <View style={s.Container}>
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Flag code={countryIso2} size={24} />
                        <Text style={{ marginLeft: 8 }}>
                          {country || "Global"}
                        </Text>
                      </View>

                      <AntDesign name="caretdown" color="#444" />
                    </View>
                  </TouchableNativeFeedback>

                  {/* Last Update */}
                  <View style={{marginBottom:8}}>
                    <Text style={{...s.darktext,fontStyle:'italic'}}>Update Terkini: {moment(data.lastUpdate).format('DD MMM YYYY HH:mm')}</Text>
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
                          <ActivityIndicator color={color.text.confirm} size={48} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.confirm,
                            backgroundColor: color.light.confirm,
                            fontSize: 36,
                          }}
                        >
                          {toCurrency(data ? data.confirmed.value : 0)}
                        </Text>
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
                          <ActivityIndicator color={color.text.recovered} size={38} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.recovered,
                            backgroundColor: color.light.recovered,
                          }}
                        >
                          {toCurrency(data ? data.recovered.value : 0)}
                        </Text>
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
                          <ActivityIndicator color={color.text.death} size={38} />
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...s.tAngkaBesar,
                            color: color.text.death,
                            backgroundColor: color.light.death,
                          }}
                        >
                          {toCurrency(data ? data.deaths.value : 0)}
                        </Text>
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
                  <TouchableNativeFeedback onPress={() => this.setNegara(neg)} key={neg.iso2}>
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
                      {neg.iso2 == this.state.countryIso2 ? (
                        <Text style={{ fontSize: 16, color: "#999" }}>
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

  renderChart=(data)=>{
    // Data
    let total = data ? data.confirmed.value : 0
    let recovered = data ? data.recovered.value : 0
    let death = data ? data.deaths.value : 0
    let deathPercentage = death/total *100
    let recoveredPercentage = recovered/total*100

    let deathMinusMargin = this.getMinusMargin(deathPercentage)
    let recoveredMinusMargin =  this.getMinusMargin(recoveredPercentage)

    let size = DEVICE_WIDTH/3
    let strokeWidth = 10
    let radius = (size - strokeWidth * 2) / 2
    let keliling = Math.PI * radius*2
    return (
      <>
        <View style={{ marginTop: 12, backgroundColor: "white",flexDirection:'row',justifyContent:'space-around' }}>
          {/* SVG Sembuh */}
          <View style={{alignItems:'center'}}>
            <Svg width={size} height={size} >
              <Circle
                stroke={color.text.recovered}
                cx={radius + 10}
                cy={radius + 10}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${keliling} ${keliling}`}
                strokeDashoffset={100}
              />
              <Circle
                stroke={color.med.recovered}
                cx={radius + 10}
                cy={radius + 10}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={[keliling, keliling]}
                strokeDashoffset={recoveredPercentage * keliling}
              />

              <Text
                style={{
                  marginLeft: radius - recoveredMinusMargin,
                  marginTop: radius - 5,
                  fontSize: 22,
                  fontWeight: "bold",
                  fontFamily: "sans-serif-light",
                }}
              >
                {toCurrency(recoveredPercentage, 1)} %
              </Text>
            </Svg>
            <Text style={{...s.medium,marginTop:4,color:'#444'}}>Persentase Sembuh</Text>
            <Text style={{color:'#999',fontSize:13}}>Dari Total Kasus</Text>
          </View>

          {/* SVG Meninggal */}
          <View style={{alignItems:'center'}}>
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
                strokeDashoffset={deathPercentage * keliling}
              />

              <Text
                style={{
                  marginLeft: radius - deathMinusMargin,
                  marginTop: radius - 5,
                  fontSize: 22,
                  fontWeight: "bold",
                  fontFamily: "sans-serif-light",
                }}
              >
                {toCurrency(deathPercentage, 1)} %
              </Text>
            </Svg>
            <Text style={{...s.medium,marginTop:4,color:'#444'}}>Persentase Kematian</Text>
            <Text style={{color:'#999',fontSize:13}}>Dari Total Kasus</Text>
          </View>
        </View>
      </>
    )
  }

  getMinusMargin = (val = 0) => {

    let str = Math.floor(val).toString()
    switch (str.length) {
      case 1:
        return 12

        case 2:
        return 20

        case 3:
        return 28 
    
      default:
        return 20
        break;
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
      let { data } = await Axios.get(`${BASE}/countries`)

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
    paddingHorizontal: 8,
    paddingTop: 16,
    backgroundColor: "#f9f9f9",
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
    color: '#444'
  },
  chart: {
    height: 300
  },
  medium: {
    fontWeight:'bold',
    fontFamily:'sans-serif-light'
  }
})
