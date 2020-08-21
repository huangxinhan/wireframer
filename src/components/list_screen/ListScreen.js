import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { link } from 'react-router-dom';
import { Modal } from 'react-materialize'

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
        taskCriteria: "increasingTask",
        dueDateCriteria: "increasingDate",
        completedCriteria: "increasingStatus",
        currentCriteria: null,
        currentIndex: null,
        show: false,
        showEdit: false,
        showTrash: false,
        currentDescription: null,
        currentAssignedTo: null,
        currentDueDate: null,
        currentCompleted: null,
        currentIndex: null,
        currentList: null,
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        this.props.todoList[target.id] = target.value;
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

    moveUp = (index, event) => {

        event.stopPropagation();
        event.preventDefault();
        var tempItem;
        if (index === 0){
            //We do nothing
        }
        else{
            tempItem = this.props.todoList.items[index-1];
            this.props.todoList.items[index-1] = this.props.todoList.items[index];
            this.props.todoList.items[index] = tempItem;
            for (var i = 0; i < this.props.todoList.items.length; i++){
                this.props.todoList.items[i].key = i; //resetting the keys
                
            }

        }
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

    moveDown = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        var tempItem;
        if (index === this.props.todoList.items.length - 1){
        }
        else{
            tempItem = this.props.todoList.items[index + 1];
            this.props.todoList.items[index + 1] = this.props.todoList.items[index];
            this.props.todoList.items[index] = tempItem;
            for (var i = 0; i < this.props.todoList.items.length; i++){
                this.props.todoList.items[i].key = i; //resetting the keys
            }
        }
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
    
    deleteItem = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        this.props.todoList.items.splice(index, 1); //remove from array
        for (var i = 0; i < this.props.todoList.items.length; i++){
            this.props.todoList.items[i].key = i; //resetting the keys
        }
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

    sortItemsByTask = (e) => {
        //e.stopPropagation();
        if(this.state.taskCriteria === "increasingTask"){
            this.setState({taskCriteria: "decreasingTask"})
            this.setState({currentCriteria: "decreasingTask"}, this.callback)
            console.log("after setting state to task, the criteria is" + this.state.currentCriteria);
    
        }
        else{
            this.setState({taskCriteria: "increasingTask"})
            this.setState({currentCriteria: "increasingTask"}, this.callback)
            console.log("after setting state to task, the criteria is" + this.state.currentCriteria);
    
        }
    
      }  
    
      sortItemsByDueDate = (e) => {
        //e.stopPropagation();
        if(this.state.dueDateCriteria === "increasingDate"){
          this.setState({dueDateCriteria: "decreasingDate"})
          this.setState({currentCriteria: "decreasingDate"}, this.callback)
          console.log("after setting state to date, the criteria is" + this.state.currentCriteria);
    
        }
        else{
          this.setState({dueDateCriteria: "increasingDate"})
          this.setState({currentCriteria: "increasingDate"}, this.callback)
          console.log("after setting state to date, the criteria is" + this.state.currentCriteria);
    
        }
       
      } 
    
      sortItemsByStatus = (e) => {
        //e.stopPropagation();
        if(this.state.completedCriteria === "increasingStatus"){
          this.setState({completedCriteria: "decreasingStatus"})
          this.setState({currentCriteria: "decreasingStatus"}, this.callback)
          console.log("after setting state to status, the criteria is" + this.state.currentCriteria);
    
        }
        else{
          this.setState({completedCriteria: "increasingStatus"})
          this.setState({currentCriteria: "increasingStatus"}, this.callback)
          console.log("after setting state to status, the criteria is" + this.state.currentCriteria);
        }
      }
    
      callback = () => {
        let sortedList = this.props.todoList;
        sortedList.items.sort(this.compare);
        for (var i = 0; i < sortedList.items.length; i++){
          sortedList.items[i].key = i;
        }
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
    
    
      compare = (item1, item2) => {
        console.log("the current criteria is" + this.state.currentCriteria)
        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (this.state.currentCriteria === "decreasingTask"
        ||  this.state.currentCriteria === "decreasingDate"
        ||  this.state.currentCriteria === "decreasingStatus") {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
    
        // SORT BY ITEM DESCRIPTION
        if (this.state.currentCriteria === "increasingTask"
            || this.state.currentCriteria === "decreasingTask") {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description > item2.description)
                return 1;
            else
                return 0;
        }
    
        // SORT BY ITEM DUE DATE
        if(this.state.currentCriteria === "increasingDate"
            || this.state.currentCriteria === "decreasingDate"){
            if(item1.due_date < item2.due_date)
                return -1;
            else if (item1.due_date > item2.due_date)
                return 1;
            else   
                return 0;
        }
    
        // SORT BY COMPLETED
        if(this.state.currentCriteria === "increasingStatus" 
         ||  this.state.currentCriteria === "decreasingStatus"){
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            else
                return 0;
        }
    }


    displayEditItem = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({currentIndex: index}, this.updateDescription);
    }

    updateDescription = () => {
        var index = this.state.currentIndex;
        this.setState({currentDescription: this.props.todoList.items[index].description}, this.updateAssignedTo)
    }

    updateAssignedTo = () =>{
        var index = this.state.currentIndex;
        this.setState({currentAssignedTo: this.props.todoList.items[index].assigned_to}, this.updateDueDate)
    }

    updateDueDate = () =>{
        var index = this.state.currentIndex;
        this.setState({currentDueDate: this.props.todoList.items[index].due_date}, this.updateCompleted)
    }

    updateCompleted = () => {
        var index = this.state.currentIndex;
        this.setState({currentCompleted: this.props.todoList.items[index].completed}, this.showScreen)
    }

    showScreen() {
        this.setState({show: true});
    }

    closeEditItem = () => {
        this.setState({show: false})
    }

    changeDescription = (e) =>{
        this.setState({currentDescription: e.target.value})
    }

    changeAssignedTo = (e) =>{
        this.setState({currentAssignedTo: e.target.value})
    }

    changeDueDate = (e) =>{
        this.setState({currentDueDate: e.target.value})
    }

    changeCompleted = (e) =>{
        this.setState({currentCompleted: e.target.checked})
    }

    confirmChange = () => {
        var index = this.state.currentIndex;
        this.props.todoList.items[index].description = this.state.currentDescription;
        this.props.todoList.items[index].assigned_to = this.state.currentAssignedTo;
        this.props.todoList.items[index].due_date = this.state.currentDueDate;
        this.props.todoList.items[index].completed = this.state.currentCompleted;
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

    addItem = () => {
        this.setState({currentDescription: ""})
        this.setState({currentAssignedTo: ""})
        this.setState({currentDueDate: ""})
        this.setState({currentCompleted: false})
        this.setState({showEdit: true})
    }

    confirmAddItem = () =>{
        var newItem = {
            "key": this.props.todoList.items.length,
            "id": this.props.todoList.items.length,
            "description": this.state.currentDescription,
            "due_date": this.state.currentDueDate,
            "assigned_to": this.state.currentAssignedTo,
            "completed": this.state.currentCompleted,
        }
        this.props.todoList.items.push(newItem);
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
        this.setState({showEdit: false});

    }

    closeNewItem = () =>{
        this.setState({showEdit: false})
    }

    openTrash = () =>{
        this.setState({showTrash: true})
    }

    closeTrash = () =>{
        //this.setState({showTrash: false})
    }

    
    deleteList = () => {
       this.setState({currentList: "goback"});
       var firestore = getFirestore();
       firestore.collection('todoLists').doc(this.props.todoList.id).delete().then(function() {
        console.log("Document successfully deleted!");
       }).catch(function(error) {
        console.error("Error removing document: ", error);
       }); 
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        const currentList = this.state.currentList;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if(currentList==="goback"){
            return <Redirect to="/" />
        }

        if(!todoList){
            return <React.Fragment />
        }

        return (
            <div>
            <div className="container" style={{display: this.state.showEdit ? 'block' : 'none' }}>
            <h5>Item</h5> 
                <br></br>
                <br></br>
                <strong>Description</strong>
                <input type="text" id="item_description_textfield"
                value={this.state.currentDescription}
                onChange={this.changeDescription.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Assigned To</strong>
                <input type="text" id="item_assigned_to_textfield"
                value={this.state.currentAssignedTo}
                onChange={this.changeAssignedTo.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Due Date</strong>
                <input type="date" id="item_due_date_picker"
                value={this.state.currentDueDate}
                onChange={this.changeDueDate.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Completed</strong>
                <p>
                <label>
                <input type="checkbox" id="item_completed_checkbox"
                checked={this.state.currentCompleted}
                onClick={this.changeCompleted.bind(this)}></input>
                <span></span>
                </label>
                </p>
                <br></br>
                <br></br>
                <button id="item_form_submit_button"
                onClick={this.confirmAddItem}>Submit</button>
                <button id="item_form_cancel_button"
                onClick={this.closeNewItem}>Cancel</button>
            </div>

            <div className="container" style={{display: this.state.show ? 'block' : 'none' }}>
            <h5>Item</h5> 
                <br></br>
                <br></br>
                <strong>Description</strong>
                <input type="text" id="item_description_textfield"
                value={this.state.currentDescription}
                onChange={this.changeDescription.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Assigned To</strong>
                <input type="text" id="item_assigned_to_textfield"
                value={this.state.currentAssignedTo}
                onChange={this.changeAssignedTo.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Due Date</strong>
                <input type="date" id="item_due_date_picker"
                value={this.state.currentDueDate}
                onChange={this.changeDueDate.bind(this)}></input>
                <br></br>
                <br></br>
                <strong>Completed</strong>
                <p>
                <label>
                <input type="checkbox" id="item_completed_checkbox"
                checked={this.state.currentCompleted}
                onClick={this.changeCompleted.bind(this)}></input>
                <span></span>
                </label>
                </p>
                <br></br>
                <br></br>
                <button id="item_form_submit_button"
                onClick={this.confirmChange}>Submit</button>
                <button id="item_form_cancel_button"
                onClick={this.closeEditItem}>Cancel</button>
            </div>

            <div className="container #c8e6c9 green lighten-4" style={{display: this.state.showTrash ? 'block' : 'none' }} >
                <div className='popup\_inner'>
                    <h5>Delete List?</h5>
                    <h5>Are you sure you want to Delete The List?</h5>
                    <a class="waves-effect waves-light btn-large" id = "confirm_delete_list" onClick={this.deleteList}>Yes</a>
                    <a class="waves-effect waves-light btn-large" id = "confirm_cancel_list" onClick={this.closeTrash}>No</a>
                    <h5>This list will not be retrievable </h5>
                </div>
            </div>

            <div className="container" style={{display: this.state.show || this.state.showEdit || this.state.showTrash ? 'none' : 'block' }}>

                <Modal header="Delete List?" trigger={
                    <i id= "trash_icon" class="material-icons medium hoverable modal-trigger right-align">delete_forever</i>
                }>
                <p>
                    <h5>Are you sure you want to Delete The List?</h5>
                    <a class="waves-effect waves-light btn-large" id = "confirm_delete_list" onClick={this.deleteList}>Yes</a>
                    <a class="modal-close waves-effect waves-light btn-large" id = "confirm_cancel_list">No</a>
                    <h5>This list will not be retrievable </h5>
                </p>
                </Modal>

                <div class="row">
                <div class="input-field col s6">
                    <input className="active" type="text" defaultValue={todoList.name} name="name" id="name" onChange={this.handleChange}  />
                    <label class="active" for="name">Name</label>
                </div>
                <div class="input-field col s6">
                    <input className="active" type="text" defaultValue={todoList.owner} name="owner" id="owner" onChange={this.handleChange} />
                    <label class="active" for="owner">Owner</label>
                </div>
                </div>
                <div class="row">
                <div id="list_item_task_header" onClick={this.sortItemsByTask}>Task</div>
                <div id="list_item_due_date_header" onClick={this.sortItemsByDueDate}>Due Date</div>
                <div id="list_item_status_header" onClick={this.sortItemsByStatus}>Status</div>
                </div>
                <ItemsList todoList={todoList} moveUp={this.moveUp} moveDown={this.moveDown} deleteItem={this.deleteItem} editItem={this.displayEditItem} addItem={this.addItem}/>
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  //todoList.id = id;
  if(todoList){
      todoList.id = id;
  }

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);