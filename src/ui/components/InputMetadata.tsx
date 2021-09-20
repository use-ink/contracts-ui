// import React, { createRef, useCallback, useMemo, useState } from 'react';
// import Dropzone, { DropzoneRef } from 'react-dropzone';
// import { XIcon } from '@heroicons/react/solid';
// import { DocumentTextIcon } from '@heroicons/react/outline';
// import { hexToU8a, isHex, u8aToString } from '@polkadot/util';
// import type { Abi, FileState, InputFileProps as Props } from 'types';
// import { InputFile } from './InputFile';

// interface Props {

//   value: Abi | null;
// }

// export function InputMetadata ({
//   accept = '*/*',
//   className = '',
//   errorMessage,
//   isDisabled = false,
//   isError,
//   // isSupplied,
//   onChange,
//   placeholder,
//   successMessage = 'File uploaded!',
//   ...props
// }: Props) {

//   return (
//     <InputFile
      
//       isError={isError}
//       {...props}
//   )
// }