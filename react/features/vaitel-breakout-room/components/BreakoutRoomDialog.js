// @flow

import { FieldTextStateless as TextField } from '@atlaskit/field-text';
import React from 'react';

import { vaitelGetConfig } from '../../app/actions';
import { Dialog, hideDialog } from '../../base/dialog';
import { showErrorNotification } from '../../notifications';

import Header from './Header';

/**
 *
 * @returns {React$Element<any>}
 */
function showBreakoutRoom() {
    let meetingName = '';

    const onSubmit = () => {
        const meetingID = APP.conference.roomName;
        const jitsiToken = vaitelGetConfig('vaitelTokenUrl', 'https://arena.local.test/api/v1/webconf/token/');
        const method = 'POST';
        const headers = {
            'Content-Type': 'application/json;charset=utf-8'
        };
        const body = JSON.stringify({ meetingName });

        fetch(jitsiToken + meetingID, { method, headers, body })
            .then(response => response.json())
            .then(json => {
                const [ meetingUID, token ] = json;

                APP.breakoutRooms = APP.breakoutRooms || {};
                APP.breakoutRooms[meetingUID] = {
                    meetingName,
                    meetingUID,
                    token
                };
                APP.store.dispatch(hideDialog());
            })
            .catch(e => {
                APP.store.dispatch(showErrorNotification({
                    titleKey: 'dialog.error',
                    description: typeof e === 'string' ? e : 'General error'
                }));
            });
    };

    return (
        <Dialog
            customHeader = { Header }
            hideCancelButton = { true }
            submitDisabled = { false }
            okKey = 'dialog.done'
            onSubmit = { onSubmit }
            width = 'small'>
            <div className = 'breakout-room-dialog'>
                <TextField
                    autoFocus = { true }
                    compact = { false }
                    label = 'Create a child room'
                    name = 'meetingName'
                    shouldFitContainer = { true }
                    type = 'text'
                    onChange = { evnt => {
                        meetingName = evnt.target.value;
                    } } />
            </div>
        </Dialog>
    );
}

export default showBreakoutRoom;
