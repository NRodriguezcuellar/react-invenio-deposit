// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Accordion, Form, Icon } from 'semantic-ui-react';
import { TextField, RemoteSelectField } from 'react-invenio-forms';
import { i18next } from '@translations/i18next';
import _isEmpty from 'lodash/isEmpty';

function CustomAwardForm({ deserializeFunder, selectedFunding }) {
  const existsFunding = !!(
    selectedFunding?.award?.title && selectedFunding?.award?.number
  );
  const [accordionActive, setAccordionActive] = useState(existsFunding);

  function deserializeFunderToDropdown(funderItem) {
    let funderName = null;
    let funderPID = null;

    if (funderItem.name) {
      funderName = funderItem.name;
    }

    if (funderItem.pid) {
      funderPID = funderItem.pid;
    }

    if (!funderName && !funderPID) {
      return {};
    }

    return {
      text: funderName || funderPID,
      value: funderItem.id,
      key: funderItem.id,
      ...(funderName && { name: funderName }),
      ...(funderPID && { pid: funderPID }),
    };
  }

  function serializeFunderFromDropdown(funderDropObject) {
    return {
      id: funderDropObject.key,
      ...(funderDropObject.name && { name: funderDropObject.name }),
      ...(funderDropObject.pid && { pid: funderDropObject.pid }),
    };
  }

  return (
    <Form>
      <RemoteSelectField
        fieldPath="selectedFunding.funder.id"
        suggestionAPIUrl="/api/funders"
        suggestionAPIHeaders={{
          // Accept: 'application/vnd.inveniordm.v1+json',
          // TODO replace 'Accept' header when backend supports internationalisation.
          Accept: 'application/json',
        }}
        placeholder={i18next.t('Search for a funder by name')}
        serializeSuggestions={(funders) => {
          return funders.map((funder) =>
            deserializeFunderToDropdown(deserializeFunder(funder))
          );
        }}
        searchInput={{
          autoFocus: _isEmpty(selectedFunding),
        }}
        label={i18next.t('Funder')}
        noQueryMessage={i18next.t('Search for funder...')}
        clearable
        allowAdditions={false}
        multiple={false}
        selectOnBlur={false}
        selectOnNavigation={false}
        required
        search={(options) => options}
        onValueChange={({ formikProps }, selectedFundersArray) => {
          if (selectedFundersArray.length === 1) {
            const selectedFunder = selectedFundersArray[0];
            if (selectedFunder) {
              const deserializedFunder =
                serializeFunderFromDropdown(selectedFunder);
              formikProps.form.setFieldValue(
                'selectedFunding.funder',
                deserializedFunder
              );
            }
          }
        }}
      />
      <Form.Group widths="equal">
        <TextField
          label={i18next.t('Number')}
          placeholder={i18next.t('Award number')}
          fieldPath="selectedFunding.award.number"
        />
        <TextField
          label={i18next.t('Title')}
          placeholder={i18next.t('Award Title')}
          fieldPath="selectedFunding.award.title"
        />
        <TextField
          label={i18next.t('URL')}
          placeholder={i18next.t('Award URL')}
          fieldPath="selectedFunding.award.url"
        />
      </Form.Group>
    </Form>
  );
}

CustomAwardForm.propTypes = {
  deserializeFunder: PropTypes.func.isRequired,
  selectedFunding: PropTypes.object,
};

export default CustomAwardForm;
