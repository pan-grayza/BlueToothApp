import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'

const PeripheralModal = ({
  item,
  children,
  modalVisible,
  setModalVisible,
}: {
  item: any
  children?: React.ReactNode
  modalVisible: boolean
  setModalVisible: any
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      onShow={() => console.log('Modal opened')}
      visible={modalVisible}
    >
      <View className="w-full h-full bg-white">
        <View className="relative">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 p-3 bg-gray-300"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-base font-bold text-neutral-700 font-switzer">
              Close
            </Text>
          </TouchableOpacity>
          <ScrollView className="gap-4 p-2">
            <View>
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
            </View>
            <View>{children}</View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default PeripheralModal
