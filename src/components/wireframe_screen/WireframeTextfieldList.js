import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeTextfield from './WireframeTextfield.js';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class WireframeTextfieldList extends React.Component {
    render() {
        const wireframe = this.props.wireframe;
        const controls = wireframe.controls;
        const textfields = controls.textfield;
        const selectControl = this.props.selectControl
        const reposition = this.props.reposition;
        const resize = this.props.resize;

        console.log("wireframe id: " + wireframe.id);
        return (
            <div className="textfields-section">
                {textfields && textfields.map(function(textfield) {
                    textfield.id = textfield.key;
                    return (
                        <WireframeTextfield textfield={textfield} wireframe={wireframe} selectControl={selectControl} reposition={reposition} resize={resize}/>
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
)(WireframeTextfieldList);