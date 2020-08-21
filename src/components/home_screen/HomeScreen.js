import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import WireframeLinks from './WireframeLinks';
import { getFirestore } from 'redux-firestore';
import { Icon, Button } from 'react-materialize';
import { Modal } from 'react-materialize'


class HomeScreen extends Component {
    state = {
        redirect: '',
        owner: ""
    }

    handleNewList = () => {
        var firestore = getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframes.length.toString()).set({
            name: "new wireframe project",
            owner: "new owner",
            controls: {
                container: [],
                label: [],
                button: [],
                textfield: [],
            },
              
            
            timeCreated: Math.floor(Date.now() / 1000)
        })
        .then(function(){
            console.log('success')
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })

        //firestore.collection('todoLists').orderBy("recent").get();

        this.setState({redirect: "redirect"})

    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        if(this.state.redirect==="redirect"){
            return <Redirect to={'/wireframe/' + this.props.wireframes.length}/>
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <h4 className="your_lists">Your Wireframes</h4>
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner" >
                            Wireframer™<br />
                            <br></br>
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New Wireframe Project
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        wireframes: state.firestore.ordered.wireframes,
        users: state.firestore.ordered.users
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireframes', orderBy: ['timeCreated', 'desc']},
      { collection: 'users'}
    ]),
)(HomeScreen);