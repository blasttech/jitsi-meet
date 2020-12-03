// @flow

import React, { Component } from 'react';

import { connect } from '../../base/redux';
import { Subject } from '../../conference';
import { fetchCustomBrandingData } from '../../dynamic-branding';
import { Captions } from '../../subtitles/';

declare var interfaceConfig: Object;

type Props = {

    /**
     * The user selected background color.
     */
    _customBackgroundColor: string,

    /**
     * The user selected background image url.
     */
    _customBackgroundImageUrl: string,

    /**
     * Fetches the branding data.
     */
    _fetchCustomBrandingData: Function,

    /**
     * Prop that indicates whether the chat is open.
     */
    _isChatOpen: boolean,

    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean,

    vaitelShowWhiteboard: string,
    vaitelShowDrawing: boolean
}

/**
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * the conference participant who is on the local stage) on Web/React.
 *
 * @extends Component
 */
class LargeVideo extends Component<Props> {
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.props._fetchCustomBrandingData();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const style = this._getCustomSyles();
        const className = `videocontainer${this.props._isChatOpen ? ' shift-right' : ''}`;

        return (
            <div
                className = { className }
                id = 'largeVideoContainer'
                style = { style }>
                <Subject />
                <div id = 'sharedVideo'>
                    <div id = 'sharedVideoIFrame' />
                </div>
                <div id = 'etherpad' />

                <div id = 'dominantSpeaker'>
                    <div className = 'dynamic-shadow' />
                    <div id = 'dominantSpeakerAvatarContainer' />
                </div>
                <div id = 'remotePresenceMessage' />
                <span id = 'remoteConnectionMessage' />
                <div id = 'largeVideoElementsContainer'>
                    <div id = 'largeVideoBackgroundContainer' />

                    {/*
                      * FIXME: the architecture of elements related to the large
                      * video and the naming. The background is not part of
                      * largeVideoWrapper because we are controlling the size of
                      * the video through largeVideoWrapper. That's why we need
                      * another container for the background and the
                      * largeVideoWrapper in order to hide/show them.
                      */}
                    {/* eslint-disable-next-line react/no-danger */}

                    <div
                        id = 'largeVideoWrapper'
                        style = {{ display: this.props.vaitelShowWhiteboard ? 'none' : 'block' }}>
                        <video
                            autoPlay = { !this.props._noAutoPlayVideo }
                            id = 'largeVideo'
                            muted = { true }
                            playsInline = { true } /* for Safari on iOS to work *//>

                        {this.props.vaitelShowDrawing && <div id = 'drawing'></div>}
                        {this.props.vaitelShowDrawing && <div id = 'drawingBorderContainer'><div id = 'drawingBorder'></div></div>}
                    </div>
                </div>

                {this.props.vaitelShowWhiteboard
                && <div
                    id = 'whiteboard'
                    style = {{ display: !this.props.vaitelShowWhiteboard ? 'none' : 'block' }}
                    dangerouslySetInnerHTML = { this.iframeHTML() } />}

                {interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES
                || <Captions />}
            </div>
        );
    }

    /**
     *
     * @returns {{__html: string}}
     */
    iframeHTML() {
        return {
            __html: this.props.vaitelShowWhiteboard
        };
    }

    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomSyles() {
        const styles = {};
        const {
            _customBackgroundColor,
            _customBackgroundImageUrl
        } = this.props;

        styles.backgroundColor = _customBackgroundColor || interfaceConfig.DEFAULT_BACKGROUND;

        if (_customBackgroundImageUrl) {
            styles.backgroundImage = `url(${_customBackgroundImageUrl})`;
            styles.backgroundSize = 'cover';
        }

        return styles;
    }
}


/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;
    const {
        backgroundColor,
        backgroundImageUrl
    } = state['features/dynamic-branding'];
    const { isOpen: isChatOpen } = state['features/chat'];
    const vaitelShowWhiteboard = state['features/base/config'].vaitelShowWhiteboard;
    const vaitelShowDrawing = state['features/base/config'].vaitelShowDrawing;

    return {
        _customBackgroundColor: backgroundColor,
        _customBackgroundImageUrl: backgroundImageUrl,
        _isChatOpen: isChatOpen,
        _noAutoPlayVideo: testingConfig?.noAutoPlayVideo,
        vaitelShowWhiteboard,
        vaitelShowDrawing
    };
}

const _mapDispatchToProps = {
    _fetchCustomBrandingData: fetchCustomBrandingData
};

export default connect(_mapStateToProps, _mapDispatchToProps)(LargeVideo);
