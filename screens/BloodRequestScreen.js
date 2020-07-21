import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class BloodRequestScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      requestedBooksList : [],
      searchText: null
    }
  this.requestRef= null
  }

  getRequestedBooksList =()=>{
    this.requestRef = db.collection("requested_books")
    .onSnapshot((snapshot)=>{
      var requestedBooksList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        requestedBooksList : requestedBooksList
      });
    })
  }

  componentDidMount(){
    this.getRequestedBooksList()
  }

  componentWillUnmount(){
    this.requestRef();
   
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.reason_to_request}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
              onPress ={()=>{
                this.props.navigation.navigate("RecieverDetails",{"details": item})
              }}
              >
              <Text style={{color:'#ffc0cb', fontWeight: 'bold'}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  renderHeader = ()=> {
    return (
      <KeyboardAvoidingView>
      <SearchBar placeholder = "Search Here..."
      lightTheme 
      round 
      editable = {true}
      value = {this.state.searchText}
      onChangeText = {this.updateSearch}
      />
      </KeyboardAvoidingView>
    )
  }

  updateSearch = searchText => {
    this.setState({searchText},()=>{
      if('' == searchText){
        this.setState({
          requestedBooksList: [...this.state.requestedBooksList]
        });
        return;
      }
      this.state.requestedBooksList = this.state.requestedBooksList.filter(function(item){
        return item.book_name.includes(searchText);
      }).map(function({book_name, reason_to_request}){
        return {book_name, reason_to_request}
      });
    });
    
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Request Blood" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedBooksList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Donations</Text>
              </View>
            )
            :(
              <FlatList
              ListHeaderComponent = {this.renderHeader}
                keyExtractor={this.keyExtractor}
                data={this.state.requestedBooksList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"black",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
