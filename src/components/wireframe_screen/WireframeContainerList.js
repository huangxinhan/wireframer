import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeContainer from './WireframeContainer.js';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class WireframeContainerList extends React.Component {
    render() {
        const wireframe = this.props.wireframe;
        const controls = wireframe.controls;
        const containers = controls.container;
        const selectControl = this.props.selectControl;
        const reposition = this.props.reposition;
        const resize = this.props.resize

        console.log("wireframe id: " + wireframe.id);
        return (
            <div className="container-section">
                {containers && containers.map(function(container) {
                    container.id = container.key;
                    return (
                        <WireframeContainer container={container} wireframe={wireframe} selectControl={selectControl} reposition={reposition} resize={resize}/>
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
)(WireframeContainerList);