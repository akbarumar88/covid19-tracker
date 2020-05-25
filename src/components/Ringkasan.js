import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator,ScrollView,RefreshControl } from "react-native";
import Resource from "../api/Resource";
import { empty, toCurrency } from "../functions/Functions";

const BASE = "https://covid19.mathdro.id/api/";

export default class Berita extends Component {
  state = {
    country: "",
  };

  render() {
    const { country } = this.state;
    return (
      <View style={s.Container}>
        <Text style={{ ...s.judul, marginBottom: 12 }}>Overview Statistik</Text>
        <Resource url={empty(country) ? BASE : `${BASE}/countries/${country}`}>
          {({ loading, error, payload: data, refetch }) => {
            if (error) return <Text>{error.message}</Text>;
            
            return (
              <ScrollView refreshControl={<RefreshControl onRefresh={() => {
                refetch()
              }} refreshing={loading} />}>
                <View>
                  {/* Confirmed, Active */}
                  <View style={{ ...s.kotakWrapper }}>
                    <View style={{ ...s.kotakKiri,marginRight:0 }}>
                      {loading ? (
                        <View style={{paddingVertical:16,backgroundColor:'#f7f7f7'}}>
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
                          {toCurrency(data ? data.confirmed.value:0)}
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
                        <View style={{paddingVertical:16,backgroundColor:'#f7f7f7'}}>
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
                          {toCurrency(data ? data.recovered.value:0)}
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
                        <View style={{paddingVertical:16,backgroundColor:'#f7f7f7'}}>
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
                          {toCurrency(data ? data.deaths.value:0)}
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

                  <View style={{paddingVertical: 50, backgroundColor:'#eee',marginTop:16,elevation:12,borderRadius:0}}></View>
                </View>
              </ScrollView>
            );
          }}
        </Resource>
      </View>
    );
  }
}

const s = StyleSheet.create({
  Container: {
    paddingHorizontal: 12,
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
});
