import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { getFirestore } from 'redux-firestore'

class WireframeLinks extends React.Component {

    render() {
        const wireframes = this.props.wireframes;
        const users = this.props.users;
        const uid = this.props.auth.uid;
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
        //let firstName = users[uid] 

    
        return (
            <div className="todo-lists section">
                {wireframes && wireframes.map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id} uid={uid}>
                        <WireframeCard wireframe={wireframe} users={users}/>
                    </Link>
                ))}
            </div>
        );
        


    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
        users: state.firestore.ordered.users
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);