import { View, Text, TouchableOpacity } from 'react-native'
import { shallow } from 'zustand/shallow'
import { useStore } from '../hooks/useStore'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types'
import { ArrowLeftIcon } from 'react-native-heroicons/outline'

import BleManager from 'react-native-ble-manager'

// const BleManagerModule = NativeModules.BleManager
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const PeripheralScreen = ({ route }: { route: any }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { name, peripheralId, rssi, connected } = route.params
  const [peripherals, updatePeripherals] = useStore(
    state => [state.peripherals, state.updatePeripherals],
    shallow
  )
  const setList = useStore(state => state.setList)

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

  // const handleConnect = () => {

  // }
  return (
    <View className="w-full h-full bg-gray-100 ">
      <View className="z-0 w-full h-full px-4 py-2">
        <Text className="text-lg font-bold text-neutral-700 font-satoshi">
          {name} Details
        </Text>
        <Text className="text-sm text-neutral-600 font-satoshi">
          {'\n'}
          ID: {peripheralId}
          {'\n'}
          RSSI: {rssi}
          {'\n'}
          Connected: {connected ? 'true' : 'false'}
        </Text>
      </View>

      <View className="relative flex-row items-center justify-center w-full h-20 px-6 py-4 bg-white bottom-20">
        <TouchableOpacity
          className="absolute items-center justify-center p-3 bg-white border-2 border-teal-400 rounded-lg w-14 h-14 left-6"
          onPress={() => navigation.navigate('Home')}
        >
          <ArrowLeftIcon size={32} color="#14b8a6" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-[180px] h-14
           p-3 bg-teal-400 rounded-lg"
          onPress={() => testPeripheral}
        >
          <Text className="text-xl font-medium tracking-wide text-white font-switzer ">
            Connect
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PeripheralScreen
