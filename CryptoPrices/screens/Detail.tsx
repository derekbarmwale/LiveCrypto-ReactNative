import * as React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '../consts/app-consts';

export const DetailScreen = ({route}: {route:any}) => {
    const id = route.params.id;
    const [cryptoProfile, setCryptoProfile] = React.useState();
    const [cryptoMarketData, setCryptoMarketData] = React.useState();
    const [cryptoDataLoaded, setCryptoDataLoaded] = React.useState(false);

    React.useEffect(()=>{
      Promise.all([
        axios.get(`${API_URL}/cryptos/market-data/${id}`),
        axios.get(`${API_URL}/cryptos/profile/${id}`)
      ])
      .then(([resMarketData, resProfile]) =>{
        setCryptoMarketData(resMarketData.data);
        setCryptoProfile(resProfile.data);
        setCryptoDataLoaded(true);
      });
    
    },[])
    return (
      <>
      {cryptoDataLoaded && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{cryptoProfile.name}</Text>
              <Text style={styles.symbol}>{cryptoProfile.symbol}</Text>
              <Text style={styles.price}>{`$ ${convert(cryptoMarketData.market_data.price_usd)}`}</Text>
            </View>
            <View style={styles.headerTagLine}>
              <Text style={styles.line}>{cryptoProfile.profile.general.overview.tagline}</Text>
            </View>
          </View>
          <View style={styles.priceChanges}>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change 1h</Text>
              <Text style={styles.line}>
                {`% ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_1_hour
                )}`}
              </Text>
            </View>
            <View style={styles.priceChangeRow}>
              <Text style={styles.line}>Percent Change 24h</Text>
              <Text style={styles.line}>
                {`% ${convert(
                  cryptoMarketData.market_data.percent_change_usd_last_24_hours
                )}`}
              </Text>
            </View>
          </View>
          {/* <Text>{JSON.stringify(cryptoProfile)}</Text> */}
        </View>

        )}
    
      {!cryptoDataLoaded && <ActivityIndicator size="large" color="#ffab00" />}
      </>
    );
  }

  const styles = StyleSheet.create({
    container:{
      backgroundColor: '#272d42',
      padding: 10,
      flex: 1,
    },

    header:{
      backgroundColor:'#000',
      height: 100,
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,

    },

    headerInfo: {
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
    },

    headerTagLine: {
      marginTop: 10,
    },

    name: {
      fontSize: 24,
      color:'#fff',
    },

    symbol: {
      fontSize: 15,
      padding: 5,
      backgroundColor: '#272d42',
      color: '#fff'
    },

    price: {
      fontSize: 28,
      color: '#ffab00',
      width: 150,
      textAlign: 'right',
    },

    line: {
      color: '#fff',
      fontSize: 16,
      marginTop: 10
    },

    priceChanges: {
      backgroundColor: '#000',
      height: 70,
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,
    },
    priceChangeRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    
  });

  const convert = (price: number) => {
    return Math.round(price * 100)/100;
  }