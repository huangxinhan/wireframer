import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class ItemsList extends React.Component {
    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        const moveUp = this.props.moveUp;
        const moveDown = this.props.moveDown;
        const deleteItem = this.props.deleteItem;
        const editItem = this.props.editItem;
        const addItem = this.props.addItem;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div>
            <div className="todo-lists section">
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <Link to={{
                            pathname: '/todoList/' + todoList.id + '/item/' + item.id,
                            todoItem: item,
                            todoList: todoList
                        }}>
                            <ItemCard todoList={todoList} item={item} moveUp={moveUp} moveDown={moveDown} deleteItem={deleteItem} editItem={editItem} addItem={addItem} />
                        </Link>
                    );})
                }
                <div className="list_item_add_card" class="#c8e6c9 green lighten-4 hoverable center-align" onClick={addItem}>
                    <i class="material-icons">add_circle</i>
                </div>
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
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
)(ItemsList);