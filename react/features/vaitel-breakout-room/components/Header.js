// @flow

import React from 'react';

import { translate } from '../../base/i18n';
import { Icon, IconClose } from '../../base/icons';

type Props = {

    /**
     * The {@link ModalDialog} closing function.
     */
    onClose: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * Custom header of the {@code EmbedMeetingDialog}.
 *
 * @returns {React$Element<any>}
 */
function Header({ onClose, t }: Props) {
    return (
        <div
            className = 'breakout-room-dialog-header'>
            { 'Breakout Rooms' }
            <Icon
                onClick = { onClose }
                src = { IconClose } />
        </div>
    );
}

export default translate(Header);
