import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeLabel from './WireframeLabel.js';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class WireframeLabelList extends React.Component {
    render() {
        const wireframe = this.props.wireframe;
        const controls = wireframe.controls;
        const labels = controls.label;
        const selectControl = this.props.selectControl
        const reposition = this.props.reposition;
        const resize = this.props.resize;

        console.log("wireframe id: " + wireframe.id);
        return (
            <div className="labels-section">
                {labels && labels.map(function(label) {
                    label.id = label.key;
                    return (
                        <WireframeLabel label={label} wireframe={wireframe} selectControl={selectControl} reposition={reposition} resize={resize}/>
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
)(WireframeLabelList);