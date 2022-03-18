import {generateLink, APP_IDS} from '../../../../api/kintone';
import {generateDoNetLink} from '../../../../api/doNet';

export const header = (textHeader: string) => {
  return [
    {
      'type': 'header',
      'text': {
        'type': 'plain_text',
        'text': ':newspaper: 長期追客顧客',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${textHeader}\nお客様へのご連絡・ご対応をお願いします！`,
      },
    },
    {type: 'divider'},
  ];
};

export const mainContents = (record: LongTermCustomerType) => {
  const {
    custId,
    顧客名: name,
    店舗名: storeName,
    担当者名: aGName,
    phoneNum: phone,
    mobileNum: mobile,
    メールアドレス: email,
    市: city,
    都道府県: pref,
    '町名・番地': houseNo,
  } = record;
  return [
    {
      'type': 'section',
      'fields': [
        ['顧客番号', custId.value],
        ['お客様名', name.value],
        ['店舗', storeName.value],
        ['担当者', aGName.value],
        ['連絡先', [phone.value, mobile.value, email.value].join('\n')],
        ['住所', `${pref.value} ${city.value} ${houseNo.value}`],
      ].map(
        ([label, value])=> ({type: 'mrkdwn', text: `*${label}：*\n${value}`}),
      ),
    },

    {type: 'divider'},
  ];
};

export const notesAndCancelReason = (record: LongTermCustomerType) =>{
  const {
    biko: notes,
    reasonCancel,
  } = record;

  const content = [
    notes.value,
    reasonCancel.value,
  ]
    .filter((item) => item !== '無')
    .join('\n');

  if (!content) {
    return [];
  }

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',

        text: `*備考/他決中止理由:*\n ${[
          notes.value,
          reasonCancel.value,
        ]
          .filter((item) => item !== '無')
          .join('\n')}`,
      },
    },
    {type: 'divider'},
  ];
};

export const longtermReason = (record: LongTermCustomerType) => {
  const {
    長期追客理由: reasonForFFLongterm,
    長期理由詳細: reasonDetails,
  } = record;

  const content = [
    reasonForFFLongterm.value,
    reasonDetails.value,
  ]
    .filter((item) => item !== '無')
    .join('\n');

  if (!content) {
    return [];
  }

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',

        text: `*長期追客理由:*\n ${[reasonForFFLongterm.value, reasonDetails.value]
          .filter((item) => item !== '無')
          .join('\n')}`,
      },
    },

    {type: 'divider'},
  ];
};

export const footNote = (record: LongTermCustomerType) => {
  const {
    追客可能時期: dueDate,
    custId,
    $id: id,
  } = record;

  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': [
            `*追客可能時期:* ${dueDate.value}`,
            `<${generateLink(APP_IDS.longTermCustomers, id.value)}|Kintoneで開く>`,
            `<${generateDoNetLink(custId.value)}|DoNetworkで開く> 事前にブラウザでログインが必須`,
          ].join('\n'),
        },
      ],
    },
    {type: 'divider'},
  ];
};