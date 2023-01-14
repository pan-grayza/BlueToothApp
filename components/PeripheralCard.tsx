import { View, Text, Pressable, Animated } from 'react-native'
import React, { useRef } from 'react'
import { InformationCircleIcon } from 'react-native-heroicons/outline'
import { RootStackParamList } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

const PeripheralCard = ({
  name,
  id,
  rssi,
  connected,
}: {
  name: string
  id: string
  rssi: string
  connected: boolean
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

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
          {name}
        </Text>
        {'\n'}
        {id}
        {'\n'}
        RSSI: {rssi} {'   '}
        Connected: {connected ? 'true' : 'false'}
      </Text>

      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        onPress={() =>
          navigation.navigate('Peripheral', {
            name: name,
            peripheralId: id,
            rssi: rssi,
            connected: connected,
          })
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
    </View>
  )
}

export default PeripheralCard
