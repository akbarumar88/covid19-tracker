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
  TouchableOpacity,
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
import Limiter from "../reusable_components/Limiter"

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

export default class Ranking extends Component {
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
      this.setState({ loading: false, countries: data.Countries, error: false })
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

          <Text style={{ color: "#999", marginTop: 8 }}>
            Hint:{"\n"}
            1. Klik pada heading kolom untuk mengurutkan{"\n"}
            2. Klik pada nama negara untuk info lebih lanjut
          </Text>
        </View>

        {/* Tabel */}
        {this.renderRanking()}
      </View>
    )
  }

  renderRanking = () => {
    const { sortBy, order } = this.state

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
              {sortByCountry ? <Text>({order.toUpperCase()})</Text> : null}
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
              {sortByConfirmed ? <Text>({order.toUpperCase()})</Text> : null}
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
              {sortByRecovered ? <Text>({order.toUpperCase()})</Text> : null}
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
              {sortByDeath ? <Text>({order.toUpperCase()})</Text> : null}
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* IIFE, define function, langsung dipanggil ditempat */}
        {(() => {
          const { error, loading, sorting } = this.state
          if (error)
            return (
              <>
                <View style={{ alignItems: "center" }}>
                  <Text>{error.message}</Text>
                  <TouchableNativeFeedback onPress={() => this.fetch()}>
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
            <>
              <Limiter
                style={{ paddingHorizontal: 12 }}
                data={countries}
                limit={15}
                renderItem={this.renderCountry}
              />
            </>
          )
        })()}
      </>
    )
  }

  renderCountry = ({ item: country, index }) => {
    return (
      <View
        key={`${index}`}
        style={{
          alignItems: "stretch",
          marginBottom: 16,
          borderRightWidth: 1,
          borderTopWidth:1,
          borderColor:'#f3f3f3'
        }}
      >
        {/* Negara */}
        <View
          style={{
            ...s.row,
            ...{ alignItems: "stretch" },
            ...s.columnWrapper,
          }}
        >
          <View style={s.columnName}>
            <Text style={s.columnNameText}>Negara</Text>
          </View>

          <TouchableOpacity
            style={{
              ...s.columnValue,
              alignItems: "flex-start",
            }}
            onPress={() =>
              this.props.navigation.navigate("Ringkasan", {
                country: country.Country,
                countryIso2: country.CountryCode,
              })
            }
          >
            <View
              style={{
                flex: 1,
                ...s.row,
              }}
            >
              <Flag code={country.CountryCode} size={16} />
              <Text style={s.country}>{country.Country}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Terdampak */}
        <View
          style={{
            ...s.row,
            ...{ alignItems: "stretch" },
            ...s.columnWrapper,
          }}
        >
          <View style={s.columnName}>
            <Text style={s.columnNameText}>Terdampak</Text>
          </View>

          <View style={{ ...s.columnValue }}>
            <Text style={{ ...s.number, textAlign: "left" }}>
              {toCurrency(country.TotalConfirmed)}
            </Text>
          </View>
        </View>
        {/* Sembuh */}
        <View
          style={{
            ...s.row,
            ...{ alignItems: "stretch" },
            ...s.columnWrapper,
          }}
        >
          <View style={s.columnName}>
            <Text style={s.columnNameText}>Sembuh</Text>
          </View>

          <View style={{ ...s.columnValue }}>
            <Text style={{ ...s.number, textAlign: "left" }}>
              {toCurrency(country.TotalRecovered)}
            </Text>
          </View>
        </View>
        {/* Meninggal */}
        <View
          style={{
            ...s.row,
            ...{ alignItems: "stretch" },
            ...s.columnWrapper,
          }}
        >
          <View style={s.columnName}>
            <Text style={s.columnNameText}>Meninggal</Text>
          </View>

          <View style={{ ...s.columnValue }}>
            <Text style={{ ...s.number, textAlign: "left" }}>
              {toCurrency(country.TotalDeaths)}
            </Text>
          </View>
        </View>
      </View>
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
    backgroundColor: "#fff",
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
  columnWrapper: {
    borderBottomWidth:1,
    borderBottomColor:'#f3f3f3'
  },
  columnName: {
    flex: 0.3,
    backgroundColor: '#f9f9f9',
    padding: 8
  },
  columnNameText: {
    fontWeight:'bold',
    fontFamily: 'sans-serif-light'
  },
  columnValue: {
    flex: 0.7,
    backgroundColor: '#fff',
    padding: 8
  }
})
