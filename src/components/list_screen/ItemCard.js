import React from 'react';
import { Modal, Icon, Button } from 'react-materialize'

class ItemCard extends React.Component {
    state = {
        show: false
    }

    getCompleted (){
        const { item } = this.props;
        let isCompleted = item.completed;
        if (isCompleted === true){
            return "Completed";
        }
        else{
            return "Pending"
        }
    }

    isCompletedColorChange(){
        const { item } = this.props;
        let isCompleted = item.completed;
        if (isCompleted === true){
            return "card-completed";
        }
        else{
            return "card-not-completed";
        }
    }

    testEvent = () => {
        alert("not working")
    }

    displayOptions = () => {
        this.setState({show: true})
    }

    displayNone = () => {
        this.setState({show: false})
    }




    render() {
        const { item } = this.props;  
        return (
            <div className="card z-depth-0 todo-list-link pink-lighten-3" class="#c8e6c9 green lighten-4 hoverable"
             id="list_item_card"  onMouseLeave={this.displayNone} borderWidth="thick">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{item.description}</span>
                </div>
                <div className="card-content grey-text text-darken-3">
                    <span className="card-due-date">{item.due_date}</span>
                </div>
                <div className="card-content grey-text text-darken-3">
                    <span className="card-assigned-to">{"Assigned To: " + item.assigned_to}</span>
                </div>
                <div className="card-content grey-text text-darken-3">
                    <span className={this.isCompletedColorChange()}>{this.getCompleted()}</span>
                </div>
                <div className="card-content grey-text text-darken-3">
                    <div className="hover-button">
                    <i class="material-icons" onMouseOver={this.displayOptions}>touch_app</i>
                    </div>
                </div>

                <div className="card-content grey-text text-darken-3">
                    <div className="list_item_card_toolbar">
                    
                        <div className={(() => {
                        if(this.props.item.key === 0)
                            return "list_item_card_button_disabled";
                        else
                            return "list_item_card_button";
                            
                        })()}
                        style={{display: this.state.show ? 'block' : 'none' }} onClick={this.props.moveUp.bind(this, this.props.item.key)}>
                            <i class="material-icons">arrow_upward</i>
                        </div>

                        <div className={(() => {
                        if(this.props.item.key === this.props.todoList.items.length - 1)
                            return "list_item_card_button_disabled";
                        else
                            return "list_item_card_button";
                            
                        })()}
                        style={{display: this.state.show ? 'block' : 'none' }} onClick={this.props.moveDown.bind(this, this.props.item.key)}>
                            <i class="material-icons">arrow_downward</i>
                        </div>

                        <div className="list_item_card_button" 
                        style={{display: this.state.show ? 'block' : 'none' }} onClick={this.props.deleteItem.bind(this, this.props.item.key)}>
                            <i class="material-icons">clear</i>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default ItemCard;