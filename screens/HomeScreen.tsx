import React, { useState, useEffect, useMemo } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
} from 'react-native'

// import { useNavigation } from '@react-navigation/native'
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'
// import { RootStackParamList } from '../types'

import BleManager from 'react-native-ble-manager'
import PeripheralCard from '../components/PeripheralCard'
const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const HomeScreen = () => {
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [isScanning, setIsScanning] = useState(false)
  const peripherals = useMemo(() => new Map<string, any>(), [])
  const [list, setList] = useState<any[]>([])

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 10, true)
        .then((results: any) => {
          console.log('Scanning...')
          setIsScanning(true)
          console.log(results)
          BleManager.checkState()
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }

  const handleStopScan = () => {
    console.log('Scan is stopped')
    setIsScanning(false)
  }

  const handleUpdateValueForCharacteristic = (data: any) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value
    )
  }

  const testPeripheral = (peripheral: any) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id)
      } else {
        console.log('Connecting')
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id)
            if (p) {
              p.connected = true
              peripherals.set(peripheral.id, p)
              setList(Array.from(peripherals.values()))
            }
            console.log('Connected to ' + peripheral.id)

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                (peripheralData: any) => {
                  console.log('Retrieved peripheral services', peripheralData)

                  BleManager.readRSSI(peripheral.id).then((rssi: any) => {
                    console.log('Retrieved actual RSSI value', rssi)
                    let p = peripherals.get(peripheral.id)
                    if (p) {
                      p.rssi = rssi
                      peripherals.set(peripheral.id, p)
                      setList(Array.from(peripherals.values()))
                    }
                  })
                }
              )
            }, 900)
          })
          .catch((err: any) => {
            console.log('Error while connecting', err)
          })
      }
    }
  }

  useEffect(() => {
    BleManager.start({ showAlert: false })

    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        console.log('The bluetooth is already enabled or the user confirm')
      })
      .catch(error => {
        // Failure code
        console.log('The user refuse to enable bluetooth')
        console.warn(error)
      })
    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then((results: any) => {
        if (results.length === 0) {
          console.log('No connected peripherals')
        }
        console.log(results)
        for (let i = 0; i < results.length; i++) {
          var peripheral = results[i]
          peripheral.connected = true
          peripherals.set(peripheral.id, peripheral)
          setList(Array.from(peripherals.values()))
        }
      })
    }

    const handleDiscoverPeripheral = (peripheral: any) => {
      console.log('Got ble peripheral', peripheral)
      if (!peripheral.name) {
        peripheral.name = 'NO NAME'
      }
      peripherals.set(peripheral.id, peripheral)
      setList(Array.from(peripherals.values()))
    }

    const handleDisconnectedPeripheral = (data: any) => {
      let peripheral = peripherals.get(data.peripheral)
      if (peripheral) {
        peripheral.connected = false
        peripherals.set(peripheral.id, peripheral)
        setList(Array.from(peripherals.values()))
      }
      console.log('Disconnected from ' + data.peripheral)
    }

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan)
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral
    )
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral
    )
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic
    )

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ).then(result => {
        if (result) {
          console.log('Permission is OK')
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
          ).then(result => {
            if (result) {
              console.log('User accept')
            } else {
              console.log('User refuse')
            }
          })
        }
      })
    }

    retrieveConnected()

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerStopScan')
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral')
      bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral')
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic'
      )
    }
  }, [peripherals])

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle={'dark-content'}
      />
      <SafeAreaView className="w-full h-full bg-gray-50">
        <FlatList
          className="relative z-0 w-full"
          data={list}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                testPeripheral(item)
              }}
              className="px-4 bg-gray-50"
            >
              <PeripheralCard
                name={item.name}
                id={item.id}
                rssi={item.rssi}
                connected={item.connected}
              />
            </TouchableOpacity>
          )}
        />
        <View className="relative bottom-0 flex-row items-center justify-center w-full h-20 px-6 py-4 bg-white">
          <TouchableOpacity
            className={`items-center justify-center h-14 ${
              isScanning ? 'w-[180px]' : 'w-[160px]'
            } p-3 bg-teal-400 rounded-lg`}
            onPress={startScan}
          >
            <Text className="text-[20px] font-medium tracking-wide text-white font-switzer ">
              {isScanning ? 'Scanning...' : 'Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
}

export default HomeScreen
