import React from 'react'
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { MessageShort, SendMessage } from '../views'
import config from '../../config'
import utils from '../../utils'

class Conversation extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}
        return {
            title: params.currentConversation || null,
            headerStyle: {
                backgroundColor: config.colors.main
            },
            headerTintColor: 'rgb(255,255,255)',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'rgb(255,255,255)',
            },
            headerRight: params.showIcon ? (
                <TouchableOpacity onPress={params.toggleCreateMessage} activeOpacity={0.7} style={{paddingHorizontal: 20, paddingVertical: 10}}>
                    <Entypo name="new-message" size={config.screenWidth / 18} color="rgb(255,255,255)"/>
                </TouchableOpacity>
            ) : null
        }
    }

    constructor() {
        super()
        this.state = {
            messages: [], //I was temporarily hardcoding these messages here until I had messages loaded onto the backend, at which point I set this to an empty array. Unfortunately, there's no longer a way to load dummy data into Turbo so the following is the dummy array I used here in addition to commenting out setState ({messages: responseJSON.data}) [{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hey call me!",dateTime:"2019-06-15T16:38:08.316Z", id:"1"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hellooo I said call me bro",dateTime:"2019-06-15T16:38:08.316Z", id:"2"},{toUser:"Tina",fromUser:"Jess",message:"NYC is fun!",dateTime:"2019-06-15T16:38:08.316Z", id:"3"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Margerie",message:"We are so old!",dateTime:"2019-06-15T16:38:08.316Z", id:"4"}]
            fromData: {},
            toData: {},
            showCreateMessage: false
        }
        this.toggleCreateMessage = this.toggleCreateMessage.bind(this)
        this.renderMessages = this.renderMessages.bind(this)
    }

    toggleCreateMessage() {
        this.setState({
            showCreateMessage: !this.state.showCreateMessage
        },
        () => {
            this.props.navigation.setParams({
                showIcon: !this.state.showCreateMessage
            })
        })
    }

    renderMessages(sorted) {

        if (this.state.messages.length === 0) {
                this.setState({
                    messages: sorted, //I was temporarily commenting this out, and hardcoding messages into state, so that state wasn't set with an empty array until I could get messages on the backend
                    showActivityIndictor: false
                })
        } else if (this.props.navigation.state.params.newMessage !== undefined && this.props.navigation.state.params.newMessage.id !== this.state.messages[0].id) {
            const newMessage = this.props.navigation.state.params.newMessage
            const messages = this.state.messages
            messages.unshift(newMessage)
                this.setState({
                    messages: messages,
                    showActivityIndictor: false,
                    })
        } else {
            return
        }
    }

    async componentDidMount() {

        this.props.navigation.setParams({
            toggleCreateMessage: this.toggleCreateMessage,
            showIcon: !this.state.showCreateMessage
        })

        const fromId = this.props.navigation.state.params.user
        const toId = this.props.navigation.state.params.me

        await fetch(`${config.baseUrl}api/user/${fromId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(response => {
            return response.json()
        })
        .then(responseJSON => {
            this.setState({
                fromData: responseJSON.data
            })
        })
        .catch(err => {
            alert('Sorry ' + err.message)
        })

        await fetch(`${config.baseUrl}api/user/${toId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(response => {
            return response.json()
        })
        .then(responseJSON => {
            this.setState({
                toData: responseJSON.data
            })
        })
        .catch(err => {
            alert('Sorry ' + err.message)
        })

        this.props.navigation.setParams({
            currentConversation: this.state.fromData.username
        })

        utils
        .fetchMessages('message/me', { fromUser: fromId })
        .then(responseJSON => {
            const sorted = utils.sortMessagesByDate(responseJSON.data)
            this.renderMessages(sorted)
        })
        .catch(err => {
            console.log(err.message)
            this.setState({
                showActivityIndictor: false
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>

            <Modal visible={this.state.showCreateMessage} transparent={true} animationType="fade" onRequestClose={this.cancel} onDismiss={this.renderMessages}>
                <SendMessage toUser={this.state.fromData.username} navProps={this.props.navigation} toggleCreateMessage={this.toggleCreateMessage}/>
            </Modal>

            <FlatList
                data={this.state.messages}
                extraData={this.state}
                keyExtractor={item => item.id}
                renderItem={({item}) => <MessageShort toImage={this.state.toData.image} fromImage={this.state.fromData.image} sentMessage={item.fromUser === this.props.navigation.state.params.user} message={item}/>}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 100 + '%',
        height: 100 + '%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgb(243, 243, 243)',
        flex: 1
    }
})

export default Conversation
