import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
const app = new Clarifai.App({
 apiKey: '0ec6af3022774d9ea19c7e4f10bf0296'
});


const paramsprops={
                    particles: {
                        "number": {
              "value": 80
          },
          "size": {
              "value": 3
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      }}

const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn:false,
  user:
    {
      id:'',
      name: '',
      email:'',
      entries:0,
      joined:''
    }
}                 
class App extends Component{


  constructor(){
  super();
  this.state={
    input:'',
    imageUrl:'',
    box:{},
    route:'signin',
    isSignedIn:false,
    user:
    {
      id:'',
name: '',
email:'',
entries:0,
joined:''
    }
  }
}
loadUser=(loadUser)=>{
this.setState({user:{
  id:loadUser.id,

name: loadUser.name,
email:loadUser.email,
entries:loadUser.entries,
joined:loadUser.joined
}});
}

componentDidMount(){
  fetch('http://localhost:3001/')
  .then(response=>response.json())
  .then(console.log)

}

onInputChange=(event)=>{
  this.setState({input:event.target.value});
}
onButtonClick=(event)=>{
  this.setState({'imageUrl':this.state.input});
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
 .then(response=>{
    if(response){
      fetch('http://localhost:3001/image',{
      method:'put',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:this.state.user.id
        })
    })
      .then(response=>response.json())
      .then(count=>{
        this.setState(Object.assign(this.state.user,{entries:count}))
        })
      .catch(console.log)
      
    
  }
      this.displayFaceBox(this.calculateFaceLocation(response))}).catch(err=>console.log(err));
   

}

displayFaceBox=(box)=>
{
  
  this.setState({box:box});
}

calculateFaceLocation=(data)=>{
  const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
  const image=document.getElementById('inputImage');
  const height=Number(image.height);
  const width=Number(image.width);
  return {leftCol: width*clarifaiFace.left_col,
  rightCol:width-(width*clarifaiFace.right_col),
  topRow:height*clarifaiFace.top_row,
  bottomRow:height-(height*clarifaiFace.bottom_row)
}
}
onRouteChange=(route)=>
{
  if(route==='signout'){
    this.setState(initialState);

  }
  else if(route==='home'){
    this.setState({isSignedIn:true});
  }
  this.setState({route:route});
}

render(){

  const {box,isSignedIn,imageUrl,input,route} = this.state;
  return (
    <div className="App">       
      <Particles className='particles'
                params={paramsprops} />
           <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
           {route==='home'?
           <div>
    <Logo/>
    
    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
    <ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}/>
    
    
    <FaceRecognition box={box} imageUrl={imageUrl}/>
    </div>
    :(route==='signin'?
    <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
    <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    )
      }
    </div>
  );
}
}
export default App;
