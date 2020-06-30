import { IBase } from "./base";

// TODO validation and enums
interface IPackage extends IBase {
  Id: string;

  // version stuff
  Versions: string[];
  Latest: {
    Name: string;
    Publisher: string;
    Description?: string;
    License?: string;
  };

  // extra
  IconUrl?: string;

  // internal
  PaddedVersion: string;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  IPackage,
};
