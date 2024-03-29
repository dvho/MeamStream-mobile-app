import React from 'react'
import { Image, AsyncStorage, ActivityIndicator, YellowBox } from 'react-native'
import { Asset } from 'expo-asset'
import { AppLoading } from 'expo'
import { Home, Authenticate, Conversation, Profile, AddressBook } from './src/components/screens'
import config from './src/config'
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import store from './src/redux/stores'
import { Provider } from 'react-redux'

import { Zocial, Ionicons, FontAwesome } from '@expo/vector-icons'
//expo can't be used on unsecured network. Make sure the WiFi you’re on requires a password, not just an email (i.e. not Starbucks, etc.)
//expo cli needs to be updated using sudo (to expo-cli@3.0.10, as of the current moment) in order not to get the message that there are no assets to upload upon running expo publish https://github.com/expo/expo-cli/issues/179
//Deploying to App and Play stores https://www.youtube.com/watch?v=6XJhgeuUszQ&t=183s (4 videos)
//Updates for App Store, including updating info.plist  https://docs.expo.io/versions/v32.0.0/distribution/app-stores/#system-permissions-dialogs-on-ios
//Workaround to update info.plist from App.js https://stackoverflow.com/questions/48157185/info-plist-file-for-react-native-ios-app-using-expo-sdk
//How to edit info.plist https://github.com/expo/expo/blob/master/exponent-view-template/ios/exponent-view-template/Supporting/Info.plist#L28-L41

YellowBox.ignoreWarnings([
  'Require cycle:',
])

const MessageStack = createStackNavigator({
    home: Home,
    conversation: Conversation
})

const MainAppTabs = createBottomTabNavigator({
    Messages: MessageStack,
    'Address Book': AddressBook,
    Profile: Profile
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const routeName = navigation.state.routeName
            let IconComponent
            let iconName
            if (routeName === 'Profile') {
                iconName = 'md-person'
                IconComponent = Ionicons
            } else if (routeName === 'Messages') {
                iconName = 'email'
                IconComponent = Zocial
            } else if (routeName === 'Address Book') {
                iconName = 'address-card-o'
                IconComponent = FontAwesome
            }
        return <IconComponent name={iconName} size={25} color={tintColor} />
        },
    }),

    tabBarOptions: {
      activeTintColor: config.colors.blue,
      inactiveTintColor: '#ccc',
    },

    //Everything commented out here is declared ad hoc in each screen component
    // headerStyle: {
    //     backgroundColor: config.colors.main
    // },
    //
    // headerTintColor: 'rgb(255,255,255)',
    //
    // headerTitleStyle: {
    //     fontWeight: 'bold',
    //     color: 'rgb(255,255,255)',
    // },
    tabBarPosition: 'bottom'
})



const rootNav = (authBoolean) => {
    return(
        createAppContainer(createSwitchNavigator({
            main: MainAppTabs,
            auth: Authenticate
        },
        {
            initialRouteName: (authBoolean) ? 'main' : 'auth'
        }))
    )
}


class App extends React.Component {

    constructor() {
        super()
        this.state = {
            authChecked: false,
            authed: false,
            isReady: false
        }
    }

    componentDidMount() {
        return AsyncStorage.getItem(config.userIdKey)
        .then(key => {
            if (key) {
                this.setState({
                    authChecked: true,
                    authed: true
                })
            } else {
                this.setState({
                    authChecked: true
                })
            }
        })
        .catch(err => {
            alert(err)
        })
        //AsyncStorage.removeItem(config.userIdKey)
    }

    render() {
        const Switch = rootNav(this.state.authed)
        if (!this.state.isReady) {
            return (
                <AppLoading startAsync={this._cacheResourcesAsync} onFinish={() => this.setState({isReady: true})} onError={console.warn}/>
            )
        }
        return(
            this.state.authChecked ? <Provider store={store.configureStore()}><Switch/></Provider> : <ActivityIndicator size='large'/>
        )
    }

    async _cacheResourcesAsync() {
        const images = [require('./src/assets/logo.png'), require('./src/assets/curtain.png'), require('./src/assets/theater.png'), require('./src/assets/logoName.png'), require('./src/assets/backgroundTile.png'), require('./src/assets/giphyAttribution(looped-in-ezgif.com[slash]loop-count).gif'), require('./src/assets/countdown.gif'), require('./src/assets/waiting.gif')]

        const cacheImages = images.map(image => {
            return Asset.fromModule(image).downloadAsync()
            })
        return Promise.all(cacheImages)
    }
}

export default App
