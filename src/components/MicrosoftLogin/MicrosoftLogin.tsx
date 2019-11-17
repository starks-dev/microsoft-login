import React, { Component } from 'react'
import { MicrosoftLoginButton } from 'react-social-login-buttons'
import './style.css'
import {LOGGED_IN} from "./types";
import Service from "./service";

type stateProps = {
  logged: string | null
}

class MicrosoftLogin extends Component <{},stateProps> {
  private MsService!: Service;

  async componentWillMount() {
    this.MsService = new Service()
    this.setState({ logged: localStorage.getItem(LOGGED_IN)})
  }

  logIn = async () => {
    const user = await this.MsService.startAsync()

    if (user) {
      this.setState({ logged: localStorage.getItem(LOGGED_IN) })
    }
  }

  logOut = async () => {
    this.MsService.logOut()
    this.setState({ logged: null })
  }

  render() {
    const { logged } = this.state

    return (
      <div className={'container'}>
        {logged &&
          <span
            style={{ display: 'block', cursor: 'pointer' }}
            onClick={this.logOut}
          >Log out</span>
        }
        {!logged &&
        <MicrosoftLoginButton
          style={{outline: 'none'}}
          onClick={this.logIn}
          />}
      </div>
    )
  }
}

export default MicrosoftLogin