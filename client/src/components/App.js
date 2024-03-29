import React, { Component } from 'react';
import logo from '../assets/logo180.svg';
import { Link } from 'react-router-dom';

class App extends Component {
    state = { walletInfo: {} }

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
        .then(response => response.json())
        .then(json => {
            this.setState({ walletInfo: json })
        });
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br />
                <div>Welcome to crypto..</div>
                <br />
                <div>
                    <Link to='/blocks'>Blocks</Link>
                </div>
                <div>
                    <Link to='/conduct-transaction'>Conduct a transaction</Link>
                </div>
                <div className='WalletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;