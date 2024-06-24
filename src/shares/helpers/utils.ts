export const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export const getTimeStampSecond = (time: number): number => {
  return Math.floor(time / 1000);
};

export const randomCodeNumber = (number = 6): string => {
  let randomCode = '';
  for (let i = 0; i < number; i++) {
    const code = Math.floor(Math.random() * 10);
    randomCode = randomCode + code;
  }

  return randomCode;
};

export const decimalToString = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => decimalToString(item));
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data);

    keys.forEach((key) => {
      data[key] =
        data[key].constructor.name === 'Decimal128'
          ? parseFloat(data[key].toString())
          : data[key];
    });

    return data;
  } else {
    return data;
  }
};

export const sortArrayByCreatedAt = (array, sortOrder) => {
  return array.sort((a, b) => {
    if (sortOrder === 1) {
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      if (a.createdAt > b.createdAt) {
        return 1;
      }
    } else if (sortOrder === -1) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
    }
    return 0;
  });
};

export const checkElementsExist = (
  sourceArray: number[],
  targetArray: number[],
): boolean => {
  return sourceArray.some((element) => targetArray.includes(element));
};

export const convertEnumToString = (inputEnum: any): string => {
  const typeInputExcelObject: { [key: string]: string } = {};

  for (const key in inputEnum) {
    if (Object.prototype.hasOwnProperty.call(inputEnum, key)) {
      typeInputExcelObject[key] = inputEnum[key];
    }
  }

  return JSON.stringify(typeInputExcelObject);
};

export const convertEnum = (enumObject: any) => {
  const result = {};
  for (const key in enumObject) {
    if (typeof enumObject[key] === 'number') {
      result[key] = enumObject[key];
    }
  }

  return result;
};
