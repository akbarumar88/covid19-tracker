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
  teal: "#2196F3",
}

export default class Berita extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <View style={{ ...s.Container }}>
        {/* Konten atas */}
        <View style={{ padding: 12 }}>
          {/* Title */}
          <View style={{ ...s.row, alignItems: "stretch" }}>
            <View style={s.bar} />
            <Text style={s.title}>Negara Terdampak</Text>
          </View>

          <Text style={{ ...s.medium, color: "#999", marginTop: 8 }}>
            Sumber: WHO, CDC, ECDC, NHC of the PRC, JHU CSSE, DXY, QQ, dan
            berbagai media internasional
          </Text>
        </View>

        {/* Tabel */}
        {this.renderRanking()}
      </View>
    )
  }

  renderRanking = () => {
    return (
      <>
        {/* Heading */}
        <View
          style={{ ...s.row, alignItems: "stretch", paddingHorizontal: 12 }}
        >
          <View style={{ flex: 1, ...s.cellWrap }}>
            <Text style={s.country}>Negara</Text>
          </View>

          <View style={{ flex: 1, ...s.cellWrap }}>
            <Text style={s.number}>Terdampak</Text>
          </View>

          <View style={{ flex: 1, ...s.cellWrap }}>
            <Text style={s.number}>Sembuh</Text>
          </View>

          <View style={{ flex: 1, ...s.cellWrap }}>
            <Text style={s.number}>Meninggal</Text>
          </View>
        </View>

        <Resource url={`${BASE_19}/summary`}>
          {({ loading, error, payload: data, refetch }) => {
            // console.warn(data.Countries)
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
                  <ActivityIndicator size={70} color={color.teal} />
                </View>
              )

            let countries = data.Countries
            return (
              <ScrollView style={{ paddingHorizontal: 12 }}>
                <View style={{ paddingBottom: 12 }}>
                  {countries.map((country, index) => {
                    return (
                      <View
                        style={{
                          ...s.row,
                          alignItems: "stretch",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            ...s.cellWrap,
                            ...s.row,
                            justifyContent: "flex-start",
                          }}
                        >
                          <Flag code={country.CountryCode} size={16} />
                          <Text style={s.country}>{country.Country}</Text>
                        </View>

                        <View style={{ flex: 1, ...s.cellWrap }}>
                          <Text style={s.number}>
                            {toCurrency(country.TotalConfirmed)}
                          </Text>
                        </View>

                        <View style={{ flex: 1, ...s.cellWrap }}>
                          <Text style={s.number}>
                            {toCurrency(country.TotalRecovered)}
                          </Text>
                        </View>

                        <View style={{ flex: 1, ...s.cellWrap }}>
                          <Text style={s.number}>
                            {toCurrency(country.TotalDeaths)}
                          </Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            )
          }}
        </Resource>
      </>
    )
  }
}

const s = StyleSheet.create({
  Container: {
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: color.teal,
    fontSize: 22,
    paddingVertical: 4,
    marginLeft: 12,
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
  },
  bar: {
    backgroundColor: color.teal,
    paddingHorizontal: 2,
  },
  medium: {
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    fontFamily: "sans-serif-light",
  },
  country: {
    textAlign: "left",
    marginLeft: 4,
  },
  cellWrap: {
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
  },
})
