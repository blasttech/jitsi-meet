// @flow

import _ from 'lodash';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { IconReply } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractHangupButton } from '../../base/toolbox/components';
import type { AbstractButtonProps } from '../../base/toolbox/components';

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
    _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        const childOf = APP.store.getState()['features/base/jwt'].childOf || {};

        if (childOf.meeting_id) {
            this.icon = IconReply;
        }

        this._hangup = _.once(() => {
            if (childOf.meeting_id) {
                const strJwt = `jwt=${childOf.token}`;
                setTimeout(() => {
                    if (location.hostname === 'localhost') {
                        location.search = `?room=${childOf.meeting_id}&${strJwt}`;
                    } else {
                        location.href = `/${childOf.meeting_id}?${strJwt}`;
                    }
                }, 100);
            }

            sendAnalytics(createToolbarEvent('hangup'));

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                if (window.recording && window.parent) {
                    parent.postMessage('askBeforeLeave', '*');

                    return;
                }

                this.props.dispatch(disconnect(true));
            }
        });
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        this._hangup();
    }
}

export default translate(connect()(HangupButton));
