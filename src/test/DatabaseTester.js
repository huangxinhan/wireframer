import React from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import wireframeJson from './TestWireFrameProject.json'
import wireframeJson1 from './TestWireFrameProject1.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        wireframeJson1.wireframes.forEach(wireframeListJson => {
            fireStore.collection('wireframes').add({
                    name: wireframeListJson.name,
                    owner: wireframeListJson.owner,
                    controls: wireframeListJson.controls,
                    timeCreated: Math.floor(Date.now() / 1000)
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        const users = this.props.users;
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        users: state.firestore.ordered.users,
        firebase: state.firebase
    };
}

export default compose(connect(mapStateToProps))(DatabaseTester);