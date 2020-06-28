import React, { Component } from "react"
import { Text, View, FlatList } from "react-native"

export default class Limiter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rawData: props.data, // Data asli
      displayData: props.data.slice(0, props.limit), // Data yang di-paging, awalnya sebanyak limitnya
      limit: props.limit,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let prevPropsStr = JSON.stringify(prevProps)
    let currentPropsStr = JSON.stringify(this.props)

    if (prevPropsStr != currentPropsStr) {
      this.setState({
        rawData: this.props.data,
        limit: this.props.limit,
        displayData: this.props.data.slice(0, this.props.limit),
      })
    }
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={this.props.style}
        keyExtractor={(item, index) => index}
        data={this.state.displayData}
        renderItem={this.props.renderItem}
        onEndReached={this.fetchMore}
      />
    )
  }

  fetchMore = params => {
    const { rawData, displayData, limit } = this.state
    let newOffset = displayData.length
    let newFetched = rawData.filter((item, index) => {
      return index >= newOffset && index < newOffset + limit
    })
    console.log({offset:newOffset,limit: newOffset+limit, newFetched:newFetched.length})

    this.setState(s => ({ displayData: [...s.displayData, ...newFetched] }))
  }
}
