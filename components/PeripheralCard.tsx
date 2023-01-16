import { View, Text, Pressable, Animated, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { InformationCircleIcon } from 'react-native-heroicons/outline'
import PeripheralModal from './PeripheralModal'

const PeripheralCard = ({
  item,
  children,
}: {
  item: any
  children?: React.ReactNode
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [TextInputValueModal, onChangeTextInputModal] = useState('')

  const animatedOpacity = useRef(new Animated.Value(0)).current
  const animatedScale = useRef(new Animated.Value(0.6)).current

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
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={text => onChangeTextInputModal(text)}
          value={TextInputValueModal}
        />
      </PeripheralModal>
    </View>
  )
}

export default PeripheralCard
