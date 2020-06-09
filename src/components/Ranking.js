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
  TouchableWithoutFeedback,
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

    this.state = {
      sortBy: "",
      sorting: false,
      countries: [],
      loading: true,
      error: false,
      order: "asc",
    }
  }

  async componentDidMount() {
    this.fetch()
  }

  fetch = async () => {
    this.setState({ loading: true })
    try {
      let { data } = await Axios.get(`${BASE_19}/summary`)
      this.setState({ loading: false, countries: data.Countries })
    } catch (error) {
      this.setState({ loading: false, error })
    }
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
    const { sortBy } = this.state

    let sortByCountry = sortBy == "Country"
    let sortByConfirmed = sortBy == "TotalConfirmed"
    let sortByRecovered = sortBy == "TotalRecovered"
    let sortByDeath = sortBy == "TotalDeaths"
    return (
      <>
        {/* Heading */}
        <View
          style={{ ...s.row, alignItems: "stretch", paddingHorizontal: 12 }}
        >
          <TouchableWithoutFeedback onPress={() => this.sortBy("Country")}>
            <View
              style={{
                flex: 1,
                ...s.cellWrap,
                backgroundColor: sortByCountry ? "#eee" : "#fff",
              }}
            >
              <Text style={s.country}>Negara</Text>
              {sortByCountry ? <Text>(ASC)</Text> : null}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => this.sortBy("TotalConfirmed")}
          >
            <View
              style={{
                flex: 1,
                ...s.cellWrap,
                backgroundColor: sortByConfirmed ? "#eee" : "#fff",
              }}
            >
              <Text style={s.number}>Terdampak</Text>
              {sortByConfirmed ? <Text>(ASC)</Text> : null}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => this.sortBy("TotalRecovered")}
          >
            <View
              style={{
                flex: 1,
                ...s.cellWrap,
                backgroundColor: sortByRecovered ? "#eee" : "#fff",
              }}
            >
              <Text style={s.number}>Sembuh</Text>
              {sortByRecovered ? <Text>(ASC)</Text> : null}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.sortBy("TotalDeaths")}>
            <View
              style={{
                flex: 1,
                ...s.cellWrap,
                backgroundColor: sortByDeath ? "#eee" : "#fff",
              }}
            >
              <Text style={s.number}>Meninggal</Text>
              {sortByDeath ? <Text>(ASC)</Text> : null}
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* IIFE, define function, langsung dipanggil ditempat */}
        {(() => {
          const { error, loading, sorting } = this.state
          if (error) return <Text>{error.message}</Text>
          if (loading || sorting)
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={50} color={color.teal} />
              </View>
            )

          let countries = this.state.countries
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
        })()}
      </>
    )
  }

  sortBy = newSortBy => {
    const { countries, sortBy: oldSortBy, order: oldOrder } = this.state

    this.setState({ sortBy: newSortBy, sorting: true })
    let sorted = [],
      newOrder
    if (newSortBy == oldSortBy) {
      // toggle order (asc, desc)
      // Dibalik ordernya asc -> desc, desc -> asc
      newOrder = oldOrder == "asc" ? "desc" : "asc"
    } else {
      // beda kolom, sort biasa, order tetap
      newOrder = oldOrder
    }
    let lessThan = newOrder == "asc" ? -1 : 1
    let greaterThan = newOrder == "asc" ? 1 : -1
    sorted = [...countries].sort((a, b) => {
      if (a[newSortBy] < b[newSortBy]) return lessThan
      if (a[newSortBy] > b[newSortBy]) return greaterThan
      return 0
    })

    this.setState({ sorting: false, countries: sorted, order: newOrder })
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
    alignItems: "center",
  },
})
