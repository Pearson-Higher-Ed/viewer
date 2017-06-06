/**
PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *  Copyright © 2017 Pearson Education, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 * patent applications, and are protected by trade secret or copyright law.
 * Dissemination of this information, reproduction of this material, and copying or distribution of this software
 * is strictly forbidden unless prior written permission is obtained
 * from Pearson Education, Inc.
**/

// language jsons
import frJson from '../../translations/fr.json';
import tsJson from '../../translations/pseudo.json';
import enJson from '../../translations/en.json';

const translations = {
  en: enJson,
  fr: frJson,
  ts: tsJson
};

const localeProps = new WeakMap();

export default class InternationalSupport {
  constructor(localeStr) {
    const locale = localeStr || 'en';
    localeProps.set(this, {
      locale,
      messages: translations[locale]
    });
  }

  getLocale = () => localeProps.get(this).locale;

  getMessages = () => localeProps.get(this).messages;
}
