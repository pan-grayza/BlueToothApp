import {
  View,
  Text,
  Pressable,
  Animated,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { InformationCircleIcon } from 'react-native-heroicons/outline'
import PeripheralModal from './PeripheralModal'

import BleManager from 'react-native-ble-manager'

const PeripheralCard = ({
  item,
  peripheral,
  children,
}: {
  item: any
  peripheral: any
  children?: React.ReactNode
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [TextInputValueModal, onChangeTextInputModal] = useState('')
  const [TextOutputValueModal, onChangeTextOutputModal] = useState('')

  const animatedOpacity = useRef(new Animated.Value(0)).current
  const animatedScale = useRef(new Animated.Value(0.6)).current

  // let utf8Encode = new TextEncoder()

  function utf8Encode(str: string) {
    var bytes = []
    for (var i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i))
    }
    return bytes
  }

  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 0.75,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1.05,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const fadeOut = () => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 0.6,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // const recieveData = () => {
  //   BleManager.retrieveServices(peripheral.id)
  //     .then(() => {
  //       BleManager.startNotification(peripheral.id, service, characteristic)
  //     })
  //     .then(() => {
  //       BleManager.read(peripheral.id, service, characteristic)
  //     })
  //     .then(readData => {
  //       // Success code
  //       console.log('Read: ' + readData)

  //       // const buffer = Buffer.Buffer.from(readData) //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
  //       // const sensorData = buffer.readUInt8(1, true)
  //     })
  //     .catch(error => {
  //       console.log(`Error writing ${characteristic}: ${error}`)
  //     })
  // }

  const sendData = () => {
    const data = utf8Encode(TextInputValueModal) // convert data to bytes
    const service = 'fff0'
    const characteristic = 'fff1'
    BleManager.retrieveServices(peripheral.id)
      .then(() => {
        BleManager.startNotification(peripheral.id, service, characteristic)
      })
      .then(() => {
        BleManager.writeWithoutResponse(
          peripheral.id,
          service,
          characteristic,
          data
        )
        console.log(`Sent: ${data}`)
      })
      .catch(error => {
        console.log(`Error writing ${characteristic}: ${error}`)
      })
    // recieveData()
  }

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <Text className="text-neutral-600 font-satoshi">
        <Text className="text-base font-bold text-neutral-700 font-satoshi">
          {item.name}
        </Text>
        {'\n'}
        {item.id}
        {'\n'}
        RSSI: {item.rssi} {'   '}
        Connected: {item.connected ? 'true' : 'false'}
        {'\n'}
        Connectable: {item.advertising.isConnectable ? 'true' : 'false'}
      </Text>
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onPress={
          () => setModalVisible(true)
          // navigation.navigate('Peripheral', {
          //   name: name,
          //   peripheralId: id,
          //   rssi: rssi,
          //   connected: connected,
          // })
        }
        className="relative items-center justify-center"
      >
        <View className="relative items-center justify-center">
          <Animated.View
            style={{
              opacity: animatedOpacity,
              transform: [{ scaleX: animatedScale }, { scaleY: animatedScale }],
            }}
            className="relative w-10 h-10 bg-gray-200 rounded-full"
          />
          <View className="absolute pointer-events-none">
            <InformationCircleIcon size={26} color="#374151" />
          </View>
        </View>
      </Pressable>
      <PeripheralModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        item={item}
      >
        {children}
        <View className="flex py-2 mt-2">
          <View className="gap-2">
            <Text className="text-base font-bold text-neutral-700 font-switzer">
              Input
            </Text>
            <KeyboardAvoidingView>
              <TextInput
                selectionColor={'#14b8a6'}
                blurOnSubmit
                editable
                multiline
                numberOfLines={1}
                maxLength={40}
                onChangeText={text => onChangeTextInputModal(text)}
                value={TextInputValueModal}
                className="bg-gray-100 "
              />
            </KeyboardAvoidingView>

            <Pressable
              className="items-center self-end justify-center p-2 bg-teal-400 rounded-md w-36"
              onPress={sendData}
            >
              <Text className="text-base font-medium tracking-wide text-white">
                Send
              </Text>
            </Pressable>
          </View>
          <View className="gap-2">
            <Text className="text-base font-bold text-neutral-700 font-switzer">
              Output
            </Text>
            <TextInput
              selectionColor={'#14b8a6'}
              multiline
              numberOfLines={1}
              maxLength={100}
              value={TextOutputValueModal}
              className="bg-gray-100"
            />
          </View>
        </View>
      </PeripheralModal>
    </View>
  )
}

export default PeripheralCard
