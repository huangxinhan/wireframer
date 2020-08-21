import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import ListScreen from './ListScreen.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';

class itemScreen extends React.Component {

    state = {
        currentDescription: this.props.todoItem.description,
        currentAssignedTo: this.props.todoItem.assigned_to,
        currentDueDate: this.props.todoItem.due_date,
        currentCompleted: this.props.todoItem.completed,
    }

    changeDescription = (e) => {
        this.setState({currentDescription: e.target.value})
    }

    changeAssignedTo = (e) => {
        this.setState({currentAssignedTo: e.target.value})
    }

    changeDueDate = (e) => {
        this.setState({currentDueDate: e.target.value})
    }

    changeCompleted = (e) => {
        this.setState({currentCompleted: e.target.checked})
    }

    confirmChange = (e) => {
        this.props.todoItem.description = this.state.currentDescription;
        this.props.todoItem.assigned_to = this.state.currentAssignedTo;
        this.props.todoItem.due_date = this.state.currentDueDate;
        this.props.todoItem.completed = this.state.currentCompleted;
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
        this.setState({show: false});
    }



    render(){
        const todoItem = this.props.todoItem;
        const todoList = this.props.todoList;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return(
            <div className="container">
            <h5>Item</h5> 
                <br></br>
                <br></br>
                <strong>Description</strong>
                <input type="text" id="item_description_textfield"
                defaultValue={todoItem.description}
                onChange={this.changeDescription}
                ></input>
                <br></br>
                <br></br>
                <strong>Assigned To</strong>
                <input type="text" id="item_assigned_to_textfield"
                defaultValue={todoItem.assigned_to}
                onChange={this.changeAssignedTo}
                ></input>
                <br></br>
                <br></br>
                <strong>Due Date</strong>
                <input type="date" id="item_due_date_picker"
                defaultValue={todoItem.due_date}
                onChange={this.changeDueDate}
                ></input>
                <br></br>
                <br></br>
                <strong>Completed</strong>
                <p>
                <label>
                <input type="checkbox" id="item_completed_checkbox"
                defaultChecked={todoItem.completed}
                onChange={this.changeCompleted}
                ></input>
                <span></span>
                </label>
                </p>
                <br></br>
                <br></br>

                <Link to={'/todoList/' + todoList.id} key={todoList.id}>
                <button id="item_form_submit_button" onClick={this.confirmChange}
                >Submit</button>
                </Link>

                <Link to={'/todoList/' + todoList.id} key={todoList.id}>
                <button id="item_form_cancel_button"
                >Cancel</button>
                </Link>
            </div>
        );

        
    }

}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { todoLists } = state.firestore.data;

    const todoItem = ownProps.location.todoItem;
    const todoList = ownProps.location.todoList;

    return {
        todoList,
        todoItem,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(itemScreen);