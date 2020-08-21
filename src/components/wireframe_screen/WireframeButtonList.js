import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeButton from './WireframeButton.js';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class WireframeButtonList extends React.Component {
    render() {
        const wireframe = this.props.wireframe;
        const controls = wireframe.controls;
        const buttons = controls.button;
        const selectControl = this.props.selectControl;
        const reposition = this.props.reposition;
        const resize = this.props.resize

        console.log("wireframe id: " + wireframe.id);
        return (
            <div className="buttons-section">
                {buttons && buttons.map(function(button) {
                    button.id = button.key;
                    return (
                        <WireframeButton button={button} wireframe={wireframe} selectControl={selectControl} reposition={reposition} resize={resize}/>
                    )})
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const wireframe = ownProps.wireframe;
    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(WireframeButtonList);