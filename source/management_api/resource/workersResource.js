// Copyright (C) <2019> Alibaba Inc
//
// SPDX-License-Identifier: Apache-2.0

'use strict';

const requestHandler = require('../requestHandler');
const error = require('../errors');
const logger = require('../logger').logger.getLogger('WorkersResource');

const VALID_PURPOSES = ['all', 'portal', 'conference', 'webrtc', 'recording', 'streaming', 'sip', 'audio', 'video'];

function getList(req, res, next) {
    const purpose = req.params.purpose;
    if (!purpose) {
        return next(new error.BadRequestError('purpose not specified'));
    }
    if (!VALID_PURPOSES.includes(purpose)) {
        return next(new error.BadRequestError(`purpose can only be one of ${VALID_PURPOSES}`));
    }

    requestHandler.getWorkersByPurpose(purpose, result => {
        logger.debug(`Representing workers for purpose ${purpose} in the cluster`);

        if (result === 'error') {
            return next(new error.CloudError('Operation failed'));
        }

        res.send(result);
    });
}

module.exports = {
    getList: getList
};