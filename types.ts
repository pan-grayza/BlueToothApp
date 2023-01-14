export type RootStackParamList = {
  Home: undefined
  Peripheral:
    | {
        name: string
        peripheralId: string
        rssi: string
        connected: boolean
      }
    | undefined
}
