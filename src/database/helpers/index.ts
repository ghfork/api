import muuid from "uuid-mongodb";
// import rfdc from "rfdc";

import {
  padSemver,
  sortSemver,
  rebuildPackage,
  addOrUpdatePackage,
  removePackage,
  generateMetaphones,
  generateNGrams,
} from "./package";
import {
  IBase,
  IBaseFindManyOptions,
  IBaseInternalFindManyOptions,
  IBaseFindOneOptions,
  IBaseInternalFindOneOptions,
  IBaseFilters,
  IBaseInternalFilters,
} from "../types";

// const clone = rfdc();

// TODO: refactor these into 1 or 2, somehow...
const mapInternalFilters = <T extends IBase>(filters: IBaseFilters<T>): IBaseInternalFilters<T> => {
  // const clonedFilters = clone(filters);

  const mappedFilters = {
    ...filters,
    ...(filters.uuid == null ? {} : { _id: muuid.from(filters.uuid) }),
    uuid: undefined,
  };

  // Reflect.deleteProperty(mappedFilters, "uuid");

  return mappedFilters;
};

const mapInternalFindOneOptions = <T extends IBase>(options: IBaseFindOneOptions<T>): IBaseInternalFindOneOptions<T> => {
  // const clonedOptions = clone(options);

  const mappedOptions = {
    ...options,
    filters: undefined,

    where: {
      ...options.filters,
      ...(options.filters?.uuid == null ? {} : { _id: muuid.from(options.filters.uuid) }),

      uuid: undefined,
    },
  };

  // Reflect.deleteProperty(mappedOptions, "filters");
  // Reflect.deleteProperty(mappedOptions.where, "uuid");

  return mappedOptions;
};

const mapInternalFindManyOptions = <T extends IBase>(options: IBaseFindManyOptions<T>): IBaseInternalFindManyOptions<T> => {
  // const clonedOptions = clone(options);

  // console.log(options);

  const mappedOptions = {
    ...options,
    filters: undefined,

    where: {
      ...options.filters,
      ...(options.filters?.uuid == null ? {} : { _id: muuid.from(options.filters.uuid) }),
      uuid: undefined,
    },
  };

  // Reflect.deleteProperty(mappedOptions, "filters");
  // Reflect.deleteProperty(mappedOptions.where, "uuid");

  return mappedOptions;
};

// NOTE: can make this more complex to work with more data types but this will do for now
const dedupe = (array: string[]): string[] => array.filter((e, i, a) => i === a.findIndex(f => e === f));

// mdn: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const escapeRegex = (str: string): string => str.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");

export {
  mapInternalFilters,
  mapInternalFindOneOptions,
  mapInternalFindManyOptions,

  padSemver,
  sortSemver,
  rebuildPackage,
  addOrUpdatePackage,
  removePackage,
  generateMetaphones,
  generateNGrams,

  dedupe,
  escapeRegex,
};
