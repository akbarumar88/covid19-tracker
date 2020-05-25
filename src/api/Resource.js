import React, {Component} from 'react';
import Axios from 'axios'

export default class Resource extends Component {
  state={
    loading: false,
    error:false,
    payload: ''
  }

  static defaultProps = {
    url: '',
    params: {}
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData=async() => {
    const {url,params} = this.props

    this.setState({loading:true})
    try {
      let {data} = await Axios.post(url, params)
      this.setState({payload:data,loading:false})
    } catch (error) {
      this.setState({error,loading:false})
    }
  }

  render() {
    return this.props.children(this.state);
  }
}