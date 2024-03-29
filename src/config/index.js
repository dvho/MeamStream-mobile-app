import { Dimensions } from 'react-native'
import { Header } from 'react-navigation'

export default {
    turboAppId: '5d680e7b5fe3c6001516340d',
    baseUrl: 'https://ms-vsmvfr.turbo360-vertex.com/',
    //baseUrl: 'http://localhost:3000', //need to get an SSL certificate on localhost otherwise you won't be able to run Expo projects on Apple devices
    userIdKey: 'logged_in_user',
    colors: {
        main: 'rgb(64,64,64)', //Old ones: rgb(28,132,250) 'rgb(64,64,64)'
        blue: 'rgb(22,128,251)',
        pastelGray: 'rgb(247,247,247)',
        inactiveButton: 'rgb(215,215,215)',
        activeButton: 'rgb(187,17,23)',
        failButton: 'rgb(210,210,0)',

        dormantButton: 'rgb(128,128,128)',
        toggleSearching: 'rgb(207,23,23)',
        toggleArranging: 'rgb(0,0,179)',
        selectingButton: 'rgb(163,163,15)',
        selectedButton: 'rgb(122,122,255)',
        sendButton: 'rgb(182,182,255)',
        scrollButton: 'rgba(182,255,182,.7)'
    },
    screenWidth: Dimensions.get('window').width,
    borderRadii: Dimensions.get('window').width * .021875,
    pngWidth: Dimensions.get('window').width / 4,
    canvasWidth: Dimensions.get('window').width - 11,
    canvasHeight: (Dimensions.get('window').width - 11) * .7,
    headerHeight: Header.HEIGHT - (129/900 * Dimensions.get('window').width + 30) + 50, //this is the programmed header height minus the dynamic height of the logoName plus a hardcoded 50.
    minimumHeaderHeight: Header.HEIGHT,
    images: {
        theaterPng: require('../assets/theater.png'),
        curtainPng: require('../assets/curtain.png'),
        backgroundTilePng: require('../assets/backgroundTile.png'),
        logoNamePng: require('../assets/logoName.png')
    },
    videos: {
        countdownGif: require('../assets/countdown.gif'),//countdownMp4: require('../assets/countdown.mp4'), //countdownGif: 'https://media.giphy.com/media/thNsW0HZ534DC/giphy.gif' //Pulling this video from giphy on load is 6.5MB and the (higher res) countdown.mp4 is only 0.4MB, but Android has problems reading Video component properties so using Image component with the gif version and caching the Asset in App.js was the best way to go about this.
        waitingGif: require('../assets/waiting.gif'),//waitingMp4: require('../assets/waiting.mp4'), //waitingGif: 'https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif'
        giphyAttribution: require('../assets/giphyAttribution(looped-in-ezgif.com[slash]loop-count).gif')
    }
}
