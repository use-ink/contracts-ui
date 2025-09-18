module.exports = {
  __version: '15.2.0',
  'Storage Types Contract': {
    'DryRun getUnsignedIntegers': {
      1: "<code>{\n  u128ValueMax: '340,282,366,920,938,463,463,374,607,431,768,211,455',\n  u128ValueMin: '0',\n  u16ValueMax: '65,535',\n  u16ValueMin: '0',\n  u32ValueMax: '4,294,967,295',\n  u32ValueMin: '0',\n  u64ValueMax: '18,446,744,073,709,551,615',\n  u64ValueMin: '0',\n  u8ValueMax: '255',\n  u8ValueMin: '0',\n  }</code>",
    },
    'DryRun getSignedIntegers': {
      1: "<code>{\n  i128ValueMax: '170,141,183,460,469,231,731,687,303,715,884,105,727',\n  i128ValueMin: '-170,141,183,460,469,231,731,687,303,715,884,105,728',\n  i16ValueMax: '32,767',\n  i16ValueMin: '-32,768',\n  i32ValueMax: '2,147,483,647',\n  i32ValueMin: '-2,147,483,648',\n  i64ValueMax: '9,223,372,036,854,775,807',\n  i64ValueMin: '-9,223,372,036,854,775,808',\n  i8ValueMax: '127',\n  i8ValueMin: '-128',\n  }</code>",
    },
    'DryRun getInkPreludeTypes': {
      1: "<code>{\n  stringValue: 'This is a string',\n  vecStringValue: [\n  'This is a String',\n  'This is another String',\n  ],\n  vecVecStringValue: [\n  [\n  'This is a String',\n  'This is another String',\n  ],\n  ],\n  }</code>",
    },
    'DryRun getSubstrateTypes': {
      1: "<code>{\n  accountIdValue: '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM',\n  balanceValueMax: '340,282,366,920,938,463,463,374,607,431,768,211,455',\n  balanceValueMin: '0',\n  hashValue:\n  '0x0000000000000000000000000000000000000000000000000000000000000000',\n  }</code>",
    },
    'DryRun getPrimitiveTypes': {
      1: "<code>{\n  boolValue: true,\n  enumWithoutValues: 'A',\n  enumWithValues: {\n  ThreeValues: [\n  '1',\n  '2',\n  '3',\n  ],\n  },\n  arrayValue: [\n  '3',\n  '2',\n  '1',\n  ],\n  tupleValue: [\n  '7',\n  '8',\n  ],\n  tupleTripletValue: [\n  '-123',\n  '0',\n  '123',\n  ],\n  }</code>",
    },
    'DryRun getOptionNone': {
      1: '<code>null</code>',
    },
    'DryRun getResultError': {
      1: '<code>EmptyError</code>',
    },
    'DryRun getPanic': {
      1: '<code>ContractTrapped</code>',
    },
    'DryRun getOptionSome': {
      1: '<code>true</code>',
    },
    'DryRun getResultOk': {
      1: '<code>{\n  Ok: true,\n  }</code>',
    },
  },
};
