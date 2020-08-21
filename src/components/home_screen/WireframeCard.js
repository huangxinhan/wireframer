import React from 'react';
import { getFirestore } from 'redux-firestore';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal } from 'react-materialize'

class WireframeCard extends React.Component {
    state = {
        rerender: "yes"
    }

    orderList = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        var firestore = getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).set({
            name: this.props.wireframe.name,
            owner: this.props.wireframe.owner,
            controls: this.props.wireframe.controls,
            timeCreated: Math.floor(Date.now() / 1000)
        })
        .then(function(){
            console.log('success')
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })
    }

    deleteWireframe = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
       var firestore = getFirestore();
       firestore.collection('wireframes').doc(this.props.wireframe.id).delete().then(function() {
        console.log("Document successfully deleted!");
       }).catch(function(error) {
        console.error("Error removing document: ", error);
       }); 
    }

    render() {
        const { wireframe } = this.props;
        const users = this.props.users;
        //alert(users[1].firstName)
        const uid = this.props.auth.uid
        console.log("WireframeCard, id: " + wireframe.id);
        let firstName;
        let lastName;

        if(users && uid){
            console.log(users)
            for (var i = 0; i < users.length; i++){
                if(users[i].id === uid){
                    firstName = users[i].firstName
                    lastName = users[i].lastName
                }
            }
        }

        if(firstName && lastName && firstName + " " + lastName === wireframe.owner){
        return (
            <div id="wireframe-cards" className="card #c8e6c9 green lighten-4 hoverable todo-list-link row" style={{ height:75}} onClick={this.orderList}>
                <div className="card-content grey-text text-darken-3 col s8">
                    <span className="card-title white-text center-align" >{wireframe.name}</span>
                </div>
                <Modal header="Delete Wireframe?" trigger={
                    <i class="material-icons hoverable col s3 right-align offset-s1 medium"
                        >highlight_off</i>
                    }>
                <p>
                    <h5>Are you sure you want to Delete The Wireframe Project?</h5>
                    <a class="waves-effect waves-light btn-large" id = "confirm-delete-list" onClick={this.deleteWireframe}>Yes</a>
                    <a class="modal-close waves-effect waves-light btn-large" id = "confirm_cancel_list">No</a>
                    <h5>This Wireframe Project will not be retrievable </h5>
                </p>
                </Modal>
                
            </div>
        );
                }
        return(
            <div></div>
        )


    }
}
const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    };
};

export default compose(connect(mapStateToProps))(WireframeCard);
