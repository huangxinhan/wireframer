import React from 'react';
import { getFirestore } from 'redux-firestore';
import { connect } from 'react-redux';
import { compose } from 'redux';

class TodoListCard extends React.Component {
    orderList = () => {
        var firestore = getFirestore();
        firestore.collection('todoLists').doc(this.props.todoList.id).set({
            name: this.props.todoList.name,
            owner: this.props.todoList.owner,
            items: this.props.todoList.items,
            timeCreated: Math.floor(Date.now() / 1000)
        })
        .then(function(){
            console.log('success')
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })
    }

    render() {
        const { todoList } = this.props;
        console.log("TodoListCard, todoList.id: " + todoList.id);
        return (
            <div className="card #c8e6c9 green lighten-4 hoverable todo-list-link" onClick={this.orderList}>
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title" >{todoList.name}</span>
                </div>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListCard);
